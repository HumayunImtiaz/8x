"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  Bookmark,
  Check,
  ChevronRight,
  Clapperboard,
  Compass,
  Image as ImageIcon,
  LayoutGrid,
  Play,
  Search,
  Settings,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStudioReducedMotion } from "@/lib/use-studio-reduced-motion";

const filters = ["All", "Images", "Videos", "Sci-Fi", "Fantasy", "Cinematic"] as const;
type Filter = (typeof filters)[number];
type Ratio = "portrait" | "landscape" | "square";
type GalleryImage = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  filename: string;
  ratio: Ratio;
  description: string;
  creator: string;
};
type GalleryVideo = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  filename: string;
  ratio: Ratio;
  description: string;
  creator: string;
};
type ComingSoon = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  ratio: Ratio;
  description: string;
  creator: string;
};
type GalleryEntry =
  | ({ kind: "Image" } & GalleryImage)
  | ({ kind: "Video" } & GalleryVideo)
  | ({ kind: "Coming soon" } & ComingSoon);

const images: GalleryImage[] = [
  {
    id: "alien-ocean",
    title: "Where the Tides Glow",
    category: "Fantasy",
    tags: ["Sci-Fi", "Fantasy"],
    filename: "Alien Ocean Planet.png",
    ratio: "portrait",
    description: "An otherworldly ocean beneath a luminous alien sky.",
    creator: "Neon Cinema sample",
  },
  {
    id: "cinematic-world",
    title: "A World Reimagined",
    category: "Cinematic",
    tags: ["Fantasy", "Cinematic"],
    filename: "Cinematic 3D Artwork.png",
    ratio: "landscape",
    description: "A cinematic sample artwork from the Neon Cinema collection.",
    creator: "Neon Cinema sample",
  },
  {
    id: "hypercar",
    title: "Velocity in Violet",
    category: "Sci-Fi",
    tags: ["Sci-Fi", "Cinematic"],
    filename: "Futuristic Hypercar Scene.png",
    ratio: "portrait",
    description: "A futuristic hypercar framed by electric city lights.",
    creator: "Neon Cinema sample",
  },
  {
    id: "megacity",
    title: "Afterlight Megacity",
    category: "Sci-Fi",
    tags: ["Sci-Fi", "Cinematic"],
    filename: "Futuristic Megacity Artwork.png",
    ratio: "landscape",
    description: "A vast future city glowing at the edge of night.",
    creator: "Neon Cinema sample",
  },
  {
    id: "monument",
    title: "Monument to Tomorrow",
    category: "Fantasy",
    tags: ["Fantasy", "Cinematic"],
    filename: "Futuristic Monument Art.png",
    ratio: "square",
    description: "A monumental structure set in an imagined world.",
    creator: "Neon Cinema sample",
  },
  {
    id: "supercar",
    title: "Chrome After Dark",
    category: "Cinematic",
    tags: ["Sci-Fi", "Cinematic"],
    filename: "Futuristic Supercar Scene.png",
    ratio: "portrait",
    description: "A cinematic supercar scene in a vivid neon palette.",
    creator: "Neon Cinema sample",
  },
  {
    id: "studio-study",
    title: "The Artist’s Portal",
    category: "Cinematic",
    tags: ["Fantasy", "Cinematic"],
    filename: "heroimage.jpg",
    ratio: "landscape",
    description: "A creative workstation imagined as a portal to new worlds.",
    creator: "Neon Cinema sample",
  },
  {
    id: "neon-portrait",
    title: "Electric Reverie",
    category: "Fantasy",
    tags: ["Fantasy", "Cinematic"],
    filename: "signup.jpg",
    ratio: "portrait",
    description: "A vivid portrait study from the curated demo artwork.",
    creator: "Neon Cinema sample",
  },
  {
    id: "light-study",
    title: "Light Between Worlds",
    category: "Sci-Fi",
    tags: ["Sci-Fi", "Cinematic"],
    filename: "video-poster.webp_2K_20261026192221.jpg",
    ratio: "landscape",
    description: "A still artwork study from the sample visual collection.",
    creator: "Neon Cinema sample",
  },
  {
    id: "export-study",
    title: "A Quietly Luminous World",
    category: "Cinematic",
    tags: ["Sci-Fi", "Cinematic"],
    filename: "Export_1_31b7bc3f24.webp",
    ratio: "landscape",
    description: "A luminous composition from the curated sample collection.",
    creator: "Neon Cinema sample",
  },
  {
    id: "still-study-one",
    title: "Color in Motion",
    category: "Fantasy",
    tags: ["Fantasy", "Cinematic"],
    filename: "images.jfif",
    ratio: "square",
    description: "A colorful visual study from the curated sample collection.",
    creator: "Neon Cinema sample",
  },
  {
    id: "still-study-two",
    title: "Dreamlike Horizons",
    category: "Cinematic",
    tags: ["Sci-Fi", "Cinematic"],
    filename: "imagess.avif",
    ratio: "landscape",
    description: "An atmospheric scene from the curated sample collection.",
    creator: "Neon Cinema sample",
  },
];

