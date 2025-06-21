import React, { useState } from 'react';
import DatePicker from './components/DatePicker';
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Form,
  Button,
} from 'react-bootstrap';

export default function NasaLibrary() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetch(
        `/api/library?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setResults(data.collection.items);
    } catch (err) {
      console.error(err);
      setError('Search failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4" style={{ maxWidth: '1200px' }}>
      <h2 className="mb-4">NASA Image and Video Library</h2>

      <Form onSubmit={handleSearch} className="d-flex mb-4">
        <Form.Control
          type="text"
          placeholder="Search keywords, such as: Moon, Mars…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="me-2"
        />
        <Button type="submit" variant="primary">
          Search
        </Button>
      </Form>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && results.length > 0 && (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {results.map((item) => {
            const { nasa_id, title, description } = item.data[0];
            const thumb = item.links?.[0]?.href;
            return (
              <Col key={nasa_id}>
                <Card className="h-100">
                  {thumb && <Card.Img variant="top" src={thumb} />}
                  <Card.Body>
                    <Card.Title className="text-truncate">
                      {title}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      ID: {nasa_id}
                    </Card.Subtitle>
                    <Card.Text className="text-truncate">
                      {description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {!loading && !error && results.length === 0 && (
        <p className="text-center">Please enter keywords and click Search</p>
      )}
    </Container>
  );
}
