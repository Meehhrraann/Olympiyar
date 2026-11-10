// import { NextResponse } from "next/server";
// import { readDb, writeDb } from "@/lib/fileDb";

// const VALID_COLLECTIONS = ["questions", "exams", "reports"];

// export async function GET(request, { params }) {
//   const { collection } = await params;          // ← await
//   if (!VALID_COLLECTIONS.includes(collection)) {
//     return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
//   }
//   const db = await readDb();
//   return NextResponse.json(db[collection]);
// }

// export async function POST(request, { params }) {
//   const { collection } = await params;          // ← await
//   if (!VALID_COLLECTIONS.includes(collection)) {
//     return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
//   }
//   const body = await request.json();
//   const db = await readDb();
//   db[collection].push(body);
//   await writeDb(db);
//   return NextResponse.json(body, { status: 201 });
// }


import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const VALID_COLLECTIONS = ["questions", "exams", "reports"];

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { collection } = await params;
  if (!VALID_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }
  const data = await kv.get(`collection:${collection}`);
  return NextResponse.json(data || []);
}

export async function POST(request, { params }) {
  const { collection } = await params;
  if (!VALID_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }
  const body = await request.json();
  const key = `collection:${collection}`;
  const existing = (await kv.get(key)) || [];
  existing.push(body);
  await kv.set(key, existing);
  return NextResponse.json(body, { status: 201 });
}