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
          `https://nasa-backend-6asb.onrender.com/api/mars-photos?rover=${selectedRover.toLowerCase()}&earth_date=${date}&page=1`
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
      <Form className='mb-4'>
        <Row className='align-items-center g-3'>
          <Col xs='auto'>
            <Form.Label htmlFor='roverSelect' className='mb-0'>
              Select a Rover
            </Form.Label>
          </Col>
          <Col xs='auto'>
            <Form.Select
              id='roverSelect'
              value={selectedRover}
              onChange={(e) => setSelectedRover(e.target.value)}
            >
              {rovers.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs='auto'>
            <Form.Label htmlFor='roverDate' className='mb-0'>
              Select Date
            </Form.Label>
          </Col>
          <Col xs='auto'>
            <DatePicker id='roverDate' value={date} onChange={setDate} />
          </Col>
        </Row>
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
