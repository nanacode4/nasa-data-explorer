import React, { useState, useEffect } from 'react';
import DatePicker from './components/DatePicker';
import { Container, Row, Col, Card, Spinner, Alert, Form } from 'react-bootstrap';

export default function EarthEpic() {
  const [date, setDate] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!date) return;
    const fetchImages = async () => {
      setLoading(true);
      setError('');
      setImages([]);
      try {
        const res = await fetch(`/api/epic?date=${date}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load EPIC images.');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [date]);

  return (
    <Container fluid className="my-4">
      <h2 className="mb-4">EPIC (Earth Polychromatic Imaging Camera)</h2>

      <Form className="d-flex align-items-center mb-4 gap-3">
        <Form.Label htmlFor="epicDate" className="mb-0 me-2">
          Select Date:
        </Form.Label>
        <DatePicker id="epicDate" value={date} onChange={setDate} />
      </Form>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && images.length === 0 && date && (
        <Alert variant="warning">No EPIC images found for this date.</Alert>
      )}

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {images.map(img => {
          const datePath = img.date.split(' ')[0].split('-').join('/');
          const url = `https://epic.gsfc.nasa.gov/archive/natural/${datePath}/png/${img.image}.png`;
          return (
            <Col key={img.identifier}>
              <Card>
                <div style={{ overflow: 'hidden', maxHeight: 400 }}>
                  <Card.Img
                    variant="top"
                    src={url}
                    alt={img.caption}
                    style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                  />
                </div>
                <Card.Body>
                  <Card.Text className="mb-1 text-truncate">
                    {img.caption}
                  </Card.Text>
                  <small className="text-muted">{img.date}</small>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
