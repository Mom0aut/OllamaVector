import {NextResponse} from 'next/server'
// @ts-ignore
import {Pool} from 'pg'
import {getEmbedding} from "@/app/lib/ollama";


const pool = new Pool({connectionString: process.env.DATABASE_URL})


export async function POST(req: Request) {
  const {name, age, bio} = await req.json()
  const embedding = await getEmbedding(`${name}. ${age}. ${bio}`)
  await pool.query(
      'INSERT INTO people (name, age, bio, embedding) VALUES ($1, $2, $3, $4)',
      [name, age, bio, embedding]
  )
  return NextResponse.json({success: true})
}
