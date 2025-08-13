import {Pool} from 'pg'
import {getEmbedding} from "@/app/lib/ollama";
import {NextResponse} from "next/server";

const pool = new Pool({connectionString: process.env.DATABASE_URL})
const OLLAMA_RE_RANK_ENDPOINT = "http://localhost:11434/v1/completions"; // gpt-oss:20b REST

export async function POST(req: Request) {
  const {query} = await req.json()
  const queryEmbedding = await getEmbedding(query)
  const {rows} = await pool.query(
      'SELECT id, name, bio,' +
      ' 1 - (embedding <=> $1::vector) AS score' +
      ' FROM people ORDER BY embedding <-> $1 LIMIT 5',
      [queryEmbedding]
  )

  // 3️⃣ Rerank top candidates with gpt-oss:20b
  const prompt = `
You are a semantic ranking assistant. Return **only a JSON array**, nothing else. Do not include markdown, backticks, explanations, or extra text.

Query: "${query}"

Candidates: ${JSON.stringify(rows)}

Task:
- Rank all candidates by relevance (0 = completely irrelevant, 1 = perfect match).
- The relevance should consider the original "score":
  - If score < 0.5, assign a much lower relevance (e.g., 0.0-0.3).
  - If score >= 0.5, you can increase or decrease relevance based on context.
- If unsure about a candidate, assign a low score (e.g., 0.05) instead of removing it.
- Include ALL candidates in the output, even if irrelevant, but sort by relevance.
  {
    "id": candidate id,
    "name": "martin",
    "bio": "developer",
    "score": relevance as a number between 0 (irrelevant) and 1 (most relevant),
    "relevance": 0.5,
  }

Output example:
[
  {"id": 12, "name": "martin", "bio: "developer","score": 0.89, "relevance": 1"},
  {"id": 15, "name": "teresa", "bio: "developer","score": 0.77, "relevance": 0.9},"}
]

Rules:
1. Only include relevant candidates. Remove irrelevant ones completely.
2. Keep the order descending by score.
3. JSON must be valid and parseable.
4. Do not fabricate ids — only use ids from Candidates.
4. Remove duplicate ids
`;

  const reRankResponse = await fetch(OLLAMA_RE_RANK_ENDPOINT, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      model: "gemma3:4b",
      prompt,
      stream: false,
      format: "json",
    }),
  });

  const reRankData = await reRankResponse.json();
  console.log("Raw Json: ", reRankData)

  const rankedResults = reRankData.choices[0].text.replace(/```json|```/g, '').trim();
  const scores = JSON.parse(rankedResults);

  console.log("Databaserows: ", rows)
  // console.log("Parsed Json: ", scores)

  return NextResponse.json({results: scores});
}
