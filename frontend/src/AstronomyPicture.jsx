// src/AstronomyPicture.jsx
import React, { useEffect, useState } from 'react'
import DatePicker from './components/DatePicker'

export default function AstronomyPicture() {
  const [apod, setApod] = useState(null)
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const url = date ? `/api/apod?date=${date}` : '/api/apod'
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        setApod(await res.json())
      } catch (err) {
        console.error(err)
        setError('加载失败，请检查日期或稍后重试')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [date])

  return (
    <section className="container mx-auto p-6 bg-white rounded-lg shadow mb-8">
      <h2 className="text-2xl font-semibold mb-4">Astronomy Picture of the Day</h2>

      <div className="mb-6">
        <label htmlFor="apod-date" className="mr-2 font-medium">选择日期：</label>
        <DatePicker value={date} onChange={setDate} />
      </div>

      {loading && <p className="text-center">Loading…</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && apod && (
        <div>
          <h3 className="text-xl font-bold">{apod.title}</h3>
          <p className="italic mb-2">{apod.date}</p>
          {apod.media_type === 'image'
            ? <img src={apod.url} alt={apod.title} className="w-full rounded mb-4" />
            : <iframe
                title="apod-video"
                src={apod.url}
                frameBorder="0"
                allowFullScreen
                className="w-full aspect-video rounded mb-4"
              />
          }
          <p className="leading-relaxed">{apod.explanation}</p>
        </div>
      )}
    </section>
  )
}
