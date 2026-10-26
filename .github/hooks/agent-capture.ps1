$ErrorActionPreference = "Stop"

function Get-Field {
    param($Object, [string[]]$Names)

    foreach ($name in $Names) {
        $property = $Object.PSObject.Properties[$name]
        if ($null -ne $property -and $null -ne $property.Value) {
            return $property.Value
        }
    }

    return $null
}

function Get-MessageText {
    param($Value)

    if ($Value -is [string]) {
        return $Value
    }

    if ($Value -is [System.Array]) {
        $parts = foreach ($item in $Value) {
            Get-MessageText $item
        }
        return ($parts -join "")
    }

    if ($null -ne $Value) {
        $text = Get-Field $Value @("text", "content", "message")
        if ($null -ne $text) {
            return (Get-MessageText $text)
        }
    }

    return $null
}

function Get-AssistantResponse {
    param($Event)

    $direct = Get-Field $Event @("lastAssistantMessage", "last_assistant_message", "assistantMessage", "assistant_response", "response")
    if ($direct -is [string] -and $direct.Length -gt 0) {
        return $direct
    }

    $transcriptPath = Get-Field $Event @("transcriptPath", "transcript_path")
    if ($null -eq $transcriptPath -or -not (Test-Path -LiteralPath $transcriptPath -PathType Leaf)) {
        throw "The agent-stop event did not provide a readable transcript or final response."
    }

    $transcript = [System.IO.File]::ReadAllText($transcriptPath, [System.Text.Encoding]::UTF8)
    $messages = @()
    try {
        $document = ConvertFrom-Json -InputObject $transcript
        if ($document -is [System.Array]) {
            $messages = $document
        } elseif ($null -ne $document) {
            $messages = @($document)
        }
    } catch {
        foreach ($line in ($transcript -split "`r?`n")) {
            if ([string]::IsNullOrWhiteSpace($line)) {
                continue
            }
            try {
                $messages += ConvertFrom-Json -InputObject $line
            } catch {
                continue
            }
        }
    }

    $assistantMessages = foreach ($message in $messages) {
        $role = Get-Field $message @("role", "speaker", "author")
        if ($role -is [string] -and $role -match "^(assistant|copilot)$") {
            Get-MessageText (Get-Field $message @("content", "text", "message"))
            continue
        }

        $eventType = Get-Field $message @("type")
        if ($eventType -eq "assistant.message") {
            $data = Get-Field $message @("data")
            Get-MessageText (Get-Field $data @("content"))
        }
    }
    $response = @($assistantMessages | Where-Object { $null -ne $_ -and $_.Length -gt 0 } | Select-Object -Last 1)
    if ($response.Count -eq 0) {
        throw "The transcript contained no final assistant response."
    }
    return $response[0]
}

$rawEvent = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($rawEvent)) {
    throw "Hook received an empty event."
}

$event = ConvertFrom-Json -InputObject $rawEvent
$eventName = Get-Field $event @("hookEventName", "hook_event_name", "eventName", "event")
$sessionId = Get-Field $event @("sessionId", "session_id")
if ([string]::IsNullOrWhiteSpace([string]$sessionId)) {
    throw "Hook event did not include a session identifier."
}

