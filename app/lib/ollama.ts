export async function getEmbedding(text: string) {
  const res = await fetch('http://localhost:11434/api/embeddings', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      "model": 'nomic-embed-text',
      "prompt": text,
    }),
  })
  const data = await res.json()
  const embedding = data.embedding
  console.log("Embedding", embedding)
  return `[${embedding.join(',')}]`
}