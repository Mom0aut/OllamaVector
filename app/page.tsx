'use client'
import {useEffect, useState} from "react";

export default function Home() {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])


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

  async function handleSearch() {
    const res = await fetch('/api/people/search', {
      method: 'POST',
      body: JSON.stringify({query}),
      headers: {'Content-Type': 'application/json'},
    })
    const data = await res.json()
    setResults(data.results)
  }


  return (
      <div
          className="p-4">
        <main className="p-4">
          <h1 className="font-bold text-xl mb-4">Semantic People Search</h1>

          <div className="mb-6">
            <h2>Add Person</h2>
            <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full mb-2"
            />
            <textarea
                placeholder="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="border p-2 w-full mb-2"
            />
            <button onClick={handleAddPerson} className="bg-green-500 text-white px-4 py-2">
              Add
            </button>
          </div>

          <div>
            <h2>Search People</h2>
            <input
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border p-2 w-full mb-2"
            />
            <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2">
              Search
            </button>

            <ul className="mt-4">
              {results.map((person) => (
                  <li key={person.id} className="border p-2 mb-2">
                    <strong>{person.name}</strong>
                    <p>{person.bio}</p>
                  </li>
              ))}
            </ul>
          </div>
        </main>

      </div>
  );
}