$repoRoot = (Get-Location).Path
$logDirectory = Join-Path $repoRoot ".agent-logs"
$sha256 = [System.Security.Cryptography.SHA256]::Create()
$repoHash = [BitConverter]::ToString($sha256.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($repoRoot))).Replace("-", "")
$sha256.Dispose()
$repoKey = $repoHash.Substring(0, 16)
$stateDirectory = Join-Path ([System.IO.Path]::GetTempPath()) ("8x-agent-capture\" + $repoKey)
[System.IO.Directory]::CreateDirectory($logDirectory) | Out-Null
[System.IO.Directory]::CreateDirectory($stateDirectory) | Out-Null
$encoding = [System.Text.UTF8Encoding]::new($false)
$timestampValue = Get-Field $event @("timestamp")
$timestamp = [DateTime]::UtcNow
if ($null -ne $timestampValue) {
    $parsedTimestamp = [DateTime]::MinValue
    if ([DateTime]::TryParse([string]$timestampValue, [ref]$parsedTimestamp)) {
        $timestamp = $parsedTimestamp.ToUniversalTime()
    }
}
$timestampText = $timestamp.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
$sessionSlug = ([string]$sessionId -replace "[^A-Za-z0-9_-]", "_")
$statePath = Join-Path $stateDirectory ($sessionSlug + ".json")
$logPath = $null

if ([string]$eventName -match "(?i)prompt") {
    $prompt = Get-Field $event @("prompt")
    if ($null -eq $prompt -or $prompt -isnot [string]) {
        throw "Prompt-submission event did not contain a string prompt."
    }

    $model = Get-Field $event @("model", "modelId", "model_id")
    if ([string]::IsNullOrWhiteSpace([string]$model)) {
        $model = "not shown"
    }

    if (Test-Path -LiteralPath $statePath) {
        $state = ConvertFrom-Json -InputObject ([System.IO.File]::ReadAllText($statePath, [System.Text.Encoding]::UTF8))
        $logPath = $state.logPath
        $state.lastPromptTime = $timestampText
    } else {
        $logPath = Join-Path $logDirectory ($timestamp.ToString("yyyy-MM-dd_HH-mm-ss") + "_" + $sessionSlug + ".md")
        $state = [pscustomobject]@{
            sessionId = [string]$sessionId
            logPath = $logPath
            firstPromptTime = $timestampText
            lastPromptTime = $timestampText
            date = $timestamp.ToString("yyyy-MM-dd")
            model = [string]$model
            exchanges = 0
        }
    }
    if (-not (Test-Path -LiteralPath $logPath)) {
        $header = @(
            "---"
            "session_id: $sessionId"
            "date: $($state.date)"
            "author: not provided"
            "model: $($state.model)"
            "tool: vscode-copilot-sdk"
            "project: 8xAssigment"
            "total_exchanges: 0"
            "first_prompt_time: $($state.firstPromptTime)"
            "last_prompt_time: $($state.lastPromptTime)"
            "---"
            ""
            "# Session Log - $($state.date)"
            ""
            "Session: ``$sessionId`` | Project: ``8xAssigment`` | Author: ``not provided``"
            ""
            "---"
            ""
        ) -join "`n"
        [System.IO.File]::WriteAllText($logPath, $header, $encoding)
    }
    $state | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $statePath -Encoding UTF8
    $entry = @(
        "[LOG_ENTRY type=PROMPT num=$($state.exchanges + 1) session=$sessionId]"
        "timestamp: $timestampText"
        "model: $($state.model)"
        ""
        $prompt
        ""
        ""
    ) -join "`n"
    [System.IO.File]::AppendAllText($logPath, $entry, $encoding)
} elseif ([string]$eventName -match "(?i)(agentstop|stop)$") {
    if (-not (Test-Path -LiteralPath $statePath)) {
        throw "No submitted prompt is pending for session $sessionId."
    }
    $state = ConvertFrom-Json -InputObject ([System.IO.File]::ReadAllText($statePath, [System.Text.Encoding]::UTF8))
    $response = Get-AssistantResponse $event
    $state.exchanges++
    $entry = @(
        "[LOG_ENTRY type=RESPONSE num=$($state.exchanges) session=$sessionId]"
        "timestamp: $timestampText"
        "model: $($state.model)"
        ""
        $response
        ""
        ""
    ) -join "`n"
    [System.IO.File]::AppendAllText($state.logPath, $entry, $encoding)
    $contents = [System.IO.File]::ReadAllText($state.logPath, [System.Text.Encoding]::UTF8)
    $contents = [regex]::Replace($contents, "(?m)^total_exchanges: \d+$", "total_exchanges: $($state.exchanges)", 1)
    $contents = [regex]::Replace($contents, "(?m)^last_prompt_time: .+$", "last_prompt_time: $($state.lastPromptTime)", 1)
    [System.IO.File]::WriteAllText($state.logPath, $contents, $encoding)
    $state | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $statePath -Encoding UTF8
} else {
    throw "Unsupported hook event: $eventName"
}

[Console]::Out.WriteLine("{}")
