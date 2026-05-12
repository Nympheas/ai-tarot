export type SavedReading = {
  id: string;
  type: "tarot" | "iching";
  question: string;
  result: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

const KEY = "lingjing_readings";

export function saveReading(reading: Omit<SavedReading, "id" | "createdAt">): SavedReading {
  const saved: SavedReading = {
    ...reading,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const all = loadReadings();
  all.unshift(saved);
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 50))); // keep latest 50
  return saved;
}

export function loadReadings(): SavedReading[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function deleteReading(id: string): void {
  const all = loadReadings().filter((r) => r.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}
