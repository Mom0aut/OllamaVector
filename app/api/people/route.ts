import {NextResponse} from 'next/server'
import {Pool} from 'pg'
import {getEmbedding} from "@/app/lib/ollama";


const pool = new Pool({
  // connectionString: process.env.POSTGRES_URL,
  schema: 'public',
  url: process.env.DATABASE_URL,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: 5432
})

export async function POST(req: Request) {
  const {name, bio} = await req.json()
  const embedding = await getEmbedding(`${name}. ${bio}`)
  await pool.query(
      'INSERT INTO people (name, bio, embedding) VALUES ($1, $2, $3)',
      [name, bio, embedding]
  )
  return NextResponse.json({success: true})
}
