import React, { useState } from 'react'

export default function NasaLibrary() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    setResults([])

    try {
      const res = await fetch(`/api/library?q=${encodeURIComponent(query)}`)
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      // data.collection.items is an array of results
      setResults(data.collection.items)
    } catch (err) {
      console.error(err)
      setError('检索失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow mb-8">
      <h2 className="text-2xl font-semibold mb-4">NASA Image and Video Library</h2>
      <form onSubmit={handleSearch} className="mb-6 flex">
        <input
          type="text"
          placeholder="搜索关键字，例如：月球、火星…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-grow border rounded-l px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
        >
          搜索
        </button>
      </form>

      {loading && <p className="text-center">加载中…</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map(item => {
            const { nasa_id, title, description } = item.data[0]
            const thumb = item.links?.[0]?.href
            return (
              <div key={nasa_id} className="border rounded overflow-hidden">
                {thumb && (
                  <img src={thumb} alt={title} className="w-full h-48 object-cover" />
                )}
                <div className="p-2">
                  <h3 className="font-bold truncate">{title}</h3>
                  <p className="text-xs text-gray-500 mb-1">ID: {nasa_id}</p>
                  <p className="text-sm truncate">{description}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <p className="text-center">请输入关键词并点击搜索。</p>
      )}
    </div>
  )
}
