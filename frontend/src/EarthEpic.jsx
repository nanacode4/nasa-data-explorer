// src/components/EarthTrack.jsx
import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from './components/DatePicker';
import { parseISO, getTime, format } from 'date-fns';
import { scaleTime } from 'd3-scale';
import { geoOrthographicRaw, geoProjection } from 'd3-geo';
import {
  ComposableMap,
  Sphere,
  Graticule,
  Geographies,
  Geography,
  Line,
  Marker,
} from 'react-simple-maps';
import { Card, Container, Row, Col } from 'react-bootstrap';
import {
  LineChart,
  Line as ReLine,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const orthographicWithStream = geoProjection((λ, φ) => geoOrthographicRaw(λ, φ))
  .rotate([0, -20])
  .scale(200);

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export default function EarthTrack() {
  const [date, setDate] = useState('');
  const [points, setPoints] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!date) return;
    fetch(`/api/epic?date=${date}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        const sorted = data
          .map((img) => ({ ...img }))
          .sort((a, b) => getTime(parseISO(a.date)) - getTime(parseISO(b.date)));
        setPoints(sorted);
        setSelected(null);
      })
      .catch(console.error);
  }, [date]);

  // Color scale across time
  const times = points.map((p) => getTime(parseISO(p.date)));
  const colorScale =
    points.length > 0
      ? scaleTime()
          .domain([Math.min(...times), Math.max(...times)])
          .range(['#a2d2ff', '#ff6b6b'])
      : () => '#aaa';

  // Chart data: deltas in km vs time
  const chartData = useMemo(() => {
    if (!points.length) return [];
    const ds = points.map(
      (pt) =>
        Math.hypot(
          pt.dscovr_j2000_position.x,
          pt.dscovr_j2000_position.y,
          pt.dscovr_j2000_position.z
        ) / 1000
    );
    const ls = points.map(
      (pt) =>
        Math.hypot(
          pt.lunar_j2000_position.x,
          pt.lunar_j2000_position.y,
          pt.lunar_j2000_position.z
        ) / 1000
    );
    const baseD = ds[0],
      baseL = ls[0];
    return points.map((pt, i) => ({
      time: format(parseISO(pt.date), 'HH:mm'),
      dscovr: +(ds[i] - baseD).toFixed(2),
      lunar: +(ls[i] - baseL).toFixed(2),
    }));
  }, [points]);

  return (
    <Container fluid className='my-4' style={{ maxWidth: 1400 }}>
      <h1>Earth-centric Projection Track</h1>
      <h5 className='mb-3'>
        This image was taken by NASA's EPIC camera onboard the NOAA DSCOVR spacecraft
      </h5>
      <h5 className='mb-3'>Choose a date to view satellite images and track the Earth's position from DSCOVR </h5>
      <DatePicker value={date} onChange={setDate} className='mb-4' placeholder='Choose a date' />

      <Row className='mb-4'>
        <Col md={8}>
          <ComposableMap
            projection={orthographicWithStream}
            projectionConfig={{ rotate: [0, -20, 0], scale: 200 }}
          >
            <Sphere fill='#ddeef7' />
            <Graticule stroke='#b8b8b8' strokeWidth={0.5} />
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill='#eceff1'
                    stroke='#607d8b'
                    strokeWidth={0.5}
                  />
                ))
              }
            </Geographies>

            {points.map((pt, i) =>
              i > 0 ? (
                <Line
                  key={i}
                  from={[
                    points[i - 1].centroid_coordinates.lon,
                    points[i - 1].centroid_coordinates.lat,
                  ]}
                  to={[pt.centroid_coordinates.lon, pt.centroid_coordinates.lat]}
                  stroke='#333'
                  strokeWidth={1}
                />
              ) : null
            )}

            {points.map((pt, i) => (
              <Marker
                key={i}
                coordinates={[pt.centroid_coordinates.lon, pt.centroid_coordinates.lat]}
                onClick={() => setSelected(pt)}
              >
                <circle
                  r={4}
                  fill={colorScale(getTime(parseISO(pt.date)))}
                  stroke='#fff'
                  strokeWidth={0.5}
                  style={{ cursor: 'pointer' }}
                />
              </Marker>
            ))}
          </ComposableMap>
        </Col>

        <Col md={4} className='d-flex align-items-center justify-content-center'>
          {selected ? (
            <Card className='w-100'>
              <Card.Img
                variant='top'
                src={`https://epic.gsfc.nasa.gov/archive/natural/${selected.date
                  .split(' ')[0]
                  .split('-')
                  .join('/')}/png/${selected.image}.png`}
                alt={selected.caption}
                style={{ objectFit: 'contain', maxHeight: 500 }}
              />
              <Card.Body>
                <Card.Text>{selected.date}</Card.Text>
              </Card.Body>
            </Card>
          ) : (
            <p className='text-center'>Click a point to view image</p>
          )}
        </Col>
      </Row>

      {(selected || chartData.length > 0) && (
        <Row className='gx-4 mb-4'>
          {selected && (
            <Col md={6}>
              <Card className='h-100'>
                <Card.Body>
                  <ul style={{ paddingLeft: '1rem' }}>
                    <li>
                      <strong>Centroid:</strong> lat {selected.centroid_coordinates.lat}, lon{' '}
                      {selected.centroid_coordinates.lon}
                    </li>
                    <li>
                      <strong>DSCOVR pos:</strong> x {selected.dscovr_j2000_position.x.toFixed(2)},
                      y {selected.dscovr_j2000_position.y.toFixed(2)}, z{' '}
                      {selected.dscovr_j2000_position.z.toFixed(2)}
                    </li>
                    <li>
                      <strong>Lunar pos:</strong> x {selected.lunar_j2000_position.x.toFixed(2)}, y{' '}
                      {selected.lunar_j2000_position.y.toFixed(2)}, z{' '}
                      {selected.lunar_j2000_position.z.toFixed(2)}
                    </li>
                    <li>
                      <strong>Sun pos:</strong> x {selected.sun_j2000_position.x.toFixed(2)}, y{' '}
                      {selected.sun_j2000_position.y.toFixed(2)}, z{' '}
                      {selected.sun_j2000_position.z.toFixed(2)}
                    </li>
                    <li>
                      <strong>Attitude quat:</strong> q0{' '}
                      {selected.attitude_quaternions.q0.toFixed(3)}, q1{' '}
                      {selected.attitude_quaternions.q1.toFixed(3)}, q2{' '}
                      {selected.attitude_quaternions.q2.toFixed(3)}, q3{' '}
                      {selected.attitude_quaternions.q3.toFixed(3)}
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          )}

          {chartData.length > 0 && (
            <Col md={6}>
              <Card className='h-100'>
                <Card.Header>Distance vs Time</Card.Header>
                <Card.Body>
                  <ResponsiveContainer width='100%' height={300}>
                    <LineChart data={chartData}>
                      <XAxis dataKey='time' />
                      <YAxis
                        domain={['auto', 'auto']}
                        label={{ value: 'Δkm', angle: -90, position: 'insideLeft' }}
                        tickFormatter={(val) => `${val}`}
                      />
                      <Tooltip formatter={(val, name) => [`${val} km`, name]} />
                      <Legend verticalAlign='top' />
                      <ReLine
                        type='monotone'
                        dataKey='dscovr'
                        name='DSCOVR–Earth'
                        stroke='#8884d8'
                        dot={false}
                      />
                      <ReLine
                        type='monotone'
                        dataKey='lunar'
                        name='DSCOVR–Moon'
                        stroke='#82ca9d'
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
}
