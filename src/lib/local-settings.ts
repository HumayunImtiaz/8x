export const settingsStorageKey = "neon-cinema-settings-v1";

export const imageStyles = [
  "Cinematic",
  "Sci-Fi",
  "Fantasy",
  "Photorealistic",
  "Anime",
  "3D Art",
] as const;

export const imageRatios = ["1:1", "16:9", "9:16", "4:3"] as const;

export const videoMotionPresets = [
  "Cinematic Orbit",
  "Smooth Tracking",
  "Slow Push-In",
  "Aerial Flythrough",
  "Abstract Motion",
] as const;

export type LocalSettings = {
  displayName: string;
  bio: string;
  theme: "dark";
  reducedMotion: boolean;
  imageStyle: (typeof imageStyles)[number];
  imageRatio: (typeof imageRatios)[number];
  videoMotion: (typeof videoMotionPresets)[number];
  productTips: boolean;
  creativeReminders: boolean;
};

export const defaultLocalSettings: LocalSettings = {
  displayName: "",
  bio: "",
  theme: "dark",
  reducedMotion: false,
  imageStyle: "Cinematic",
  imageRatio: "1:1",
  videoMotion: "Cinematic Orbit",
  productTips: true,
  creativeReminders: false,
};

export function isLocalSettings(value: unknown): value is LocalSettings {
  if (!value || typeof value !== "object") return false;
  const settings = value as Record<string, unknown>;
  return (
    typeof settings.displayName === "string" &&
    settings.displayName.length <= 60 &&
    typeof settings.bio === "string" &&
    settings.bio.length <= 240 &&
    settings.theme === "dark" &&
    typeof settings.reducedMotion === "boolean" &&
    imageStyles.some((style) => style === settings.imageStyle) &&
    imageRatios.some((ratio) => ratio === settings.imageRatio) &&
    videoMotionPresets.some((preset) => preset === settings.videoMotion) &&
    typeof settings.productTips === "boolean" &&
    typeof settings.creativeReminders === "boolean"
  );
}

export function readLocalSettings(): LocalSettings {
  const raw = window.localStorage.getItem(settingsStorageKey);
  if (raw === null) return defaultLocalSettings;
  const parsed: unknown = JSON.parse(raw);
  if (!isLocalSettings(parsed)) {
    throw new Error("Saved settings are invalid. They were left unchanged.");
  }
  return parsed;
}

export function readReducedMotionPreference() {
  try {
    return readLocalSettings().reducedMotion;
  } catch {
    return false;
  }
}

export function writeLocalSettings(settings: LocalSettings) {
  window.localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
}
