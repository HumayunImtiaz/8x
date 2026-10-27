"use client";

import Image from "next/image";
import {
  ArrowDownToLine,
  Bookmark,
  Check,
  ChevronDown,
  Clapperboard,
  Copy,
  Download,
  Image as ImageIcon,
  Maximize2,
  Plus,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocalCreations } from "@/lib/local-creations";
import { readLocalSettings } from "@/lib/local-settings";
import { useStudioReducedMotion } from "@/lib/use-studio-reduced-motion";

type Preset = {
  name: string;
  filename: string;
};

type Inspiration = {
  title: string;
  category: string;
  filename: string;
  prompt: string;
  ratio: "portrait" | "landscape" | "square";
};

const presets: Preset[] = [
  { name: "Cinematic", filename: "Cinematic 3D Artwork.png" },
  { name: "Sci-Fi", filename: "Futuristic Megacity Artwork.png" },
  { name: "Fantasy", filename: "Alien Ocean Planet.png" },
  { name: "Photorealistic", filename: "Futuristic Hypercar Scene.png" },
  { name: "Anime", filename: "Futuristic Monument Art.png" },
  { name: "3D Art", filename: "Futuristic Supercar Scene.png" },
];

const inspirations: Inspiration[] = [
  {
    title: "Where the Tides Glow",
    category: "Fantasy · Sample artwork",
    filename: "Alien Ocean Planet.png",
    prompt: "An alien ocean beneath a luminous violet sky, crystal islands, cinematic reflections, atmospheric light",
    ratio: "portrait",
  },
  {
    title: "A World Reimagined",
    category: "Cinematic · Sample artwork",
    filename: "Cinematic 3D Artwork.png",
    prompt: "A cinematic creative world, striking composition, rich shadows, dramatic golden light, fine detail",
    ratio: "square",
  },
  {
    title: "Velocity in Violet",
    category: "Sci-Fi · Sample artwork",
    filename: "Futuristic Hypercar Scene.png",
    prompt: "A futuristic hypercar on a rain-slick neon street, violet reflections, cinematic night photography",
    ratio: "portrait",
  },
  {
    title: "Afterlight Megacity",
    category: "Sci-Fi · Sample artwork",
    filename: "Futuristic Megacity Artwork.png",
    prompt: "A vast future city at twilight, atmospheric haze, glowing architecture, sweeping cinematic perspective",
    ratio: "landscape",
  },
  {
    title: "Monument to Tomorrow",
    category: "Fantasy · Sample artwork",
    filename: "Futuristic Monument Art.png",
    prompt: "A monumental structure in an imagined world, elegant scale, ethereal light, surreal cinematic environment",
    ratio: "square",
  },
  {
    title: "Chrome After Dark",
    category: "Cinematic · Sample artwork",
    filename: "Futuristic Supercar Scene.png",
    prompt: "A sculptural chrome supercar in a neon city, wet pavement, vivid cyan and magenta light, premium film still",
    ratio: "landscape",
  },
];

const ratios = ["1:1", "16:9", "9:16", "4:3"] as const;
const imageCounts = [1, 2, 4] as const;
type Ratio = (typeof ratios)[number];
type Preview = Inspiration | null;

function assetPath(filename: string) {
  return `/assets/${encodeURIComponent(filename)}`;
}

