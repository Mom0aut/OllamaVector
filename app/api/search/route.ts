// @ts-ignore
import {Pool} from 'pg'
import {getChat, getEmbedding} from "@/app/lib/ollama";
import {NextResponse} from "next/server";

const pool = new Pool({connectionString: process.env.DATABASE_URL})

export async function POST(req: Request) {
  const {query} = await req.json()
  const rewritten = await getChat(query)
  const queryEmbedding = await getEmbedding(rewritten)
  const {rows} = await pool.query(
      'SELECT id, name, age, bio,' +
      ' 1 - (embedding <=> $1::vector) AS score' +
      ' FROM people ORDER BY embedding <-> $1 LIMIT 5',
      [queryEmbedding]
  )
  return NextResponse.json({rewritten: rewritten, results: rows});
}
