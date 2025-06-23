require('dotenv').config()
const express = require('express')
const axios = require('axios')


const app = express()
const PORT = process.env.PORT || 3001


require("dotenv").config();
const NASA_KEY = process.env.NASA_API_KEY;


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Astronomy Picture of the Day (APOD)
app.get('/api/apod', async (req, res) => {
  try {
    const params = { api_key: NASA_KEY }
    if (req.query.date) params.date = req.query.date

    const response = await axios.get(
      'https://api.nasa.gov/planetary/apod',
      { params }
    )
    res.json(response.data)
  } catch (error) {
    console.error('APOD fetch error:', error.message)
    res.status(500).json({ error: 'Failed to fetch APOD data' })
  }
})

// Mars Rover Photos
app.get('/api/mars-photos', async (req, res) => {
  const { rover, earth_date } = req.query
  if (!rover || !earth_date) {
    return res.status(400).json({ error: 'Missing rover or earth_date parameter' })
  }

  try {
    const response = await axios.get(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos`,
      { params: { api_key: NASA_KEY, earth_date } }
    )
    res.json(response.data)
  } catch (error) {
    console.error('Mars Rover fetch error:', error.message)
    res.status(500).json({ error: 'Failed to fetch Mars Rover photos' })
  }
})

// EPIC (Earth Polychromatic Imaging Camera)
app.get('/api/epic', async (req, res) => {
  const { date } = req.query
  if (!date) {
    return res.status(400).json({ error: 'Missing date parameter' })
  }

  try {
    const response = await axios.get(
      `https://api.nasa.gov/EPIC/api/natural/date/${date}`,
      { params: { api_key: NASA_KEY } }
    )
    res.json(response.data)
  } catch (error) {
    console.error('EPIC fetch error:', error.message)
    res.status(500).json({ error: 'Failed to fetch EPIC data' })
  }
})

// Near Earth Object Web Service (NeoWs)
app.get('/api/neo', async (req, res) => {
  const { start_date, end_date } = req.query
  if (!start_date) {
    return res.status(400).json({ error: 'Missing start_date parameter' })
  }

  try {
    const response = await axios.get(
      'https://api.nasa.gov/neo/rest/v1/feed',
      { params: { api_key: NASA_KEY, start_date, end_date } }
    )
    res.json(response.data)
  } catch (error) {
    console.error('NeoWs fetch error:', error.message)
    res.status(500).json({ error: 'Failed to fetch NeoWs data' })
  }
})

// NASA Image and Video Library
app.get('/api/library', async (req, res) => {
  const { q } = req.query
  if (!q) {
    return res.status(400).json({ error: 'Missing query parameter' })
  }

  try {
    const response = await axios.get(
      'https://images-api.nasa.gov/search',
      { params: { q, media_type: 'image,video' } }
    )
    res.json(response.data)
  } catch (error) {
    console.error('Library fetch error:', error.message)
    res.status(500).json({ error: 'Failed to fetch library data' })
  }
})

// app.listen(PORT, () => {
  // console.log(`Server is listening on http://localhost:${PORT}`)
// })

module.exports = app;


if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
  });
}
