import React, { useState, useEffect } from 'react';
import DatePicker from './components/DatePicker';
import { Container } from 'react-bootstrap';

export default function NeoWs() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [neos, setNeos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchNeos = async () => {
      setLoading(true);
      setError('');
      setNeos([]);
      try {
        const params = new URLSearchParams({
          start_date: startDate,
          end_date: endDate || startDate,
          api_key: 'DEMO_KEY',
        });
        const res = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const flattened = Object.entries(data.near_earth_objects).flatMap(([date, items]) =>
          items.map((obj) => ({ ...obj, close_approach_date: date }))
        );
        setNeos(flattened);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        setError('Failed to obtain NEO data, please try again');
      } finally {
        setLoading(false);
      }
    };

    fetchNeos();
  }, [startDate, endDate]);

  const totalPages = Math.ceil(neos.length / itemsPerPage);
  const paginatedNeos = neos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Container fluid className='my-4' style={{ maxWidth: 1400 }}>
      <h1>Near Earth Object Web Service (NeoWs)</h1>

      <div className='mb-4 flex flex-wrap gap-4'>
        <div>
          <label htmlFor='neo-start' className='mr-2 font-medium'>
            Start Date:
          </label>
          <DatePicker id='neo-start' value={startDate} onChange={setStartDate} />
        </div>
        <div>
          <label htmlFor='neo-end' className='mr-2 font-medium'>
            End Date:
          </label>
          <DatePicker id='neo-end' value={endDate} onChange={setEndDate} />
        </div>
      </div>

      {loading && <p className='text-center'>Loading…</p>}
      {error && <p className='text-red-500 text-center'>{error}</p>}

      {!loading && paginatedNeos.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {paginatedNeos.map((neo) => (
            <div key={neo.id} className='border rounded p-4'>
              <h3 className='font-bold truncate'>{neo.name}</h3>
              <p className='text-sm'>Approaching date: {neo.close_approach_date}</p>
              <p className='text-sm'>
                Estimated diameter:{' '}
                {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(3)} -{' '}
                {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)} km
              </p>
              <p className='text-sm'>
                Is it potentially dangerous?: {neo.is_potentially_hazardous_asteroid ? 'yes' : 'no'}
              </p>
              <p className='text-sm'>
                Minimum distance:{' '}
                {parseFloat(neo.close_approach_data?.[0]?.miss_distance.kilometers || 0).toFixed(0)}{' '}
                km
              </p>
            </div>
          ))}
        </div>
      )}

      {!loading && startDate && neos.length === 0 && !error && (
        <p className='text-center'>No NEOs were found for this date range.</p>
      )}

      {!loading && totalPages > 1 && (
        <div className='w-full flex justify-center mt-6'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium'>Page</span>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded border ${
                  currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