const videos: GalleryVideo[] = [
  {
    id: "hero-motion",
    title: "Create Beyond Reality",
    category: "Cinematic",
    tags: ["Sci-Fi", "Cinematic"],
    filename: "Hero.mp4",
    ratio: "landscape",
    description: "The Neon Cinema sample motion reel. AI video generation is not connected.",
    creator: "Neon Cinema demo",
  },
  {
    id: "candle-motion",
    title: "Candlelight",
    category: "Cinematic",
    tags: ["Fantasy", "Cinematic"],
    filename: "candle.mp4",
    ratio: "portrait",
    description: "A sample candlelight motion study.",
    creator: "Neon Cinema demo",
  },
  {
    id: "horse-motion",
    title: "Into the Open",
    category: "Cinematic",
    tags: ["Fantasy", "Cinematic"],
    filename: "horse.mp4",
    ratio: "landscape",
    description: "A sample motion study featuring a horse.",
    creator: "Neon Cinema demo",
  },
  {
    id: "bike-motion",
    title: "City Ride",
    category: "Cinematic",
    tags: ["Sci-Fi", "Cinematic"],
    filename: "illustration-bike.mp4",
    ratio: "landscape",
    description: "An illustrated bicycle motion study.",
    creator: "Neon Cinema demo",
  },
  {
    id: "porsche-motion",
    title: "Midnight Drive",
    category: "Cinematic",
    tags: ["Sci-Fi", "Cinematic"],
    filename: "porsche.mp4",
    ratio: "landscape",
    description: "A sample supercar motion study.",
    creator: "Neon Cinema demo",
  },
  {
    id: "rain-city-motion",
    title: "Rain City",
    category: "Cinematic",
    tags: ["Sci-Fi", "Cinematic"],
    filename: "rain-city.mp4",
    ratio: "landscape",
    description: "A sample rainy city motion study.",
    creator: "Neon Cinema demo",
  },
  {
    id: "video-motion",
    title: "Visual Study",
    category: "Cinematic",
    tags: ["Fantasy", "Cinematic"],
    filename: "video.mp4",
    ratio: "landscape",
    description: "A sample cinematic motion study.",
    creator: "Neon Cinema demo",
  },
  {
    id: "videoo-motion",
    title: "Light in Motion",
    category: "Cinematic",
    tags: ["Sci-Fi", "Cinematic"],
    filename: "videoo.mp4",
    ratio: "landscape",
    description: "A sample visual motion study.",
    creator: "Neon Cinema demo",
  },
];

const comingSoon: ComingSoon[] = [
  {
    id: "video-coming-soon-1",
    title: "Another visual world is in the works",
    category: "Coming soon",
    tags: ["Fantasy"],
    ratio: "portrait",
    description: "More sample video artwork will be added when new video assets are available.",
    creator: "Neon Cinema demo",
  },
  {
    id: "video-coming-soon-2",
    title: "More motion, coming soon",
    category: "Coming soon",
    tags: ["Sci-Fi"],
    ratio: "landscape",
    description: "This is a placeholder, not a video. No additional video asset is available yet.",
    creator: "Neon Cinema demo",
  },
];

