import { ImageResponse } from 'next/og'

// Applies to every route that doesn't define its own opengraph-image — currently everything except
// case studies, which supply the project artwork through generateMetadata.
export const alt = 'Shaul Akelo — Web, 3D & Animation Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0b0b0c',
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#9ca3af', letterSpacing: 6 }}>
          PORTFOLIO
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 96, color: '#ffffff', fontWeight: 700 }}>
            Shaul Akelo
          </div>
          <div style={{ display: 'flex', fontSize: 40, color: '#d1d5db', marginTop: 16 }}>
            Websites, 3D environments & animation
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 30, color: '#9ca3af' }}>shaulakelo.com</div>
      </div>
    ),
    size,
  )
}
