'use client'
import React from 'react'
import Image from 'next/image'
import useSWRImmutable from 'swr/immutable'

type Props = {
  blockId: string
  caption?: React.ReactNode
}

const useImageData = (blockId: string) => {
  return useSWRImmutable<{ imageUrl: string; isExternal: boolean }>(
    `/api/notion/image?blockId=${blockId}`,
    (url: string) => fetch(url).then(res => res.json())
  )
}

const ImageBlock: React.FC<Props> = ({ blockId, caption }) => {
  const { isLoading, data } = useImageData(blockId)

  return (
    <figure className={'mb-2 flex h-96 max-w-full flex-col'}>
      {!isLoading &&
        data &&
        (data.isExternal ? (
          <>
            {/*eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.imageUrl}
              alt={'画像'}
              className={
                'mx-auto mb-1 min-h-0 flex-shrink flex-grow object-contain last:mb-0'
              }
            />
            {caption}
          </>
        ) : (
          <>
            <div className={'relative flex-shrink flex-grow'}>
              <Image
                src={data.imageUrl}
                alt={'画像'}
                className={'mb-1 object-contain last:mb-0'}
                fill={true}
              />
            </div>
            {caption}
          </>
        ))}
    </figure>
  )
}

export default ImageBlock
