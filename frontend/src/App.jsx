import React from 'react'
import AstronomyPicture from './AstronomyPicture'
import MarsRoverPhotos from './MarsRoverPhotos'
import EarthEpic from './EarthEpic'
import NeoWs from './NeoWs'
import NasaLibrary from './NasaLibrary'

export default function App() {
  return (
    <div className="space-y-12 py-8">
      <AstronomyPicture />
      <MarsRoverPhotos />
      <EarthEpic />
      <NeoWs />
      <NasaLibrary />

    </div>
  )
}
