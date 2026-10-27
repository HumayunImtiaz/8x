"use client";

import { motion } from "framer-motion";
import {
  BellRing,
  Check,
  CircleHelp,
  Film,
  Image as ImageIcon,
  Moon,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  defaultLocalSettings,
  imageRatios,
  imageStyles,
  readLocalSettings,
  settingsStorageKey,
  videoMotionPresets,
  writeLocalSettings,
  type LocalSettings,
} from "@/lib/local-settings";
import { useLocalCreations } from "@/lib/local-creations";
import { useStudioReducedMotion } from "@/lib/use-studio-reduced-motion";

function Switch({
  checked,
  description,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="settings-switch-row">
      <span className="settings-switch-copy">
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <input
        checked={checked}
        className="settings-switch-input"
        onChange={(event) => onChange(event.target.checked)}
        role="switch"
        type="checkbox"
      />
      <span aria-hidden="true" className="settings-switch-track"><span /></span>
    </label>
  );
}

export function SettingsPage() {
  const [settings, setSettings] = useState<LocalSettings>(defaultLocalSettings);
  const [loaded, setLoaded] = useState(false);
  const [storageInvalid, setStorageInvalid] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const confirmationRef = useRef<HTMLDialogElement>(null);
  const reduceMotion = useStudioReducedMotion();
  const { items, loading: creationsLoading, error: creationsError, clearAll } = useLocalCreations();

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setSettings(readLocalSettings());
        setStorageInvalid(false);
        setError("");
      } catch (reason) {
        setStorageInvalid(true);
        setError(reason instanceof Error ? reason.message : "Could not read local settings.");
      } finally {
        setLoaded(true);
      }
    });
    function syncSettings(event: StorageEvent) {
      if (event.key !== settingsStorageKey) return;
      try {
        setSettings(readLocalSettings());
        setStorageInvalid(false);
        setError("");
      } catch (reason) {
        setStorageInvalid(true);
        setError(reason instanceof Error ? reason.message : "Could not read local settings.");
      }
    }
    window.addEventListener("storage", syncSettings);
    return () => window.removeEventListener("storage", syncSettings);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    document.documentElement.dataset.userReducedMotion = String(settings.reducedMotion);
  }, [loaded, settings.reducedMotion]);

  useEffect(() => {
    const dialog = confirmationRef.current;
    if (!dialog) return;
    if (confirmingDelete && !dialog.open) dialog.showModal();
    if (!confirmingDelete && dialog.open) dialog.close();
  }, [confirmingDelete]);

  function persist(next: LocalSettings) {
    setSettings(next);
    setNotice("");
    if (storageInvalid) {
      setError("Preferences are changing for this visit only because the saved settings are invalid. Existing data was left unchanged.");
      return;
    }
    try {
      writeLocalSettings(next);
      setError("");
      setNotice("Preferences saved in this browser.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save your local preferences.");
    }
  }

  function update<K extends keyof LocalSettings>(key: K, value: LocalSettings[K]) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    if (!storageInvalid) {
      try {
        writeLocalSettings(next);
        setError("");
        setNotice("Preferences saved in this browser.");
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Could not save your local preferences.");
      }
    } else {
      setError("Preferences are changing for this visit only because the saved settings are invalid. Existing data was left unchanged.");
    }
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = {
      ...settings,
      displayName: settings.displayName.trim(),
      bio: settings.bio.trim(),
    };
    if (next.displayName.length > 60 || next.bio.length > 240) {
      setError("Display name must be 60 characters or fewer and bio must be 240 characters or fewer.");
      return;
    }
    persist(next);
    setNotice(storageInvalid ? "" : "Profile preferences saved locally. They are not synced to an account.");
  }

  function deleteCreations() {
    const result = clearAll();
    if (result.cleared) {
      setNotice("Local Creations data was removed from this browser.");
      setError("");
      setConfirmingDelete(false);
      return;
    }
    setError(result.error);
  }

  return (
    <section aria-labelledby="settings-title" className="image-generator-page settings-page">
      <div aria-hidden="true" className="generator-ambient generator-ambient-one" />
      <div aria-hidden="true" className="generator-ambient generator-ambient-two" />
      <div className="generator-container settings-container">
        <header className="settings-heading">
          <div>
            <p className="generator-eyebrow"><span /> PERSONAL WORKSPACE</p>
            <h1 id="settings-title">Your <strong>Settings</strong></h1>
            <p className="generator-intro">
              Tune your creative workspace. Preferences are stored only in this browser; no account or cloud sync is configured.
            </p>
          </div>
          <span className="settings-local-badge"><Moon aria-hidden="true" /> LOCAL PREFERENCES</span>
        </header>

        {error && <p className="settings-message is-error" role="alert">{error}</p>}
        {notice && <p className="settings-message" role="status">{notice}</p>}

        <div className="settings-sections">
          <motion.section
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            className="settings-panel"
            initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="settings-panel-heading">
              <span className="settings-panel-icon icon-violet"><UserRound aria-hidden="true" /></span>
              <div><h2>Profile preferences</h2><p>Optional details saved locally on this device.</p></div>
            </div>
            <form className="settings-profile-form" onSubmit={saveProfile}>
              <label className="settings-field" htmlFor="settings-display-name">
                <span>Display name <small>Optional</small></span>
                <input
                  autoComplete="nickname"
                  id="settings-display-name"
                  maxLength={60}
                  onChange={(event) => setSettings({ ...settings, displayName: event.target.value })}
                  placeholder="How should we address you?"
                  value={settings.displayName}
                />
              </label>
              <label className="settings-field" htmlFor="settings-bio">
                <span>Creative bio <small>Optional</small></span>
                <textarea
                  id="settings-bio"
                  maxLength={240}
                  onChange={(event) => setSettings({ ...settings, bio: event.target.value })}
                  placeholder="A few words about what you love to create..."
                  rows={3}
                  value={settings.bio}
                />
                <small className="settings-character-count">{settings.bio.length}/240</small>
              </label>
              <div className="settings-profile-submit">
                <p><CircleHelp aria-hidden="true" /> Not connected to a real account or profile.</p>
                <button className="settings-primary-button" disabled={!loaded} type="submit"><Check aria-hidden="true" /> Save profile</button>
              </div>
            </form>
          </motion.section>

          <section aria-labelledby="appearance-heading" className="settings-panel">
            <div className="settings-panel-heading">
              <span className="settings-panel-icon icon-cyan"><Moon aria-hidden="true" /></span>
              <div><h2 id="appearance-heading">Appearance</h2><p>Keep the studio comfortable and focused.</p></div>
            </div>
            <div className="settings-appearance-choice">
              <span className="settings-appearance-swatch" aria-hidden="true"><Moon /></span>
              <span><strong>Dark theme</strong><small>The Neon Cinema dark theme is currently supported.</small></span>
              <span className="settings-on-pill">ON</span>
            </div>
            <Switch
              checked={settings.reducedMotion}
              description="Reduce decorative motion and hide the custom cursor in this browser."
              label="Reduce motion"
              onChange={(checked) => update("reducedMotion", checked)}
            />
          </section>

          <section aria-labelledby="creative-heading" className="settings-panel">
            <div className="settings-panel-heading">
              <span className="settings-panel-icon icon-yellow"><SlidersHorizontal aria-hidden="true" /></span>
              <div><h2 id="creative-heading">Creative preferences</h2><p>Choose the starting defaults for your generator briefs.</p></div>
            </div>
            <div className="settings-select-grid">
              <label className="settings-field" htmlFor="settings-image-style">
                <span><ImageIcon aria-hidden="true" /> Default image style</span>
                <select id="settings-image-style" onChange={(event) => update("imageStyle", event.target.value as LocalSettings["imageStyle"])} value={settings.imageStyle}>
                  {imageStyles.map((style) => <option key={style} value={style}>{style}</option>)}
                </select>
              </label>
              <label className="settings-field" htmlFor="settings-image-ratio">
                <span><ImageIcon aria-hidden="true" /> Default image ratio</span>
                <select id="settings-image-ratio" onChange={(event) => update("imageRatio", event.target.value as LocalSettings["imageRatio"])} value={settings.imageRatio}>
                  {imageRatios.map((ratio) => <option key={ratio} value={ratio}>{ratio}</option>)}
                </select>
              </label>
              <label className="settings-field settings-field-wide" htmlFor="settings-video-motion">
                <span><Film aria-hidden="true" /> Default video motion</span>
                <select id="settings-video-motion" onChange={(event) => update("videoMotion", event.target.value as LocalSettings["videoMotion"])} value={settings.videoMotion}>
                  {videoMotionPresets.map((preset) => <option key={preset} value={preset}>{preset}</option>)}
                </select>
              </label>
            </div>
            <p className="settings-note"><Sparkles aria-hidden="true" /> Saved defaults are used when you open the matching generator studio.</p>
          </section>

          <section aria-labelledby="notifications-heading" className="settings-panel">
            <div className="settings-panel-heading">
              <span className="settings-panel-icon icon-magenta"><BellRing aria-hidden="true" /></span>
              <div><h2 id="notifications-heading">Notifications</h2><p>Local interface preferences only—no messages will be sent.</p></div>
            </div>
            <Switch
              checked={settings.productTips}
              description="Show product tips in the interface when available."
              label="Product tips"
              onChange={(checked) => update("productTips", checked)}
            />
            <Switch
              checked={settings.creativeReminders}
              description="Allow creative reminders in the interface when available."
              label="Creative reminders"
              onChange={(checked) => update("creativeReminders", checked)}
            />
            <p className="settings-note"><BellRing aria-hidden="true" /> These switches store preferences only. Email and push notifications are not configured.</p>
          </section>

          <section aria-labelledby="storage-heading" className="settings-panel settings-storage-panel">
            <div className="settings-panel-heading">
              <span className="settings-panel-icon icon-cyan"><ImageIcon aria-hidden="true" /></span>
              <div><h2 id="storage-heading">Storage</h2><p>Your saved Creations stay in this browser profile.</p></div>
            </div>
            {creationsError ? (
              <p className="settings-storage-error" role="alert">{creationsError} The saved data was not counted or modified.</p>
            ) : (
              <div className="settings-storage-count">
                <span><ImageIcon aria-hidden="true" /> LOCAL CREATIONS</span>
                <strong>{creationsLoading ? "…" : items.length}</strong>
              </div>
            )}
            <p className="settings-note"><CircleHelp aria-hidden="true" /> Local to this browser and device. Not backed up, account-linked, or synced.</p>
          </section>

          <section aria-labelledby="data-heading" className="settings-panel settings-danger-panel">
            <div className="settings-panel-heading">
              <span className="settings-panel-icon icon-danger"><Trash2 aria-hidden="true" /></span>
              <div><h2 id="data-heading">Data management</h2><p>Remove saved sample records from this browser.</p></div>
            </div>
            <div className="settings-data-row">
              <span><strong>Delete local Creations</strong><small>Removes library records only. Original sample assets are not deleted.</small></span>
              <button
                className="settings-danger-button"
                disabled={creationsLoading || (items.length === 0 && !creationsError)}
                onClick={() => setConfirmingDelete(true)}
                type="button"
              ><Trash2 aria-hidden="true" /> Delete local data</button>
            </div>
          </section>
        </div>
      </div>

      <dialog
        aria-labelledby="settings-delete-title"
        className="generator-preview-dialog settings-confirm-dialog"
        onCancel={(event) => { event.preventDefault(); setConfirmingDelete(false); }}
        onClick={(event) => { if (event.target === event.currentTarget) setConfirmingDelete(false); }}
        onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); setConfirmingDelete(false); } }}
        onClose={() => setConfirmingDelete(false)}
        ref={confirmationRef}
      >
        <div className="settings-confirm-content">
          <button aria-label="Close confirmation" className="generator-dialog-close" onClick={() => setConfirmingDelete(false)} type="button"><X aria-hidden="true" /></button>
          <span className="settings-confirm-icon"><Trash2 aria-hidden="true" /></span>
          <p className="generator-eyebrow">PERMANENT LOCAL ACTION</p>
          <h2 id="settings-delete-title">Delete local Creations?</h2>
          <p>This removes all saved Creations records from this browser, including favorites. It does not delete original sample assets or data stored elsewhere.</p>
          <div className="settings-confirm-actions">
            <button onClick={() => setConfirmingDelete(false)} type="button">Cancel</button>
            <button className="settings-danger-button" onClick={deleteCreations} type="button"><Trash2 aria-hidden="true" /> Delete records</button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
