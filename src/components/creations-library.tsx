"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowRight,
  Bookmark,
  Clapperboard,
  Clock3,
  Heart,
  Image as ImageIcon,
  Layers3,
  Maximize2,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { LazyVideo } from "@/components/lazy-video";
import { type LocalCreation, useLocalCreations } from "@/lib/local-creations";
import { useStudioReducedMotion } from "@/lib/use-studio-reduced-motion";

type Filter = "All" | "Images" | "Videos" | "Favorites";
type SortOrder = "newest" | "oldest";
type DialogState =
  | { kind: "preview"; item: LocalCreation }
  | { kind: "delete"; item: LocalCreation }
  | null;

const filters: Filter[] = ["All", "Images", "Videos", "Favorites"];

function assetPath(filename: string) {
  return `/assets/${encodeURIComponent(filename)}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

export function CreationsLibrary() {
  const { items, loading, error, toggleFavorite, remove } = useLocalCreations();
  const [filter, setFilter] = useState<Filter>("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<DialogState>(null);
  const [notice, setNotice] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reduceMotion = useStudioReducedMotion();

  useEffect(() => {
    const element = dialogRef.current;
    if (!element) return;
    if (dialog && !element.open) element.showModal();
    if (!dialog && element.open) element.close();
  }, [dialog]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return items
      .filter((item) => {
        const matchesFilter =
          filter === "All" ||
          (filter === "Images" && item.kind === "image") ||
          (filter === "Videos" && item.kind === "video") ||
          (filter === "Favorites" && item.favorite);
        const matchesQuery =
          !normalizedQuery ||
          `${item.title} ${item.category} ${item.prompt} ${item.kind}`
            .toLocaleLowerCase()
            .includes(normalizedQuery);
        return matchesFilter && matchesQuery;
      })
      .sort((a, b) => {
        const difference = Date.parse(a.createdAt) - Date.parse(b.createdAt);
        return sortOrder === "newest" ? -difference : difference;
      });
  }, [filter, items, query, sortOrder]);

  function deleteItem(item: LocalCreation) {
    if (remove(item.id)) {
      setNotice(`${item.title} removed from this browser’s library.`);
      setDialog(null);
    }
  }

  function toggleItemFavorite(item: LocalCreation) {
    if (toggleFavorite(item.id)) {
      setNotice(item.favorite ? "Removed from favorites." : "Added to favorites.");
      if (dialog?.kind === "preview") {
        setDialog({ kind: "preview", item: { ...item, favorite: !item.favorite } });
      }
    }
  }

  return (
    <section aria-labelledby="creations-title" className="image-generator-page creations-page">
      <div aria-hidden="true" className="generator-ambient generator-ambient-one" />
      <div aria-hidden="true" className="generator-ambient generator-ambient-two" />
      <div className="generator-container">
        <header className="creations-heading">
          <div>
            <p className="generator-eyebrow"><span /> YOUR PERSONAL COLLECTION <span className="creations-local-pill">LOCAL LIBRARY</span></p>
            <h1 id="creations-title">Your Creative <strong>Universe</strong></h1>
            <p className="generator-intro">
              Saved creations appear here. Items are stored in this browser only and are not synced to an account or cloud.
            </p>
          </div>
          <Link className="creations-explore-link" href="/explore"><Sparkles aria-hidden="true" /> Explore gallery <ArrowRight aria-hidden="true" /></Link>
        </header>

        <div className="creations-summary" aria-label="Library summary">
          <article className="creations-summary-card">
            <span className="creations-summary-icon summary-image"><ImageIcon aria-hidden="true" /></span>
            <span><small>IMAGES</small><strong>{items.filter((item) => item.kind === "image").length}</strong></span>
          </article>
          <article className="creations-summary-card">
            <span className="creations-summary-icon summary-video"><Clapperboard aria-hidden="true" /></span>
            <span><small>VIDEOS</small><strong>{items.filter((item) => item.kind === "video").length}</strong></span>
          </article>
          <article className="creations-summary-card">
            <span className="creations-summary-icon summary-favorite"><Heart aria-hidden="true" /></span>
            <span><small>FAVORITES</small><strong>{items.filter((item) => item.favorite).length}</strong></span>
          </article>
        </div>

        <section aria-labelledby="library-heading" className="creations-library-section">
          <div className="creations-library-top">
            <div className="creations-library-title">
              <p className="generator-eyebrow">YOUR SAVED WORK</p>
              <h2 id="library-heading">My Creations <span>{filteredItems.length}</span></h2>
            </div>
            <label className="creations-search">
              <Search aria-hidden="true" />
              <span className="sr-only">Search your creations</span>
              <input onChange={(event) => setQuery(event.target.value)} placeholder="Search your library..." type="search" value={query} />
              {query && <button aria-label="Clear search" onClick={() => setQuery("")} type="button"><X aria-hidden="true" /></button>}
            </label>
          </div>

          <div className="creations-toolbar">
            <div aria-label="Filter creations" className="creations-filters" role="group">
              {filters.map((item) => (
                <button
                  aria-pressed={filter === item}
                  className={filter === item ? "is-selected" : ""}
                  key={item}
                  onClick={() => setFilter(item)}
                  type="button"
                >
                  {item === "Images" && <ImageIcon aria-hidden="true" />}
                  {item === "Videos" && <Clapperboard aria-hidden="true" />}
                  {item === "Favorites" && <Heart aria-hidden="true" />}
                  {item}
                </button>
              ))}
            </div>
            <label className="creations-sort">
              <span><Clock3 aria-hidden="true" /> Sort</span>
              <select aria-label="Sort creations" onChange={(event) => setSortOrder(event.target.value as SortOrder)} value={sortOrder}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
          </div>

          {error && <p className="creations-storage-error" role="alert">{error} Saved data was not overwritten.</p>}
          {notice && <p aria-live="polite" className="creations-notice" role="status">{notice}</p>}

          {loading ? (
            <div aria-label="Loading local library" className="creations-loading-grid" role="status">
              {Array.from({ length: 3 }, (_, index) => <span className="creations-skeleton" key={index} />)}
            </div>
          ) : filteredItems.length ? (
            <div className="creations-grid">
              {filteredItems.map((item, index) => (
                <motion.article
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  className="creations-card"
                  initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                  key={item.id}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.035, 0.18) }}
                >
                  <button
                    aria-label={`Preview ${item.title}`}
                    className="creations-card-media"
                    onClick={() => setDialog({ kind: "preview", item })}
                    type="button"
                  >
                    {item.kind === "image" ? (
                      <Image alt={item.title} fill loading={index === 0 ? "eager" : "lazy"} sizes="(max-width: 640px) 90vw, (max-width: 1000px) 44vw, 29vw" src={assetPath(item.filename)} />
                    ) : (
                      <LazyVideo aria-label={`${item.title}, saved sample video`} poster={assetPath("video-poster-small.webp")} src={assetPath(item.filename)} />
                    )}
                    <span className="creations-card-shade" />
                    <span className={`creations-kind-badge ${item.kind}`}><span>{item.kind === "image" ? <ImageIcon aria-hidden="true" /> : <Clapperboard aria-hidden="true" />}{item.kind === "image" ? "IMAGE" : "VIDEO"}</span><strong>SAMPLE</strong></span>
                    <span aria-hidden="true" className="creations-open-preview"><Maximize2 /></span>
                  </button>
                  <div className="creations-card-info">
                    <div className="creations-card-meta"><span>{item.category}</span><span>{formatDate(item.createdAt)}</span></div>
                    <h3>{item.title}</h3>
                    <p className="creations-sample-caption"><Layers3 aria-hidden="true" /> Saved sample · not generated content</p>
                    <div className="creations-card-actions">
                      <button aria-label={item.favorite ? `Unfavorite ${item.title}` : `Favorite ${item.title}`} aria-pressed={item.favorite} className={item.favorite ? "is-favorite" : ""} onClick={() => toggleItemFavorite(item)} type="button">
                        <Heart aria-hidden="true" /> {item.favorite ? "Favorited" : "Favorite"}
                      </button>
                      <button aria-label={`Delete ${item.title}`} className="creations-delete-button" onClick={() => setDialog({ kind: "delete", item })} type="button"><Trash2 aria-hidden="true" /> Delete</button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="creations-empty-state">
              <div aria-hidden="true" className="creations-empty-mark"><Layers3 /></div>
              {items.length ? (
                <>
                  <p className="generator-eyebrow">NO MATCHES FOUND</p>
                  <h3>Nothing in this view just yet.</h3>
                  <p>Try a different search or filter to find a saved item.</p>
                  <button className="creations-reset-filter" onClick={() => { setFilter("All"); setQuery(""); }} type="button">Clear search and filters</button>
                </>
              ) : (
                <>
                  <p className="generator-eyebrow">A FRESH CANVAS</p>
                  <h3>Your collection starts with a spark.</h3>
                  <p>There are no saved items in this browser yet. Save a clearly labeled sample from a generator to add it here.</p>
                  <div className="creations-empty-actions">
                    <Link href="/generate/image"><ImageIcon aria-hidden="true" /> Image Generator <ArrowRight aria-hidden="true" /></Link>
                    <Link href="/generate/video"><Clapperboard aria-hidden="true" /> Video Generator <ArrowRight aria-hidden="true" /></Link>
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        <footer className="creations-footer">
          <span><Bookmark aria-hidden="true" /> Browser-local library <span>·</span> Not connected to an account</span>
          <span>Curated sample media is always labeled</span>
        </footer>
      </div>

      <dialog
        aria-label={dialog?.kind === "delete" ? `Delete ${dialog.item.title}` : dialog?.kind === "preview" ? `${dialog.item.title} preview` : "Creation dialog"}
        className="generator-preview-dialog creations-dialog"
        onCancel={(event) => { event.preventDefault(); setDialog(null); }}
        onClick={(event) => { if (event.target === event.currentTarget) setDialog(null); }}
        onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); setDialog(null); } }}
        onClose={() => setDialog(null)}
        ref={dialogRef}
      >
        {dialog?.kind === "preview" && (
          <div className="generator-dialog-content">
            <div className="generator-dialog-image">
              {dialog.item.kind === "image" ? (
                <Image alt={dialog.item.title} fill priority sizes="(max-width: 900px) 94vw, 78vw" src={assetPath(dialog.item.filename)} />
              ) : (
                <LazyVideo aria-label={`${dialog.item.title} sample video playback`} autoPlay controls poster={assetPath("video-poster-small.webp")} priority src={assetPath(dialog.item.filename)} />
              )}
              <button aria-label="Close preview" className="generator-dialog-close" onClick={() => setDialog(null)} type="button"><X aria-hidden="true" /></button>
              <span className="generator-sample-badge">SAVED SAMPLE · NOT GENERATED</span>
            </div>
            <div className="generator-dialog-details">
              <div><span>{dialog.item.kind} · {dialog.item.category}</span><h2>{dialog.item.title}</h2><p>{dialog.item.prompt}</p></div>
              <div className="generator-dialog-actions">
                <button aria-pressed={dialog.item.favorite} onClick={() => toggleItemFavorite(dialog.item)} type="button"><Heart aria-hidden="true" /> {dialog.item.favorite ? "Favorited" : "Favorite"}</button>
                <a download={dialog.item.filename} href={assetPath(dialog.item.filename)}><ArrowDownToLine aria-hidden="true" /> Download sample</a>
                <button onClick={() => setDialog({ kind: "delete", item: dialog.item })} type="button"><Trash2 aria-hidden="true" /> Delete</button>
              </div>
            </div>
          </div>
        )}
        {dialog?.kind === "delete" && (
          <div className="creations-delete-confirm">
            <button aria-label="Close delete confirmation" className="generator-dialog-close" onClick={() => setDialog(null)} type="button"><X aria-hidden="true" /></button>
            <span className="creations-delete-icon"><Trash2 aria-hidden="true" /></span>
            <p className="generator-eyebrow">REMOVE SAVED SAMPLE</p>
            <h2>Delete “{dialog.item.title}”?</h2>
            <p>This removes the item from this browser’s Creations library. The original sample asset will not be deleted.</p>
            <div className="creations-delete-actions">
              <button onClick={() => setDialog(null)} type="button">Keep item</button>
              <button className="is-danger" onClick={() => deleteItem(dialog.item)} type="button">Delete from library</button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
