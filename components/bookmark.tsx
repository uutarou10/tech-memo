'use client'
import React from 'react'
import useSWRImmutable from 'swr/immutable'
import { BookmarkData } from '#/types/bookmark'
import Paragraph from '#/components/paragraph'

type Props = {
  url: string
}

const useBookmarkData = (url: string) => {
  return useSWRImmutable<BookmarkData>(
    `/api/bookmark?url=${encodeURI(url)}`,
    key => fetch(key).then(res => res.json())
  )
}
const Bookmark: React.FC<Props> = ({ url }) => {
  const { isLoading, data } = useBookmarkData(url)

  if (isLoading) {
    return (
      <figure
        className={'flex h-40 max-w-2xl animate-pulse border border-gray-200'}
      >
        <div
          className={
            'flex w-3/5 flex-shrink-0 flex-grow-0 flex-col items-start p-4'
          }
        >
          <div className={'mb-5 h-3 w-full rounded-full bg-gray-400'} />
          <div className={'mb-2 h-2 w-full rounded-full bg-gray-400'} />
          <div className={'mb-2 h-2 w-full rounded-full bg-gray-400'} />
          <div className={'mb-2 h-2 w-full rounded-full bg-gray-400'} />
        </div>
        <div className={'h-full flex-grow bg-gray-400 '} />
      </figure>
    )
  }

  if (!data) {
    // fallback
    return (
      <Paragraph>
        <a
          className={'text-sky-800 underline underline-offset-4'}
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          {url}
        </a>
      </Paragraph>
    )
  }

  const { title, description, url: _url, imageUrl } = data

  return (
    <figure className={'mb-2 flex h-40 max-w-2xl border border-gray-200'}>
      <div
        className={
          'flex w-3/5 flex-shrink-0 flex-grow-0 flex-col items-start justify-center p-2 md:p-4'
        }
      >
        <div
          className={'mb-2 flex-shrink-0 font-bold leading-normal line-clamp-2'}
        >
          {title ?? _url}
        </div>
        {description && (
          <div className={'mb-1 flex-shrink flex-grow text-sm leading-normal'}>
            {description}
          </div>
        )}
        <div className={'max-w-full text-xs leading-normal text-gray-600'}>
          <span
            className={
              'inline-block h-full w-full overflow-x-hidden line-clamp-1'
            }
          >
            {_url}
          </span>
        </div>
      </div>
      {imageUrl && (
        <div
          className={
            'h-full flex-grow bg-gray-400 bg-cover bg-center line-clamp-3'
          }
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
    </figure>
  )
}

export default Bookmark
