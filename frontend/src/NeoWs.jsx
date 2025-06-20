import React, { useState, useEffect } from 'react'
import DatePicker from './components/DatePicker'

export default function NeoWs() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [neos, setNeos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!startDate) return
    // If endDate is empty, use startDate
    const fetchNeos = async () => {
      setLoading(true)
      setError('')
      setNeos([])
      try {
        const params = new URLSearchParams({
          start_date: startDate,
          end_date: endDate || startDate
        })
        const res = await fetch(`/api/neo?${params.toString()}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        // data.near_earth_objects is an object keyed by date
        const flattened = Object.entries(data.near_earth_objects).flatMap(
          ([date, items]) => items.map(obj => ({ ...obj, close_approach_date: date }))
        )
        setNeos(flattened)
      } catch (err) {
        console.error(err)
        setError('获取近地天体数据失败，请重试')
      } finally {
        setLoading(false)
      }
    }
    fetchNeos()
  }, [startDate, endDate])

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow mb-8">
      <h2 className="text-2xl font-semibold mb-4">近地天体 (NeoWs)</h2>

      <div className="mb-4 flex flex-wrap gap-4">
        <div>
          <label htmlFor="neo-start" className="mr-2 font-medium">开始日期：</label>
          <DatePicker id="neo-start" value={startDate} onChange={setStartDate} />
        </div>
        <div>
          <label htmlFor="neo-end" className="mr-2 font-medium">结束日期：</label>
          <DatePicker id="neo-end" value={endDate} onChange={setEndDate} />
        </div>
      </div>

      {loading && <p className="text-center">加载中…</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && neos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {neos.map(neo => (
            <div key={neo.id} className="border rounded p-4">
              <h3 className="font-bold truncate">{neo.name}</h3>
              <p className="text-sm">接近日期: {neo.close_approach_date}</p>
              <p className="text-sm">
                估算直径: {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(3)} - {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)} km
              </p>
              <p className="text-sm">是否潜在危险: {neo.is_potentially_hazardous_asteroid ? '是' : '否'}</p>
              <p className="text-sm">最小距离: {parseFloat(neo.close_approach_data?.[0]?.miss_distance.kilometers).toFixed(0)} km</p>
            </div>
          ))}
        </div>
      )}

      {!loading && startDate && neos.length === 0 && !error && (
        <p className="text-center">未找到该日期范围内的近地天体。</p>
      )}
    </div>
  )
}
