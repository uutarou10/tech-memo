import { ImageResponse } from 'next/server'
import { getClient, getPageMeta } from '#/api/notion'

export default async function OpengraphImage({
  params: { id }
}: {
  params: { id: string }
}) {
  const { title } = await getPageMeta(getClient(), id)

  const width = 1200
  const height = 630
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          background: '#075985'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: `${width - 64}px`,
            height: `${height - 64}px`,
            background: 'white',
            color: 'black'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: '150%',
              fontSize: '64px',
              width: '80%',
              textAlign: 'center',
              marginBottom: '12px'
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: '32px', color: '#4b5563' }}>tips chips</div>
        </div>
      </div>
    ),
    { width, height }
  )
}
