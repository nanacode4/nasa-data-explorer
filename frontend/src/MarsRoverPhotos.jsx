import React, { useEffect, useState } from 'react'
import DatePicker from './components/DatePicker'

export default function MarsRoverPhotos() {
  const rovers = ['Curiosity', 'Opportunity', 'Spirit']
  const [selectedRover, setSelectedRover] = useState('Curiosity')
  const [date, setDate] = useState('')
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!date) return

    const fetchPhotos = async () => {
      setLoading(true)
      setError('')
      setPhotos([])

      try {
        const response = await fetch(
          `/api/mars-photos?rover=${selectedRover.toLowerCase()}&earth_date=${date}`
        )
        if (!response.ok) throw new Error(`Error ${response.status}`)
        const data = await response.json()
        setPhotos(data.photos)
      } catch (err) {
        console.error(err)
        setError('获取照片失败，请重试')
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [date, selectedRover])

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">Mars Rover Photos</h1>

      {/* Rover Selector */}
      <div className="mb-4">
        <label className="mr-2 font-medium" htmlFor="rover-select">选择探测车：</label>
        <select
          id="rover-select"
          value={selectedRover}
          onChange={e => setSelectedRover(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {rovers.map(r => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Date Picker */}
      <div className="mb-6">
        <label htmlFor="earth-date" className="mr-2 font-medium">选择日期：</label>
        <DatePicker value={date} onChange={setDate} />
      </div>

      {/* Status Messages */}
      {loading && <p className="text-center">加载中…</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Photos Grid */}
      {!loading && photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="border rounded overflow-hidden">
              <img
                src={photo.img_src}
                alt={`${selectedRover} - ${photo.camera.full_name}`}
                className="w-full"
              />
              <div className="p-2">
                <p className="text-sm">相机: {photo.camera.full_name}</p>
                <p className="text-xs text-gray-500">拍摄日期: {photo.earth_date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Photos */}
      {!loading && date && photos.length === 0 && !error && (
        <p className="text-center">没有找到该日期的照片，请选择其他日期。</p>
      )}
    </div>
  )
}
