import React from 'react'
import dayjs from 'dayjs'
import Link from 'next/link'

type Props = {
  title: string
  date: Date
  id: string
  description: string
}

const ArticleListItem: React.FC<Props> = ({ title, date, id, description }) => {
  const formattedDate = dayjs(date).format('YYYY-MM-DD')

  return (
    <article className={'py-4'}>
      <Link
        className={'w-fit text-sky-800 underline-offset-4 hover:underline'}
        href={`/p/${id}`}
      >
        <h2 className={'mb-1 w-fit text-lg font-bold'}>{title}</h2>
      </Link>
      <p className={'text-gray-600'}>{description}</p>
      <time dateTime={formattedDate} className={'text-sm text-slate-600'}>
        {formattedDate}
      </time>
    </article>
  )
}

export default ArticleListItem
