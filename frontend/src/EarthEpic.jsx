import React, { useEffect, useState } from 'react'
import DatePicker from './components/DatePicker'

export default function EarthEpic() {
  const [date, setDate] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!date) return
    const fetchEPIC = async () => {
      setLoading(true)
      setError('')
      setImages([])
      try {
        const res = await fetch(`/api/epic?date=${date}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setImages(data)
      } catch (err) {
        console.error(err)
        setError('获取 EPIC 图像失败，请重试')
      } finally {
        setLoading(false)
      }
    }
    fetchEPIC()
  }, [date])

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow mb-8">
      <h2 className="text-2xl font-semibold mb-4">EPIC (Earth Polychromatic Imaging Camera)</h2>

      <div className="mb-6">
        <label htmlFor="epic-date" className="mr-2 font-medium">选择日期：</label>
        <DatePicker value={date} onChange={setDate} />
      </div>

      {loading && <p className="text-center">加载中…</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map(img => {
            // EPIC returns image metadata with image name
            const datePath = img.date.split(' ')[0].split('-').join('/')
            const url = `https://epic.gsfc.nasa.gov/archive/natural/${datePath}/png/${img.image}.png`
            return (
              <div key={img.identifier} className="border rounded overflow-hidden">
                <img src={url} alt={img.caption} className="w-full" />
                <div className="p-2">
                  <p className="text-sm truncate">{img.caption}</p>
                  <p className="text-xs text-gray-500">{img.date}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!loading && date && images.length === 0 && !error && (
        <p className="text-center">该日期无 EPIC 图像，请选择其他日期。</p>
      )}
    </div>
  )
}
