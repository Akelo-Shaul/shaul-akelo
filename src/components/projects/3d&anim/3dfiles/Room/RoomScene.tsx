'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html, useProgress } from '@react-three/drei'
import { Model } from './Room'
import { roomProject } from '@/data/projects'

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div style={{ color: 'white', fontFamily: 'sans-serif', fontSize: '14px' }}>
        {Math.round(progress)}% loaded
      </div>
    </Html>
  )
}

export default function RoomScene() {
  return (
    <div className="relative h-full w-full" style={{ background: '#1a1a2e' }}>
      <Canvas
        camera={{ position: [5, 3, 5], fov: 50 }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
        }}
        dpr={1}
      >
        <color attach="background" args={['#1a1a2e']} />
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, 5, -5]} intensity={0.5} />

        <Suspense fallback={<Loader />}>
          <Model />
        </Suspense>

        <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            mouseButtons={{
                LEFT: 0,    // rotate
                MIDDLE: 1,  // zoom
                RIGHT: 2,   // pan
            }}
        />
      </Canvas>

      {/* Caption overlaid inside the viewport. `pointer-events-none` keeps drag/zoom working
          through it, and the gradient scrim keeps the text legible over the lighter floor. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-16">
        <h3 className="text-lg font-semibold leading-tight text-white">{roomProject.name}</h3>
        <p className="mt-1 max-w-md text-sm leading-snug text-white/70">{roomProject.description}</p>
      </div>
    </div>
  )
}