import React, { useState, useEffect } from 'react';
import DatePicker from './components/DatePicker';
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  Spinner,
  Alert,
  Pagination,
} from 'react-bootstrap';

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
    <Container className='my-4'>
      <h2 className='mb-4'>Near Earth Object Web Service (NeoWs)</h2>
      <Form>
        <Row className='align-items-center mb-4'>
          <Col xs='auto'>
            <Form.Label htmlFor='neo-start' className='mb-0'>
              Start Date:
            </Form.Label>
          </Col>
          <Col xs='auto'>
            <DatePicker id='neo-start' value={startDate} onChange={setStartDate} />
          </Col>
          <Col xs='auto'>
            <Form.Label htmlFor='neo-end' className='mb-0'>
              End Date:
            </Form.Label>
          </Col>
          <Col xs='auto'>
            <DatePicker id='neo-end' value={endDate} onChange={setEndDate} />
          </Col>
        </Row>
      </Form>

      {loading && (
        <div className='text-center'>
          <Spinner animation='border' />
        </div>
      )}

      {error && (
        <Alert variant='danger' className='text-center'>
          {error}
        </Alert>
      )}

      {!loading && paginatedNeos.length > 0 && (
        <Row xs={1} md={2} className='g-4'>
          {paginatedNeos.map((neo) => (
            <Col key={neo.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{neo.name}</Card.Title>
                  <Card.Text>
                    <strong>Approaching date:</strong> {neo.close_approach_date} <br />
                    <strong>Estimated diameter:</strong>{' '}
                    {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(3)} -{' '}
                    {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)} km
                    <br />
                    <strong>Is it potentially dangerous?:</strong>{' '}
                    {neo.is_potentially_hazardous_asteroid ? 'yes' : 'no'}
                    <br />
                    <strong>Minimum distance:</strong>{' '}
                    {parseFloat(
                      neo.close_approach_data?.[0]?.miss_distance.kilometers || 0
                    ).toFixed(0)}{' '}
                    km
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {!loading && startDate && neos.length === 0 && !error && (
        <p className='text-center mt-4'>No NEOs were found for this date range.</p>
      )}

      {!loading && totalPages > 1 && (
        <div className='d-flex justify-content-center mt-4'>
          <span className='me-2'>Page</span>
          <Pagination>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
    </Container>
  );
}