function styleDescription(name: string) {
  switch (name) {
    case "Cinematic":
      return "Film still, dramatic lighting, rich atmosphere";
    case "Sci-Fi":
      return "Futuristic worlds and luminous technology";
    case "Fantasy":
      return "Dreamlike realms with magical light";
    case "Photorealistic":
      return "Natural detail and lifelike materials";
    case "Anime":
      return "Expressive illustration and bold color";
    default:
      return "Sculpted forms and dimensional detail";
  }
}

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [style, setStyle] = useState("Cinematic");
  const [ratio, setRatio] = useState<Ratio>("1:1");
  const [count, setCount] = useState<(typeof imageCounts)[number]>(1);
  const [quality, setQuality] = useState("Standard");
  const [seed, setSeed] = useState("");
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState<Preview>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reduceMotion = useStudioReducedMotion();
  const { items: savedCreations, save } = useLocalCreations();
  const promptLength = prompt.length;

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = readLocalSettings();
        setStyle(saved.imageStyle);
        setRatio(saved.imageRatio);
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
      "Live AI image generation isn’t connected yet. Your prompt and settings are ready, but no image has been generated.",
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
    document.getElementById("image-prompt")?.focus();
    window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
  }

  return (
    <section aria-labelledby="image-generator-title" className="image-generator-page">
      <div className="generator-ambient generator-ambient-one" aria-hidden="true" />
      <div className="generator-ambient generator-ambient-two" aria-hidden="true" />
      <div className="generator-container">
        <header className="generator-heading">
          <div>
            <p className="generator-eyebrow"><span /> IMAGE STUDIO <span className="generator-demo-pill">DEMO MODE</span></p>
            <h1 id="image-generator-title">Create Something <strong>Extraordinary</strong></h1>
            <p className="generator-intro">
              Shape a visual idea with your words, choose a direction, and prepare a creation brief.
            </p>
          </div>
          <div aria-label="Image generation provider status" className="generator-provider-status">
            <span />
            AI provider not connected
          </div>
        </header>

        <div className="generator-workspace">
          <motion.form
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            className="generator-controls"
            initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
            onSubmit={submit}
            transition={{ duration: 0.35 }}
          >
            <div className="generator-panel-heading">
              <span className="generator-panel-icon"><WandSparkles aria-hidden="true" /></span>
              <div><h2>Creation brief</h2><p>Set the direction for your image.</p></div>
            </div>

            <div className="generator-prompt-field">
              <div className="generator-label-row">
                <label htmlFor="image-prompt">Your prompt</label>
                <span>Describe the image you imagine</span>
              </div>
              <textarea
                id="image-prompt"
                maxLength={1200}
                onChange={(event) => {
                  setPrompt(event.target.value);
                  setNotice("");
                }}
                placeholder="A glass observatory above a quiet alien ocean at twilight, cinematic reflections, violet clouds and a warm golden horizon..."
                value={prompt}
              />
              <div className="generator-prompt-footer">
                <span><Sparkles aria-hidden="true" /> Be specific about light, mood, and composition</span>
                <span>{promptLength}/1200</span>
              </div>
            </div>

            <fieldset className="generator-fieldset">
              <legend>Choose a visual style</legend>
              <div className="generator-style-grid">
                {presets.map((preset) => (
                  <button
                    aria-pressed={style === preset.name}
                    className={`generator-style-option ${style === preset.name ? "is-selected" : ""}`}
                    key={preset.name}
                    onClick={() => setStyle(preset.name)}
                    type="button"
                  >
                    <span className="generator-style-thumb">
                      <Image alt="" fill sizes="(max-width: 600px) 25vw, 100px" src={assetPath(preset.filename)} />
                      <span className="generator-style-thumb-shade" />
                    </span>
                    <span className="generator-style-name">{preset.name}</span>
                    {style === preset.name && <span aria-hidden="true" className="generator-style-check"><Check /></span>}
                  </button>
                ))}
              </div>
              <p className="generator-style-description">{styleDescription(style)}</p>
            </fieldset>

            <div className="generator-option-row">
              <fieldset className="generator-fieldset generator-compact-fieldset">
                <legend>Aspect ratio</legend>
                <div aria-label="Aspect ratio" className="generator-segmented" role="group">
                  {ratios.map((option) => (
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
                <legend>Images</legend>
                <div aria-label="Number of images" className="generator-segmented" role="group">
                  {imageCounts.map((option) => (
                    <button
                      aria-pressed={count === option}
                      className={count === option ? "is-selected" : ""}
                      key={option}
                      onClick={() => setCount(option)}
                      type="button"
                    >{option}</button>
                  ))}
                </div>
              </fieldset>
            </div>

            <details className="generator-advanced">
              <summary><span><ChevronDown aria-hidden="true" /> Advanced settings</span><small>Optional controls</small></summary>
              <div className="generator-advanced-content">
                <label className="generator-advanced-field" htmlFor="negative-prompt">
                  <span>Negative prompt</span>
                  <textarea
                    id="negative-prompt"
                    onChange={(event) => setNegativePrompt(event.target.value)}
                    placeholder="Elements you’d prefer to avoid"
                    rows={2}
                    value={negativePrompt}
                  />
                </label>
                <div className="generator-option-row">
                  <label className="generator-advanced-field" htmlFor="quality-preset">
                    <span>Quality preset</span>
                    <select id="quality-preset" onChange={(event) => setQuality(event.target.value)} value={quality}>
                      <option>Standard</option><option>High</option><option>Ultra</option>
                    </select>
                  </label>
                  <label className="generator-advanced-field" htmlFor="image-seed">
                    <span>Seed <small>Optional</small></span>
                    <input id="image-seed" inputMode="numeric" onChange={(event) => setSeed(event.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="Random" value={seed} />
                  </label>
                </div>
              </div>
            </details>

            <div className="generator-submit-wrap">
              <button className="generator-submit" disabled={!prompt.trim()} type="submit">
                <Sparkles aria-hidden="true" /> Generate Image <span>DEMO</span>
              </button>
              <p><Clapperboard aria-hidden="true" /> Generation is a demo. No AI output will be created.</p>
            </div>
          </motion.form>

          <section aria-labelledby="generator-preview-heading" className="generator-preview-panel">
            <div className="generator-preview-heading">
              <div><p className="generator-eyebrow">CANVAS</p><h2 id="generator-preview-heading">Your creation</h2></div>
              <span className="generator-preview-badge"><span /> READY WHEN YOU ARE</span>
            </div>
            <div
              className={`generator-empty-state ratio-${ratio.replace(":", "-")}`}
              style={{ aspectRatio: ratio.replace(":", " / ") }}
            >
              <div className="generator-empty-art" aria-hidden="true">
                <span className="generator-empty-orbit orbit-outer" />
                <span className="generator-empty-orbit orbit-inner" />
                <span className="generator-empty-core"><ImageIcon /></span>
                <span className="generator-empty-spark spark-one">✦</span>
                <span className="generator-empty-spark spark-two">✧</span>
                <span className="generator-empty-spark spark-three">✦</span>
              </div>
              <p className="generator-empty-label">YOUR CANVAS IS CLEAR</p>
              <h3>Every world starts with an idea.</h3>
              <p className="generator-empty-copy">Add a prompt to prepare your image brief. Live AI generation is not connected, so this demo won’t create an image.</p>
              <div className="generator-empty-tags"><span>{style}</span><span>{ratio}</span><span>{count} {count === 1 ? "image" : "images"}</span></div>
            </div>
            <div aria-live="polite" className={`generator-notice ${notice ? "is-visible" : ""}`} role={notice ? "status" : undefined}>
              {notice && <><Sparkles aria-hidden="true" /><span>{notice}</span></>}
            </div>
            <div className="generator-preview-actions">
              <button disabled={!prompt.trim()} onClick={() => void copyPrompt(prompt)} type="button"><Copy aria-hidden="true" /> Copy prompt</button>
              <span><Download aria-hidden="true" /> Downloads are available for inspiration artwork only</span>
            </div>
          </section>
        </div>

        <section aria-labelledby="inspiration-heading" className="generator-inspiration">
          <div className="generator-inspiration-heading">
            <div><p className="generator-eyebrow">CURATED DEMO ARTWORK</p><h2 id="inspiration-heading">Find your next direction</h2><p>Explore sample visuals for ideas. These are existing assets, not AI-generated results.</p></div>
            <span className="generator-inspiration-count">SAMPLE COLLECTION <span>·</span> {inspirations.length} VISUALS</span>
          </div>
          <div className="generator-inspiration-grid">
            {inspirations.map((item, index) => (
              <article className={`generator-inspiration-card inspiration-${item.ratio}`} key={item.title}>
                <div className="generator-inspiration-media">
                  <Image alt={item.title} fill sizes="(max-width: 640px) 90vw, (max-width: 1000px) 42vw, 28vw" src={assetPath(item.filename)} />
                  <div className="generator-inspiration-overlay" />
                  <span className="generator-sample-badge">SAMPLE <span>·</span> {item.category.split(" · ")[0]}</span>
                  <button aria-label={`Preview ${item.title}`} className="generator-card-preview" onClick={() => setPreview(item)} type="button"><Maximize2 aria-hidden="true" /></button>
                </div>
                <div className="generator-inspiration-card-info">
                  <div><h3>{item.title}</h3><span>{item.category}</span></div>
                  <div className="generator-inspiration-actions">
                    <button
                      aria-label={savedCreations.some((creation) => creation.kind === "image" && creation.filename === item.filename) ? `${item.title} saved to Creations` : `Save ${item.title} to Creations`}
                      className="generator-save-sample"
                      disabled={savedCreations.some((creation) => creation.kind === "image" && creation.filename === item.filename)}
                      onClick={() => {
                        const result = save({
                          kind: "image",
                          title: item.title,
                          category: item.category,
                          filename: item.filename,
                          prompt: item.prompt,
                        });
                        setNotice(result.saved ? `${item.title} saved to this browser’s Creations library.` : result.error);
                      }}
                      type="button"
                    >
                      <Bookmark aria-hidden="true" /> {savedCreations.some((creation) => creation.kind === "image" && creation.filename === item.filename) ? "Saved" : "Save"}
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
        className="generator-preview-dialog"
        onCancel={(event) => { event.preventDefault(); setPreview(null); }}
        onClick={(event) => { if (event.target === event.currentTarget) setPreview(null); }}
        onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); setPreview(null); } }}
        onClose={() => setPreview(null)}
        ref={dialogRef}
      >
        {preview && (
          <div className="generator-dialog-content">
            <div className="generator-dialog-image">
              <Image alt={preview.title} fill priority sizes="(max-width: 900px) 94vw, 78vw" src={assetPath(preview.filename)} />
              <button aria-label="Close preview" className="generator-dialog-close" onClick={() => setPreview(null)} type="button"><X aria-hidden="true" /></button>
              <span className="generator-sample-badge">CURATED SAMPLE ARTWORK</span>
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
