import React, { useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Form, Button, Modal } from 'react-bootstrap';

export default function NasaLibrary() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

  const itemsPerPage = 20;
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const paginatedResults = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);
    setCurrentPage(1);

    try {
      const res = await fetch(`https://nasa-backend.onrender.com/api/library?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setResults(data.collection.items || []);
    } catch (err) {
      console.error(err);
      setError('Search failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className='my-4' style={{ maxWidth: 1400 }}>
      <h1 className='mb-4'>NASA Image and Video Library</h1>

      <Form onSubmit={handleSearch} className='d-flex mb-4'>
        <Form.Control
          type='text'
          placeholder='Search keywords, such as: Moon, Mars…'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='me-2'
        />
        <Button type='submit' style={{ backgroundColor: '#0d1b2a' }}>
          Search
        </Button>
      </Form>

      {loading && (
        <div className='text-center'>
          <Spinner animation='border' />
        </div>
      )}
      {error && <Alert variant='danger'>{error}</Alert>}

      {!loading && paginatedResults.length > 0 && (
        <>
          <Row xs={1} sm={2} md={3} lg={4} className='g-4'>
            {paginatedResults.map((item) => {
              const { nasa_id, title, description } = item.data[0];
              const thumb = item.links?.[0]?.href;
              return (
                <Col key={nasa_id}>
                  <Card
                    className='h-100'
                    onClick={() => setSelectedItem(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    {thumb && <Card.Img variant='top' src={thumb} />}
                    <Card.Body>
                      <Card.Title className='text-truncate'>{title}</Card.Title>
                      <Card.Subtitle className='mb-2 text-muted'>ID: {nasa_id}</Card.Subtitle>
                      <Card.Text className='text-truncate'>{description}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>

          <div className='text-center mt-4'>
            <div className='inline-flex items-center gap-2'>
              <span className='me-2'>Page</span>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? 'primary' : 'outline-secondary'}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}

      {!loading && !error && results.length === 0 && (
        <p className='text-center'>Please enter keywords and click Search</p>
      )}

      {/* Modal for detail */}
      {selectedItem && (
        <Modal show={true} onHide={() => setSelectedItem(null)} size='lg'>
          <Modal.Header closeButton>
            <Modal.Title>{selectedItem.data[0].title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedItem.links?.[0]?.href && (
              <img src={selectedItem.links[0].href} alt='Preview' className='img-fluid mb-3' />
            )}
            <p>
              <strong>ID:</strong> {selectedItem.data[0].nasa_id}
            </p>
            <p>
              <strong>Date Created:</strong> {selectedItem.data[0].date_created}
            </p>
            <p>{selectedItem.data[0].description}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={() => setSelectedItem(null)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}
