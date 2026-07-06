'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html, useProgress } from '@react-three/drei'
import { Model } from './Room'

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
    <div style={{ width: '100%', height: '100%', background: '#1a1a2e' }}>
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
    </div>
  )
}