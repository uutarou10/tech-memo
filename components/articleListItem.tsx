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
      <h2 className={'w-fit text-sky-800 underline-offset-4 hover:underline'}>
        <Link className={'mb-1 w-fit text-lg font-bold'} href={`/p/${id}`}>
          {title}
        </Link>
      </h2>
      <p className={'text-gray-600'}>{description}</p>
      <time dateTime={formattedDate} className={'text-sm text-slate-600'}>
        {formattedDate}
      </time>
    </article>
  )
}

export default ArticleListItem
