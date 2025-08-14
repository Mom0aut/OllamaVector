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


export async function getChat(query: string) {
  const prompt = 'You rewrite search queries into a clear, concise description suitable for semantic search embeddings.' +
      'Return **only a JSON array**' +
      'You seach People with following attribute: Name, Age, Bio.' +
      'Keep the search attributes in mind.' +
      `Rewrite this query for semantic search: "${query}"`


  /*
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
   */

  const chatResponse = await fetch("http://localhost:11434/v1/completions", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      model: "gemma3:4b",
      stream: false,
      format: "json",
      prompt,
    }),
  });
  const response = await chatResponse.json();
  const jsonResponse = response.choices[0].text.replace(/```json|```/g, '').trim();
  console.log(jsonResponse);
  return jsonResponse;
}