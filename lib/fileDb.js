// lib/fileDb.js  (server-only)
import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH  = path.join(DATA_DIR, "db.json");

const DEFAULT_DB = {
  questions: [],
  exams:     [],
  reports:   [],
};

async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), "utf8");
  }
}

export async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(raw);
}

export async function writeDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  return data;
}