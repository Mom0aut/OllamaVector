import {NextResponse} from 'next/server'
import {Pool} from 'pg'
import {getEmbedding} from "@/app/lib/ollama";

const pool = new Pool({connectionString: process.env.DATABASE_URL})

export async function POST(req: Request) {
  const {query} = await req.json()
  const queryEmbedding = await getEmbedding(query)
  const {rows} = await pool.query(
      'SELECT id, name, bio FROM people ORDER BY embedding <-> $1 LIMIT 5',
      [queryEmbedding]
  )
  return NextResponse.json({results: rows})
}
