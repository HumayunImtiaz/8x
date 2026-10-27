"use client";

import { useCallback, useEffect, useState } from "react";

export type LocalCreation = {
  id: string;
  kind: "image" | "video";
  title: string;
  category: string;
  filename: string;
  prompt: string;
  createdAt: string;
  favorite: boolean;
  isSample: true;
};

const storageKey = "neon-cinema-creations-v1";
const updateEvent = "neon-cinema-creations-updated";

function isLocalCreation(value: unknown): value is LocalCreation {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    (record.kind === "image" || record.kind === "video") &&
    typeof record.title === "string" &&
    typeof record.category === "string" &&
    typeof record.filename === "string" &&
    typeof record.prompt === "string" &&
    typeof record.createdAt === "string" &&
    Number.isFinite(Date.parse(record.createdAt)) &&
    typeof record.favorite === "boolean" &&
    record.isSample === true
  );
}

function readLocalCreations(): LocalCreation[] {
  const raw = window.localStorage.getItem(storageKey);
  if (raw === null) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(isLocalCreation)) {
    throw new Error("Saved library data is invalid. It was left unchanged.");
  }
  return parsed;
}

function notifyUpdate() {
  window.dispatchEvent(new Event(updateEvent));
}

function writeLocalCreations(items: LocalCreation[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(items));
  notifyUpdate();
}

export function useLocalCreations() {
  const [items, setItems] = useState<LocalCreation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(() => {
    try {
      setItems(readLocalCreations());
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not read the local library.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener(updateEvent, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(updateEvent, refresh);
    };
  }, [refresh]);

  const save = useCallback((creation: Omit<LocalCreation, "createdAt" | "favorite" | "id" | "isSample">) => {
    try {
      const current = readLocalCreations();
      const duplicate = current.some(
        (item) => item.kind === creation.kind && item.filename === creation.filename,
      );
      if (duplicate) {
        setItems(current);
        setError("");
        return { saved: false, error: "This sample is already in your Creations library." };
      }
      const next: LocalCreation = {
        ...creation,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        favorite: false,
        isSample: true,
      };
      writeLocalCreations([next, ...current]);
      setItems([next, ...current]);
      setError("");
      return { saved: true, error: "" };
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Could not save this sample locally.";
      setError(message);
      return { saved: false, error: message };
    }
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    try {
      const next = readLocalCreations().map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item,
      );
      writeLocalCreations(next);
      setItems(next);
      setError("");
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not update this favorite.");
      return false;
    }
  }, []);

  const remove = useCallback((id: string) => {
    try {
      const next = readLocalCreations().filter((item) => item.id !== id);
      writeLocalCreations(next);
      setItems(next);
      setError("");
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not delete this item.");
      return false;
    }
  }, []);

  const clearAll = useCallback(() => {
    try {
      window.localStorage.removeItem(storageKey);
      notifyUpdate();
      setItems([]);
      setError("");
      return { cleared: true, error: "" };
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Could not clear the local library.";
      setError(message);
      return { cleared: false, error: message };
    }
  }, []);

  return { items, loading, error, save, toggleFavorite, remove, clearAll };
}
