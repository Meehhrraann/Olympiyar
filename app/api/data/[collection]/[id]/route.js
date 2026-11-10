// import { NextResponse } from "next/server";
// import { readDb, writeDb } from "@/lib/fileDb";

// const VALID_COLLECTIONS = ["questions", "exams", "reports"];

// export async function PUT(request, { params }) {
//   const { collection, id } = await params;      // ← await
//   if (!VALID_COLLECTIONS.includes(collection)) {
//     return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
//   }
//   const body = await request.json();
//   const db = await readDb();
//   const index = db[collection].findIndex((item) => item.id === id);
//   if (index === -1) {
//     return NextResponse.json({ error: "Not found" }, { status: 404 });
//   }
//   db[collection][index] = { ...db[collection][index], ...body };
//   await writeDb(db);
//   return NextResponse.json(db[collection][index]);
// }

// export async function DELETE(_request, { params }) {
//   const { collection, id } = await params;      // ← await
//   if (!VALID_COLLECTIONS.includes(collection)) {
//     return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
//   }
//   const db = await readDb();
//   db[collection] = db[collection].filter((item) => item.id !== id);
//   await writeDb(db);
//   return NextResponse.json({ ok: true });
// }

import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const VALID_COLLECTIONS = ["questions", "exams", "reports"];

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  const { collection, id } = await params;
  if (!VALID_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }
  const body = await request.json();
  const key = `collection:${collection}`;
  const items = (await kv.get(key)) || [];
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  items[index] = { ...items[index], ...body };
  await kv.set(key, items);
  return NextResponse.json(items[index]);
}

export async function DELETE(_request, { params }) {
  const { collection, id } = await params;
  if (!VALID_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }
  const key = `collection:${collection}`;
  const items = (await kv.get(key)) || [];
  const filtered = items.filter((item) => item.id !== id);
  await kv.set(key, filtered);
  return NextResponse.json({ ok: true });
}