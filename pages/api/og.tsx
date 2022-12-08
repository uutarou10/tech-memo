import { ImageResponse } from '@vercel/og'
import {NextRequest} from 'next/server'

export const config = {
  runtime: 'experimental-edge'
}

export default function(req: NextRequest) {
  const { nextUrl: { searchParams } } = req
  const title = searchParams.get('title')

  const width = 1200
  const height = 630
  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        background: '#075985'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: `${width - 64}px`,
          height: `${height - 64}px`,
          background: 'white',
          color: 'black'
        }}>
          <div style={{lineHeight: '150%', fontSize: '64px', maxWidth: `80%`, textAlign: 'center', marginBottom: '12px'}}>{title}</div>
          <div style={{fontSize: '32px', color: '#4b5563'}}>tips chips</div>
        </div>
      </div>
    ),
    {width, height}
  )
}
