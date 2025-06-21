import React from 'react'
import AstronomyPicture from './AstronomyPicture'
import MarsRoverPhotos from './MarsRoverPhotos'
import EarthEpic from './EarthEpic'
import NeoWs from './NeoWs'
import NasaLibrary from './NasaLibrary'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="py-8 space-y-12">
        <Routes>
          <Route path="/" element={<AstronomyPicture />} />
          <Route path="/rovers" element={<MarsRoverPhotos />} />
          <Route path="/epic" element={<EarthEpic />} />
          <Route path="/neo" element={<NeoWs />} />
          <Route path="/library" element={<NasaLibrary />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
