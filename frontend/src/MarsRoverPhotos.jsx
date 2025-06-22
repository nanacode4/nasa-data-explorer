// src/components/MarsRoverPhotos.jsx
import React, { useEffect, useState } from 'react';
import DatePicker from './components/DatePicker';
import { Container, Row, Col, Card, Spinner, Alert, Form } from 'react-bootstrap';

export default function MarsRoverPhotos() {
  const rovers = ['Curiosity', 'Opportunity', 'Spirit'];
  const [selectedRover, setSelectedRover] = useState('Curiosity');
  const [date, setDate] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!date) return;

    const fetchPhotos = async () => {
      setLoading(true);
      setError('');
      setPhotos([]);

      try {
        const res = await fetch(
          `/api/mars-photos?rover=${selectedRover.toLowerCase()}&earth_date=${date}&page=1`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPhotos(data.photos.slice(0, 25));
      } catch (err) {
        console.error(err);
        setError('Failed to retrieve photos, please try again');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [date, selectedRover]);

  return (
    <Container className='my-4' style={{ maxWidth: '1400px' }}>
      <h1 className='mb-4'>Mars Rover Photos</h1>
      <Form className='d-flex mb-4 align-items-center gap-4'>
        <Form.Group controlId='roverSelect' className='d-flex align-items-center me-3'>
          <Form.Label htmlFor='roverSelect' className='mb-0 me-2'>
            Select a Rover
          </Form.Label>
          <Form.Select
            value={selectedRover}
            onChange={(e) => setSelectedRover(e.target.value)}
            className='w-auto'
          >
            {rovers.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId='datePicker' className='mb-0 me-2'>
          <Form.Label>Select Date</Form.Label>
          <DatePicker value={date} onChange={setDate} className='w-auto' />
        </Form.Group>
      </Form>

      {loading && <Spinner animation='border' />}

      {error && <Alert variant='danger'>{error}</Alert>}

      {!loading && !error && photos.length === 0 && date && (
        <Alert variant='warning'>No photos found for this date.</Alert>
      )}

      <Row xs={1} sm={2} md={5} className='g-4'>
        {photos.map((photo) => (
          <Col key={photo.id}>
            <Card>
              <Card.Img variant='top' src={photo.img_src} />
              <Card.Body>
                <Card.Text>
                  <strong>Camera:</strong> {photo.camera.full_name}
                  <br />
                  <small className='text-muted'>Date: {photo.earth_date}</small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
