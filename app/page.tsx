'use client'
import {FormEvent, useEffect, useState} from "react";

export default function Home() {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    console.log('DB URL:', process.env.DATABASE_URL)
  })

  async function handleAddPerson() {
    await fetch('/api/people', {
      method: 'POST',
      body: JSON.stringify({name, bio}),
      headers: {'Content-Type': 'application/json'},
    })
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true);
    const res = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({query}),
      headers: {'Content-Type': 'application/json'},
    })
    const data = await res.json()
    setResults(data.results)
    setLoading(false);
  }


  return (
      <div className="min-h-screen bg-base-200 p-6">
        <main className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Semantic People Search</h1>

          {/* Add Person Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Add Person</h2>
            <div className="flex flex-col gap-3">
              <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full focus:ring-1 focus:ring-primary/50 focus:outline-none"
              />
              <textarea
                  placeholder="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="textarea textarea-bordered w-full focus:ring-1 focus:ring-primary/50 focus:outline-none"
                  rows={3}
              />
              <button
                  onClick={handleAddPerson}
                  className="btn btn-success w-fit self-start"
              >
                Add
              </button>
            </div>
          </section>

          {/* Search Section */}
          <section className="mb-8">
            <form onSubmit={handleSearch} className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold mb-2">Search People</h2>
              <input
                  type="text"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="input input-bordered w-full focus:ring-1 focus:ring-primary/50 focus:outline-none"
              />
              <button
                  type="submit"
                  className="btn btn-primary w-fit"
              >
                {loading ? "Searching..." : "Search"}
              </button>
              {/* Loading bar */}
            </form>
          </section>

          {/* Results Section */}
          <section>
            {loading && (
                <progress className="progress progress-primary w-full mt-2"></progress>
            )}
            <ul className="grid gap-4">
              {results.map((person) => (
                  <li key={person.id} className="card bg-base-100 shadow-md">
                    <div className="card-body">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="card-title">{person.name}</h3>
                        <span
                            className={`badge ${
                                person.relevance <= 0.5 ? 'badge-ghost' : 'badge-success'
                            }`}
                        >
                    LLM Score: {person.relevance.toFixed(2)}
                  </span>
                      </div>
                      <p className="text-gray-600 mb-2">{person.bio}</p>
                      <p className="text-sm text-gray-400">
                        Embedded Score: {person.score.toFixed(3)}
                      </p>
                    </div>
                  </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
  );
}
