import React from 'react'
import Link from 'next/link'
import { fetchOpengraphData } from '#/utils/opengraph'
import Paragraph from './paragraph'

type Props = {
  url: string
}

const WRAPPER_CLASS = 'mb-2 h-40 max-w-2xl border border-gray-200'

const Bookmark = async ({ url }: Props) => {
  const data = await fetchOpengraphData(url).catch(() => null)

  if (!data) {
    // fallback
    return <Fallback url={url} />
  }
  const { title, description, imageUrl } = data

  return (
    <figure className={WRAPPER_CLASS}>
      <Link
        href={url}
        target={'_blank'}
        rel={'noreferrer'}
        className={'flex h-full w-full'}
      >
        <div
          className={
            'flex w-3/5 flex-shrink-0 flex-grow-0 flex-col items-start justify-center p-2 md:p-4'
          }
        >
          <div
            className={
              'mb-2 flex-shrink-0 font-bold leading-normal line-clamp-2'
            }
          >
            {title ?? url}
          </div>
          {description && (
            <div
              className={'mb-1 flex-shrink flex-grow text-sm leading-normal'}
            >
              {description}
            </div>
          )}
          <div className={'max-w-full text-xs leading-normal text-gray-600'}>
            <span
              className={
                'inline-block h-full w-full overflow-x-hidden line-clamp-1'
              }
            >
              {url}
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
      </Link>
    </figure>
  )
}

export const Skeleton = ({ url }: Props) => {
  return (
    <figure className={`animate-pulse ${WRAPPER_CLASS}`}>
      <Link
        href={url}
        target={'_blank'}
        rel={'noreferrer'}
        className={'flex h-full w-full'}
        aria-label={url}
      >
        <div
          className={
            'flex w-3/5 flex-shrink-0 flex-grow-0 flex-col items-start p-2 md:p-4'
          }
        >
          <div className={'mb-5 h-3 w-full rounded-full bg-gray-300'} />
          <div className={'mb-2 h-2 w-full rounded-full bg-gray-300'} />
          <div className={'mb-2 h-2 w-full rounded-full bg-gray-300'} />
          <div className={'mb-2 h-2 w-full rounded-full bg-gray-300'} />
        </div>
        <div className={'h-full flex-grow bg-gray-300 '} />
      </Link>
    </figure>
  )
}

const Fallback = ({ url }: Props) => {
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

export default Bookmark
