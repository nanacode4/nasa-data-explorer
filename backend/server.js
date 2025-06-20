// backend/server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;      // 后端端口
const NASA_KEY = process.env.NASA_API_KEY;  // 从 .env 中读取

// 一个简单的健康检查
app.get('/api/health', (req, res) => res.send({ status: 'ok' }));

// 每日天文图 (APOD) 接口转发
app.get('/api/apod', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.nasa.gov/planetary/apod', {
      params: { api_key: NASA_KEY }
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch APOD' });
  }
});

app.get('/api/mars-photos', async (req, res) => {
  const { rover, earth_date } = req.query
  try {
    const { data } = await axios.get(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos`,
      { params: { api_key: NASA_KEY, earth_date } }
    )
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch Mars Rover photos' })
  }
})

app.get('/api/epic', async (req, res) => {
  const { date } = req.query
  try {
    const { data } = await axios.get(
      'https://api.nasa.gov/EPIC/api/natural/date/' + date,
      { params: { api_key: NASA_KEY } }
    )
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch EPIC data' })
  }
})


app.get('/api/neo', async (req, res) => {
  const { start_date, end_date } = req.query
  try {
    const { data } = await axios.get(
      'https://api.nasa.gov/neo/rest/v1/feed',
      { params: { api_key: NASA_KEY, start_date, end_date } }
    )
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch NeoWs data' })
  }
})


app.get('/api/library', async (req, res) => {
  const { q } = req.query
  try {
    const { data } = await axios.get(
      'https://images-api.nasa.gov/search',
      { params: { q, media_type: 'image,video' } }
    )
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch NASA library data' })
  }
})



app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
