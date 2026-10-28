"use client";

import Image from "next/image";
import {
  ArrowDownToLine,
  Bookmark,
  Check,
  ChevronDown,
  Clapperboard,
  Copy,
  Film,
  Maximize2,
  Play,
  Plus,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { LazyVideo } from "@/components/lazy-video";
import { useLocalCreations } from "@/lib/local-creations";
import { readLocalSettings } from "@/lib/local-settings";
import { useStudioReducedMotion } from "@/lib/use-studio-reduced-motion";

type VideoInspiration = {
  kind: "video";
  title: string;
  category: string;
  filename: string;
  poster: string;
  prompt: string;
  ratio: "portrait" | "landscape";
};

type ImageInspiration = {
  kind: "image";
  title: string;
  category: string;
  filename: string;
  prompt: string;
  ratio: "portrait" | "landscape" | "square";
};

type Inspiration = VideoInspiration | ImageInspiration;

const motionPresets = [
  { name: "Cinematic Orbit", description: "A measured sweep around the subject", icon: Film },
  { name: "Smooth Tracking", description: "Follow the action with a steady camera", icon: Clapperboard },
  { name: "Slow Push-In", description: "Drift closer to reveal the scene", icon: Plus },
  { name: "Aerial Flythrough", description: "Glide across an expansive world", icon: Play },
  { name: "Abstract Motion", description: "Shape, color, and light in motion", icon: Sparkles },
] as const;

const videoRatios = ["16:9", "9:16", "1:1"] as const;
const durations = [5, 10] as const;
type VideoRatio = (typeof videoRatios)[number];
type Preview = Inspiration | null;

const inspiration: Inspiration[] = [
  {
    kind: "video",
    title: "Create Beyond Reality",
    category: "Cinematic · Sample video",
    filename: "Hero.mp4",
    poster: "video-poster-small.webp",
    prompt: "A cinematic neon world unfolding from darkness, luminous architecture, smooth camera movement, golden highlights",
    ratio: "landscape",
  },
  {
    kind: "video",
    title: "Candlelight",
    category: "Cinematic · Sample video",
    filename: "candle.mp4",
    poster: "video-poster-small.webp",
    prompt: "A quiet candlelit scene, warm flickering light, intimate cinematic atmosphere",
    ratio: "portrait",
  },
  {
    kind: "video",
    title: "Into the Open",
    category: "Cinematic · Sample video",
    filename: "horse.mp4",
    poster: "video-poster-small.webp",
    prompt: "A horse moving through an expansive landscape, natural light, cinematic motion",
    ratio: "landscape",
  },
  {
    kind: "video",
    title: "City Ride",
    category: "Cinematic · Sample video",
    filename: "illustration-bike.mp4",
    poster: "video-poster-small.webp",
    prompt: "An illustrated bicycle ride through a vivid city, smooth tracking movement",
    ratio: "landscape",
  },
  {
    kind: "video",
    title: "Midnight Drive",
    category: "Cinematic · Sample video",
    filename: "porsche.mp4",
    poster: "video-poster-small.webp",
    prompt: "A sports car cruising through a cinematic night scene, glowing reflections",
    ratio: "landscape",
  },
  {
    kind: "video",
    title: "Rain City",
    category: "Cinematic · Sample video",
    filename: "rain-city.mp4",
    poster: "video-poster-small.webp",
    prompt: "A rain-swept city at night, reflections across the street, atmospheric camera movement",
    ratio: "landscape",
  },
  {
    kind: "video",
    title: "Visual Study",
    category: "Cinematic · Sample video",
    filename: "video.mp4",
    poster: "video-poster-small.webp",
    prompt: "A cinematic visual study with expressive movement, light, and atmosphere",
    ratio: "landscape",
  },
  {
    kind: "video",
    title: "Light in Motion",
    category: "Cinematic · Sample video",
    filename: "videoo.mp4",
    poster: "video-poster-small.webp",
    prompt: "A luminous scene in motion, layered color and cinematic light",
    ratio: "landscape",
  },
  {
    kind: "image",
    title: "Afterlight Megacity",
    category: "Sci-Fi · Sample still",
    filename: "Futuristic Megacity Artwork.png",
    prompt: "A camera glides toward a vast futuristic megacity at twilight, atmospheric haze, cyan and violet lights, cinematic scale",
    ratio: "landscape",
  },
  {
    kind: "image",
    title: "Where the Tides Glow",
    category: "Fantasy · Sample still",
    filename: "Alien Ocean Planet.png",
    prompt: "A slow aerial drift over a luminous alien ocean, crystal islands, violet clouds, soft golden horizon",
    ratio: "portrait",
  },
  {
    kind: "image",
    title: "Chrome After Dark",
    category: "Cinematic · Sample still",
    filename: "Futuristic Supercar Scene.png",
    prompt: "A smooth tracking shot beside a chrome supercar in a neon city, wet pavement, vivid cyan reflections",
    ratio: "landscape",
  },
  {
    kind: "image",
    title: "Monument to Tomorrow",
    category: "Fantasy · Sample still",
    filename: "Futuristic Monument Art.png",
    prompt: "A gentle cinematic push-in toward a monumental structure in an imagined world, ethereal light and atmospheric depth",
    ratio: "square",
  },
];

function assetPath(filename: string) {
  return `/assets/${encodeURIComponent(filename)}`;
}

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds)) return "";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [motionPreset, setMotionPreset] = useState<(typeof motionPresets)[number]["name"]>("Cinematic Orbit");
  const [ratio, setRatio] = useState<VideoRatio>("16:9");
  const [duration, setDuration] = useState<(typeof durations)[number]>(5);
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState<Preview>(null);
  const [sampleDuration, setSampleDuration] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reduceMotion = useStudioReducedMotion();
  const { items: savedCreations, save } = useLocalCreations();

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setMotionPreset(readLocalSettings().videoMotion);
      } catch {
        setNotice("Saved creative preferences couldn’t be read. Using the studio defaults for this visit.");
      }
    });
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (preview && !dialog.open) dialog.showModal();
    if (!preview && dialog.open) dialog.close();
  }, [preview]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(
      "Live AI video generation isn’t connected yet. Your prompt and motion settings are ready, but no video has been generated.",
    );
  }

  async function copyPrompt(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setNotice("Prompt copied to clipboard.");
    } catch {
      setNotice("Couldn’t access the clipboard. Select and copy the prompt text manually.");
    }
  }

  function applyPrompt(value: string) {
    setPrompt(value);
    setNotice("Sample prompt added. Edit it to make it your own.");
    document.getElementById("video-prompt")?.focus();
    window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
  }

  function openPreview(item: Inspiration) {
    setPreview(item);
  }

  return (
    <section aria-labelledby="video-generator-title" className="image-generator-page video-generator-page">
      <div aria-hidden="true" className="generator-ambient generator-ambient-one" />
      <div aria-hidden="true" className="generator-ambient generator-ambient-two" />
      <div className="generator-container">
        <header className="generator-heading">
          <div>
            <p className="generator-eyebrow"><span /> MOTION STUDIO <span className="generator-demo-pill">DEMO MODE</span></p>
            <h1 id="video-generator-title">Bring Your Ideas <strong>to Motion</strong></h1>
            <p className="generator-intro">
              Describe the moment, choose a camera direction, and prepare a video creation brief.
            </p>
          </div>
          <div aria-label="Video generation provider status" className="generator-provider-status">
            <span />
            AI provider not connected
          </div>
        </header>

        <div className="generator-workspace">
          <motion.form
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            className="generator-controls video-generator-controls"
            initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
            onSubmit={submit}
            transition={{ duration: 0.35 }}
          >
            <div className="generator-panel-heading">
              <span className="generator-panel-icon video-panel-icon"><Clapperboard aria-hidden="true" /></span>
              <div><h2>Motion brief</h2><p>Set the scene and camera direction.</p></div>
            </div>

            <div className="generator-prompt-field">
              <div className="generator-label-row">
                <label htmlFor="video-prompt">Your video prompt</label>
                <span>Describe the scene and its movement</span>
              </div>
              <textarea
                id="video-prompt"
                maxLength={1200}
                onChange={(event) => {
                  setPrompt(event.target.value);
                  setNotice("");
                }}
                placeholder="A lone explorer walks through a rain-swept neon city, reflections ripple across the street as the camera slowly tracks forward..."
                value={prompt}
              />
              <div className="generator-prompt-footer">
                <span><Sparkles aria-hidden="true" /> Describe the subject, camera movement, and atmosphere</span>
                <span>{prompt.length}/1200</span>
              </div>
            </div>

            <fieldset className="generator-fieldset">
              <legend>Choose a motion direction</legend>
              <div className="video-motion-grid">
                {motionPresets.map(({ name, description, icon: Icon }) => (
                  <button
                    aria-pressed={motionPreset === name}
                    className={`video-motion-option ${motionPreset === name ? "is-selected" : ""}`}
                    key={name}
                    onClick={() => setMotionPreset(name)}
                    type="button"
                  >
                    <span className="video-motion-icon"><Icon aria-hidden="true" /></span>
                    <span className="video-motion-copy"><strong>{name}</strong><small>{description}</small></span>
                    {motionPreset === name && <span aria-hidden="true" className="video-motion-check"><Check /></span>}
                  </button>
                ))}
              </div>
              <p className="generator-style-description">{motionPreset} is a demo direction only; no motion model is connected.</p>
            </fieldset>

            <div className="generator-option-row video-option-row">
              <fieldset className="generator-fieldset generator-compact-fieldset">
                <legend>Aspect ratio</legend>
                <div aria-label="Aspect ratio" className="generator-segmented" role="group">
                  {videoRatios.map((option) => (
                    <button
                      aria-pressed={ratio === option}
                      className={ratio === option ? "is-selected" : ""}
                      key={option}
                      onClick={() => setRatio(option)}
                      type="button"
                    >{option}</button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="generator-fieldset generator-compact-fieldset">
                <legend>Requested duration <small>Demo setting</small></legend>
                <div aria-label="Requested demo duration" className="generator-segmented" role="group">
                  {durations.map((option) => (
                    <button
                      aria-pressed={duration === option}
                      className={duration === option ? "is-selected" : ""}
                      key={option}
                      onClick={() => setDuration(option)}
                      type="button"
                    >{option} sec</button>
                  ))}
                </div>
              </fieldset>
            </div>

            <details className="generator-advanced">
              <summary><span><ChevronDown aria-hidden="true" /> Advanced settings</span><small>Optional controls</small></summary>
              <div className="generator-advanced-content">
                <label className="generator-advanced-field" htmlFor="video-negative-prompt">
                  <span>Negative prompt</span>
                  <textarea
                    id="video-negative-prompt"
                    onChange={(event) => setNegativePrompt(event.target.value)}
                    placeholder="Motion or elements you’d prefer to avoid"
                    rows={2}
                    value={negativePrompt}
                  />
                </label>
                <p className="video-demo-settings"><Sparkles aria-hidden="true" /> Aspect ratio and duration are demonstration settings only. Provider support has not been configured.</p>
              </div>
            </details>

            <div className="generator-submit-wrap">
              <button className="generator-submit video-submit" disabled={!prompt.trim()} type="submit">
                <Film aria-hidden="true" /> Generate Video <span>DEMO</span>
              </button>
              <p><Clapperboard aria-hidden="true" /> No AI video output will be created in this demo.</p>
            </div>
          </motion.form>

          <section aria-labelledby="video-preview-heading" className="generator-preview-panel video-preview-panel">
            <div className="generator-preview-heading">
              <div><p className="generator-eyebrow">MOTION CANVAS</p><h2 id="video-preview-heading">Your video</h2></div>
              <span className="generator-preview-badge"><span /> EMPTY CANVAS</span>
            </div>
            <div
              className={`generator-empty-state video-empty-state ratio-${ratio.replace(":", "-")}`}
              style={{ aspectRatio: ratio.replace(":", " / ") }}
            >
              <div aria-hidden="true" className="video-empty-art">
                <span className="video-empty-frame frame-back" />
                <span className="video-empty-frame frame-front"><Play /></span>
                <span className="video-empty-trail trail-one" />
                <span className="video-empty-trail trail-two" />
                <span className="video-empty-light light-one" />
                <span className="video-empty-light light-two" />
              </div>
              <p className="generator-empty-label">NO VIDEO GENERATED</p>
              <h3>Give your idea a sense of motion.</h3>
              <p className="generator-empty-copy">Add a prompt to prepare a motion brief. Live AI video generation is not connected, so this demo won’t create a video.</p>
              <div className="generator-empty-tags"><span>{motionPreset}</span><span>{ratio}</span><span>{duration} sec · demo</span></div>
            </div>
            <div aria-live="polite" className={`generator-notice ${notice ? "is-visible" : ""}`} role={notice ? "status" : undefined}>
              {notice && <><Sparkles aria-hidden="true" /><span>{notice}</span></>}
            </div>
            <div className="generator-preview-actions">
              <button disabled={!prompt.trim()} onClick={() => void copyPrompt(prompt)} type="button"><Copy aria-hidden="true" /> Copy prompt</button>
              <span><ArrowDownToLine aria-hidden="true" /> Downloads apply to sample media only</span>
            </div>
          </section>
        </div>

        <section aria-labelledby="video-inspiration-heading" className="generator-inspiration">
          <div className="generator-inspiration-heading">
            <div><p className="generator-eyebrow">CURATED DEMO MEDIA</p><h2 id="video-inspiration-heading">Explore motion and mood</h2><p>Existing sample videos and still artwork for visual direction—not generated videos.</p></div>
            <span className="generator-inspiration-count">SAMPLE COLLECTION <span>·</span> {inspiration.length} VISUALS</span>
          </div>
          <div className="generator-inspiration-grid video-inspiration-grid">
            {inspiration.map((item, index) => (
              <article className={`generator-inspiration-card ${item.ratio === "portrait" ? "inspiration-portrait" : item.ratio === "square" ? "inspiration-square" : ""} ${item.kind === "video" ? "video-inspiration-card" : ""}`} key={item.title}>
                <div className="generator-inspiration-media">
                  {item.kind === "video" ? (
                    <>
                      <LazyVideo
                        aria-label="Neon Cinema sample video reel"
                        className="video-card-player"
                        controls
                        onLoadedMetadata={(event) => setSampleDuration(formatDuration(event.currentTarget.duration))}
                        poster={assetPath(item.poster)}
                        src={assetPath(item.filename)}
                      />
                      <span className="video-asset-label"><Play aria-hidden="true" /> REAL SAMPLE VIDEO{sampleDuration ? ` · ${sampleDuration}` : ""}</span>
                    </>
                  ) : (
                    <Image alt={item.title} fill sizes="(max-width: 640px) 90vw, (max-width: 1000px) 42vw, 28vw" src={assetPath(item.filename)} />
                  )}
                  {item.kind === "image" && <div className="generator-inspiration-overlay" />}
                  {item.kind === "image" && (
                    <span className="generator-sample-badge">SAMPLE <span>·</span> {item.category.split(" · ")[0]}</span>
                  )}
                  <button aria-label={`Preview ${item.title}`} className="generator-card-preview" onClick={() => openPreview(item)} type="button"><Maximize2 aria-hidden="true" /></button>
                </div>
                <div className="generator-inspiration-card-info">
                  <div><h3>{item.title}</h3><span>{item.category}</span></div>
                  <div className="generator-inspiration-actions">
                    <button
                      aria-label={savedCreations.some((creation) => creation.kind === item.kind && creation.filename === item.filename) ? `${item.title} saved to Creations` : `Save ${item.title} to Creations`}
                      className="generator-save-sample"
                      disabled={savedCreations.some((creation) => creation.kind === item.kind && creation.filename === item.filename)}
                      onClick={() => {
                        const result = save({
                          kind: item.kind,
                          title: item.title,
                          category: item.category,
                          filename: item.filename,
                          prompt: item.prompt,
                        });
                        setNotice(result.saved ? `${item.title} saved to this browser’s Creations library.` : result.error);
                      }}
                      type="button"
                    >
                      <Bookmark aria-hidden="true" /> {savedCreations.some((creation) => creation.kind === item.kind && creation.filename === item.filename) ? "Saved" : "Save"}
                    </button>
                    <button aria-label={`Use prompt for ${item.title}`} className="generator-use-prompt" onClick={() => applyPrompt(item.prompt)} type="button">
                      Use Prompt <Plus aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <span aria-hidden="true" className={`generator-card-index index-${index + 1}`}>0{index + 1}</span>
              </article>
            ))}
          </div>
        </section>
      </div>

      <dialog
        aria-label={preview ? `${preview.title} sample preview` : "Sample preview"}
        className="generator-preview-dialog video-preview-dialog"
        onCancel={(event) => { event.preventDefault(); setPreview(null); }}
        onClick={(event) => { if (event.target === event.currentTarget) setPreview(null); }}
        onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); setPreview(null); } }}
        onClose={() => setPreview(null)}
        ref={dialogRef}
      >
        {preview && (
          <div className="generator-dialog-content">
            <div className="generator-dialog-image">
              {preview.kind === "video" ? (
                <LazyVideo
                  aria-label="Neon Cinema sample reel playback"
                  autoPlay
                  controls
                  poster={preview.kind === "video" ? assetPath(preview.poster) : undefined}
                  priority
                  src={assetPath(preview.filename)}
                />
              ) : (
                <Image alt={preview.title} fill priority sizes="(max-width: 900px) 94vw, 78vw" src={assetPath(preview.filename)} />
              )}
              <button aria-label="Close preview" className="generator-dialog-close" onClick={() => setPreview(null)} type="button"><X aria-hidden="true" /></button>
              <span className="generator-sample-badge">{preview.kind === "video" ? "EXISTING SAMPLE REEL" : "CURATED SAMPLE STILL"}</span>
            </div>
            <div className="generator-dialog-details">
              <div><span>{preview.category}</span><h2>{preview.title}</h2><p>{preview.prompt}</p></div>
              <div className="generator-dialog-actions">
                <button onClick={() => applyPrompt(preview.prompt)} type="button"><WandSparkles aria-hidden="true" /> Use prompt</button>
                <button onClick={() => void copyPrompt(preview.prompt)} type="button"><Copy aria-hidden="true" /> Copy prompt</button>
                <a download={preview.filename} href={assetPath(preview.filename)}><ArrowDownToLine aria-hidden="true" /> Download sample</a>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
