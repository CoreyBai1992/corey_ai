export const PROFILE_KEY = "profile";
export const MAX_PREFERENCES = 40;

export type Preference = {
  topic: string;
  detail: string;
  updatedAt: string;
};

export type Profile = {
  preferences: Preference[];
};

export function emptyProfile(): Profile {
  return { preferences: [] };
}

export function readProfile(value: unknown): Profile {
  if (value === undefined || value === null || typeof value !== "object" || Array.isArray(value)) {
    return emptyProfile();
  }
  const raw = (value as { preferences?: unknown }).preferences;
  if (!Array.isArray(raw)) return emptyProfile();
  const preferences: Preference[] = [];
  for (const item of raw) {
    if (item === null || typeof item !== "object" || Array.isArray(item)) continue;
    const { topic, detail, updatedAt } = item;
    if (typeof topic === "string" && typeof detail === "string" && typeof updatedAt === "string") {
      preferences.push({ topic, detail, updatedAt });
    }
  }
  return { preferences };
}

export function upsertPreference(profile: Profile, topic: string, detail: string, updatedAt: string): Profile {
  const nextTopic = topic.trim();
  const kept = profile.preferences.filter((item) => item.topic.toLowerCase() !== nextTopic.toLowerCase());
  kept.push({ topic: nextTopic, detail: detail.trim(), updatedAt });
  return { preferences: kept.slice(-MAX_PREFERENCES) };
}