const imageGroups = [
  { title: "Trending This Week", eyebrow: "COMMUNITY FAVORITES", entries: images.slice(0, 3) },
  { title: "AI Images", eyebrow: "CURATED IMAGE WORLDS", entries: images.slice(3, 6) },
  { title: "Recently Added", eyebrow: "FRESH FROM THE COLLECTION", entries: images.slice(6) },
];

const navItems = [
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/generate/image", label: "Image Generator", icon: ImageIcon },
  { href: "/generate/video", label: "Video Generator", icon: Clapperboard },
  { href: "/creations", label: "My Creations", icon: LayoutGrid },
  { href: "/settings", label: "Settings", icon: Settings },
];

function assetPath(filename: string) {
  return `/assets/${encodeURIComponent(filename)}`;
}

function matchesEntry(entry: GalleryEntry, query: string, filter: Filter) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matchesFilter =
    filter === "All" ||
    (filter === "Images" && entry.kind === "Image") ||
    (filter === "Videos" && entry.kind !== "Image") ||
    entry.tags.includes(filter);
  const searchableText =
    `${entry.title} ${entry.category} ${entry.tags.join(" ")} ${entry.kind} ${entry.creator}`.toLocaleLowerCase();
  return matchesFilter && (!normalizedQuery || searchableText.includes(normalizedQuery));
}

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds)) {
    return "--:--";
  }
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function GalleryCard({
  entry,
  index,
  saved,
  reducedMotion,
  onSave,
  onView,
}: {
  entry: GalleryEntry;
  index: number;
  saved: boolean;
  reducedMotion: boolean | null;
  onSave: (id: string) => void;
  onView: (entry: GalleryEntry) => void;
}) {
  const [duration, setDuration] = useState("--:--");
  const comingSoonEntry = entry.kind === "Coming soon";

  return (
    <motion.article
      className={`explore-art-card ratio-${entry.ratio}${comingSoonEntry ? " is-coming-soon" : ""}`}
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0 : 0.42,
        delay: reducedMotion ? 0 : Math.min(index * 0.035, 0.2),
      }}
    >
      <div className="explore-card-media">
        {entry.kind === "Image" ? (
          <Image
            alt={entry.title}
            className="explore-art-image"
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1050px) 43vw, 28vw"
            src={assetPath(entry.filename)}
          />
        ) : entry.kind === "Video" ? (
          <video
            aria-label={`${entry.title} sample video`}
            autoPlay
            className="explore-art-video"
            loop
            muted
            onLoadedMetadata={(event) => setDuration(formatDuration(event.currentTarget.duration))}
            playsInline
            preload="metadata"
            src={assetPath(entry.filename)}
          />
        ) : (
          <div aria-label="Video placeholder, coming soon" className="explore-coming-art">
            <span className="explore-coming-orbit explore-coming-orbit-one" />
            <span className="explore-coming-orbit explore-coming-orbit-two" />
            <span className="explore-coming-spark"><Clapperboard aria-hidden="true" /></span>
            <span className="explore-coming-label">NEXT FRAME</span>
          </div>
        )}
        <div aria-hidden="true" className="explore-card-shade" />
      </div>

      <button
        aria-label={`Open ${entry.title} preview`}
        className="explore-card-open"
        onClick={() => onView(entry)}
        type="button"
      />
      <span className={`explore-media-label ${entry.kind !== "Image" ? "is-video" : ""}`}>
        {entry.kind === "Image" ? <ImageIcon aria-hidden="true" /> : <Clapperboard aria-hidden="true" />}
        {entry.kind === "Coming soon" ? "Video · Coming soon" : `${entry.kind} · Demo`}
      </span>
      {entry.kind === "Video" && (
        <span className="explore-duration-badge"><Play aria-hidden="true" /> {duration}</span>
      )}
      {comingSoonEntry ? (
        <span className="explore-coming-badge">MORE VIDEOS COMING SOON</span>
      ) : (
        <button
          aria-label={saved ? `Remove ${entry.title} from saved items` : `Save ${entry.title}`}
          aria-pressed={saved}
          className={`explore-save-button${saved ? " is-saved" : ""}`}
          onClick={() => onSave(entry.id)}
          type="button"
        >
          {saved ? <Check aria-hidden="true" /> : <Bookmark aria-hidden="true" />}
        </button>
      )}
      <div className="explore-card-content">
        <span>{entry.category}</span>
        <h3>{entry.title}</h3>
        <p className="explore-card-creator">{entry.creator}</p>
        <div className="explore-card-actions">
          {comingSoonEntry ? (
            <span className="explore-unavailable-control">Not available yet</span>
          ) : (
            <button aria-label={`View ${entry.title}`} onClick={() => onView(entry)} type="button">
              {entry.kind === "Video" ? <Play aria-hidden="true" /> : <ImageIcon aria-hidden="true" />}
              View
            </button>
          )}
          {entry.kind === "Video" && <span className="explore-sample-caption">Sample reel</span>}
          {entry.kind === "Image" && <span className="explore-sample-caption">Sample artwork</span>}
        </div>
      </div>
    </motion.article>
  );
}

