// src/components/AstronomyPicture.jsx
import React, { useEffect, useState } from 'react';
import DatePicker from './components/DatePicker';
import { Container, Form, Spinner, Alert, Card } from 'react-bootstrap';

export default function AstronomyPicture() {
  const [apod, setApod] = useState(null);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!date) return; // only fetch when a date is selected

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/apod?date=${date}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setApod(await res.json());
      } catch (err) {
        console.error(err);
        setError('Loading failed, please check the date or try again later');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  return (
    <Container className='my-4' style={{ maxWidth: '1400px' }}>
      {' '}
      <h1 className='mb-4'>Astronomy Picture of the Day</h1>
      <Form className='d-flex align-items-center mb-4'>
        <Form.Label htmlFor='apodDate' className='me-3 mb-0'>
          Select Date:
        </Form.Label>
        <DatePicker id='apodDate' value={date} onChange={setDate} />
      </Form>
      {loading && (
        <div className='text-center my-4'>
          <Spinner animation='border' />
        </div>
      )}
      {error && (
        <Alert variant='danger' className='text-start'>
          {error}
        </Alert>
      )}
      {/* Show APOD only when date selected and data available */}
      {!loading && date && apod ? (
        <>
          <h2 className='mt-4 mb-1 text-start'>{apod.title}</h2>
          {/* <p className='text-muted mb-3 text-start'>{apod.date}</p> */}
          <Card className='mb-4'>
            {apod.media_type === 'image' ? (
              <Card.Img
                variant='top'
                src={apod.url}
                alt={apod.title}
                style={{ objectFit: 'cover', maxHeight: 700 }}
              />
            ) : (
              <div className='ratio ratio-16x9'>
                <iframe
                  title='apod-video'
                  src={apod.url}
                  frameBorder='0'
                  allowFullScreen
                />
              </div>
            )}
          </Card>
          <h3 className='text-start' style={{ lineHeight: 1.6 }}>
            {apod.explanation}
          </h3>
        </>
      ) : (
        // Prompt when no date chosen
        !loading &&
        !error && (
          <p className='text-start text-muted'>
            Please select a date to view the Astronomy Picture of the Day.
          </p>
        )
      )}
    </Container>
  );
}
