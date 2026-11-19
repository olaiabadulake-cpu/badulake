import "server-only";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

export type WaitlistEntry = {
  email: string;
  zone: string;
  language: "eu" | "es";
  consentAt: string;
};

// PROVISIONAL: mientras no exista la base de datos (Supabase, región UE),
// en desarrollo las altas se guardan en .data/waitlist.jsonl (fuera de git).
// En producción falla a propósito: no se publica el formulario sin base de datos.
const FILE = path.join(process.cwd(), ".data", "waitlist.jsonl");

// En la web publicada el formulario no se enseña hasta que haya base de datos.
export const waitlistOpen = process.env.NODE_ENV !== "production";

export async function saveWaitlistEntry(entry: WaitlistEntry): Promise<void> {
  if (!waitlistOpen) {
    throw new Error("Waitlist storage is not configured yet (pending Supabase).");
  }

  await mkdir(path.dirname(FILE), { recursive: true });
  const existing = await readFile(FILE, "utf8").catch(() => "");
  const alreadyIn = existing
    .split("\n")
    .filter(Boolean)
    .some((line) => (JSON.parse(line) as WaitlistEntry).email === entry.email);

  // Si ya estaba apuntada, no se duplica (y no se le dice a nadie).
  if (!alreadyIn) {
    await appendFile(FILE, JSON.stringify(entry) + "\n");
  }
}