export function ExploreGallery() {
  const reducedMotion = useStudioReducedMotion();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());
  const [selectedItem, setSelectedItem] = useState<GalleryEntry | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !selectedItem) {
      return;
    }
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [selectedItem]);

  const visibleImages = useMemo(
    () =>
      images.filter((entry) =>
        matchesEntry({ ...entry, kind: "Image" }, query, filter),
      ),
    [filter, query],
  );
  const visibleVideos = useMemo(
    () =>
      [
        ...videos.map((entry) => ({ ...entry, kind: "Video" as const })),
        ...comingSoon.map((entry) => ({ ...entry, kind: "Coming soon" as const })),
      ].filter((entry) => matchesEntry(entry, query, filter)),
    [filter, query],
  );
  const filteredCount = visibleImages.length + visibleVideos.length;

  function toggleSaved(id: string) {
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function renderGalleryCard(entry: GalleryEntry, index: number) {
    return (
      <GalleryCard
        entry={entry}
        index={index}
        key={entry.id}
        onSave={toggleSaved}
        onView={setSelectedItem}
        reducedMotion={reducedMotion}
        saved={savedIds.has(entry.id)}
      />
    );
  }

  const showFeatured = query.length === 0 && filter === "All";

  return (
    <div className="explore-page">
      <aside className="explore-sidebar" aria-label="Studio navigation">
        <Link className="explore-brand" href="/" aria-label="Neon Cinema home">
          <span className="explore-brand-mark"><Sparkles aria-hidden="true" /></span>
          <span>NEON <strong>CINEMA</strong><small>CREATE BEYOND REALITY</small></span>
        </Link>
        <p className="explore-nav-label">WORKSPACE</p>
        <nav className="explore-nav" aria-label="Workspace">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              aria-current={href === "/explore" ? "page" : undefined}
              className={`explore-nav-link${href === "/explore" ? " is-active" : ""}`}
              href={href}
              key={href}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
              {href === "/explore" && <span className="explore-nav-indicator" />}
            </Link>
          ))}
        </nav>
        <div className="explore-sidebar-bottom">
          <div className="explore-demo-note">
            <span className="explore-demo-icon"><WandSparkles aria-hidden="true" /></span>
            <p><strong>Creative demo</strong><span>Curated sample artwork</span></p>
          </div>
          <Link className="explore-sidebar-profile" href="/settings">
            <span className="explore-avatar">NC</span>
            <span><strong>Guest artist</strong><small>Demo workspace</small></span>
            <ChevronRight aria-hidden="true" />
          </Link>
        </div>
      </aside>

      <div className="explore-main">
        <header className="explore-topbar">
          <div className="explore-mobile-brand">
            <Link className="explore-brand" href="/" aria-label="Neon Cinema home">
              <span className="explore-brand-mark"><Sparkles aria-hidden="true" /></span>
              <span>NEON <strong>CINEMA</strong></span>
            </Link>
          </div>
          <nav className="explore-mobile-nav" aria-label="Workspace">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                aria-current={href === "/explore" ? "page" : undefined}
                className={href === "/explore" ? "is-active" : ""}
                href={href}
                key={href}
                title={label}
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
          <div className="explore-topbar-actions">
            <div className="explore-notification-wrap">
              <button
                aria-expanded={notificationsOpen}
                aria-label="Notifications"
                className="explore-icon-button"
                onClick={() => setNotificationsOpen((open) => !open)}
                type="button"
              >
                <Bell aria-hidden="true" />
                <span className="explore-notification-dot" />
              </button>
              {notificationsOpen && (
                <div className="explore-notification-popover" role="status">
                  <strong>You&apos;re all caught up</strong>
                  <span>New creative updates will appear here.</span>
                </div>
              )}
            </div>
            <Link className="explore-top-profile" href="/settings" aria-label="Profile and settings">
              <span className="explore-avatar">NC</span>
              <span>Guest artist</span>
            </Link>
          </div>
        </header>

        <div className="explore-content">
          <motion.section
            className="explore-heading-row"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.45 }}
          >
            <div>
              <p className="explore-eyebrow"><span /> THE CREATIVE UNIVERSE</p>
              <h1>Explore <span>Creations</span></h1>
              <p className="explore-heading-copy">
                A curated world of visual ideas, imagined beyond the ordinary.
              </p>
            </div>
            <label className="explore-search">
              <Search aria-hidden="true" />
              <input
                aria-label="Search creations by title or category"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search creations..."
                ref={searchRef}
                type="search"
                value={query}
              />
              <kbd>Ctrl / ⌘ K</kbd>
            </label>
          </motion.section>

          <div aria-label="Gallery filters" className="explore-filters" role="group">
            {filters.map((item) => (
              <button
                aria-pressed={filter === item}
                className={filter === item ? "is-active" : ""}
                key={item}
                onClick={() => setFilter(item)}
                type="button"
              >
                {item === "Images" && <ImageIcon aria-hidden="true" />}
                {item === "Videos" && <Clapperboard aria-hidden="true" />}
                {item}
              </button>
            ))}
            <span className="explore-result-count">
              {loading ? "Preparing collection…" : `${filteredCount} entries`}
              <span> · Demo artwork</span>
            </span>
          </div>

          {loading ? (
            <div aria-label="Loading gallery" className="explore-masonry" role="status">
              {images.slice(0, 5).map((entry) => (
                <div className={`explore-skeleton ratio-${entry.ratio}`} key={entry.id}>
                  <span /><span />
                </div>
              ))}
            </div>
          ) : filteredCount === 0 ? (
            <div className="explore-empty-state" role="status">
              <span className="explore-empty-icon"><Search aria-hidden="true" /></span>
              <h2>No creations found</h2>
              <p>Try a different title, style, or media filter.</p>
              <button
                onClick={() => {
                  setQuery("");
                  setFilter("All");
                }}
                type="button"
              >
                Clear search and filters
              </button>
            </div>
          ) : (
            <>
              {showFeatured && (
                <section aria-labelledby="featured-creations-heading" className="explore-featured-section">
                  <div className="explore-section-heading">
                    <div>
                      <p className="explore-eyebrow"><span /> EDITOR&apos;S SELECTION</p>
                      <h2 id="featured-creations-heading">Featured Creations</h2>
                    </div>
                    <span>01 — SPOTLIGHT</span>
                  </div>
                  <button
                    className="explore-featured"
                    onClick={() => setSelectedItem({ ...images[6], kind: "Image" })}
                    type="button"
                  >
                    <Image
                      alt="Sample artwork of a glowing creative scene displayed on a laptop"
                      className="explore-featured-image"
                      fill
                      priority
                      sizes="(max-width: 760px) 100vw, 1100px"
                      src={assetPath("heroimage.jpg")}
                    />
                    <span aria-hidden="true" className="explore-featured-shade" />
                    <span className="explore-featured-content">
                      <span className="explore-featured-pill"><Sparkles aria-hidden="true" /> FEATURED SAMPLE</span>
                      <span className="explore-featured-title">Ideas take shape<br /><strong>in a world of light.</strong></span>
                      <span className="explore-featured-copy">Explore handpicked visual directions from the Neon Cinema demo collection.</span>
                      <span className="explore-featured-cta">View featured artwork <ChevronRight aria-hidden="true" /></span>
                    </span>
                    <span className="explore-featured-meta">CURATED DEMO ARTWORK</span>
                  </button>
                </section>
              )}

              {imageGroups.map((group) => {
                const groupEntries = group.entries
                  .filter((entry) => matchesEntry({ ...entry, kind: "Image" }, query, filter));
                if (groupEntries.length === 0) return null;
                return (
                  <section aria-labelledby={`section-${group.title.replaceAll(" ", "-")}`} className="explore-gallery-section" key={group.title}>
                    <div className="explore-section-heading">
                      <div>
                        <p className="explore-eyebrow"><span /> {group.eyebrow}</p>
                        <h2 id={`section-${group.title.replaceAll(" ", "-")}`}>{group.title}</h2>
                      </div>
                      <span>{groupEntries.length} {groupEntries.length === 1 ? "IMAGE" : "IMAGES"}</span>
                    </div>
                    <div className="explore-masonry">
                      {groupEntries.map((entry, index) =>
                        renderGalleryCard({ ...entry, kind: "Image" }, index),
                      )}
                    </div>
                  </section>
                );
              })}

              {visibleVideos.length > 0 && (
                <section aria-labelledby="ai-videos-heading" className="explore-gallery-section">
                  <div className="explore-section-heading">
                    <div>
                      <p className="explore-eyebrow"><span /> MOTION STUDIES</p>
                      <h2 id="ai-videos-heading">AI Videos</h2>
                    </div>
                    <span>{videos.length} SAMPLE VIDEOS · {comingSoon.length} COMING SOON</span>
                  </div>
                  <div className="explore-masonry explore-video-grid">
                    {visibleVideos.map((entry, index) =>
                      renderGalleryCard(entry, index),
                    )}
                  </div>
                  <p className="explore-demo-disclaimer">
                    <Sparkles aria-hidden="true" /> Sample video only. AI generation is not connected.
                  </p>
                </section>
              )}
            </>
          )}

          <footer className="explore-footer">
            <span>NEON CINEMA <span>·</span> CREATE BEYOND REALITY</span>
            <span>Curated demo artwork · AI generation is not connected</span>
          </footer>
        </div>
      </div>

      <dialog
        aria-label={selectedItem ? `${selectedItem.title} preview` : "Artwork preview"}
        className="explore-preview-dialog"
        onCancel={(event) => {
          event.preventDefault();
          setSelectedItem(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setSelectedItem(null);
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelectedItem(null);
        }}
        onClose={() => setSelectedItem(null)}
        ref={dialogRef}
      >
        {selectedItem && (
          <div className="explore-preview">
            <button
              aria-label="Close preview"
              className="explore-preview-close"
              onClick={() => setSelectedItem(null)}
              type="button"
            >
              <X aria-hidden="true" />
            </button>
            <div className="explore-preview-media">
              {selectedItem.kind === "Video" ? (
                <video
                  autoPlay
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  src={assetPath(selectedItem.filename)}
                />
              ) : selectedItem.kind === "Image" ? (
                <Image
                  alt={selectedItem.title}
                  className="object-contain"
                  fill
                  sizes="(max-width: 800px) 94vw, 75vw"
                  src={assetPath(selectedItem.filename)}
                />
              ) : (
                <div className="explore-preview-coming">
                  <Clapperboard aria-hidden="true" />
                  <strong>More videos coming soon</strong>
                  <span>This is a placeholder, not a video.</span>
                </div>
              )}
            </div>
            <div className="explore-preview-details">
              <span>{selectedItem.kind} · {selectedItem.category} · Sample</span>
              <h2>{selectedItem.title}</h2>
              <p>{selectedItem.description}</p>
              {selectedItem.kind !== "Coming soon" && (
                <button
                  aria-pressed={savedIds.has(selectedItem.id)}
                  className="explore-preview-save"
                  onClick={() => toggleSaved(selectedItem.id)}
                  type="button"
                >
                  {savedIds.has(selectedItem.id) ? <Check aria-hidden="true" /> : <Bookmark aria-hidden="true" />}
                  {savedIds.has(selectedItem.id) ? "Saved" : "Save to collection"}
                </button>
              )}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
