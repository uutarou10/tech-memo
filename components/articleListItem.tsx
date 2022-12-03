import React from 'react'
import dayjs from 'dayjs'
import Link from 'next/link'

type Props = {
  title: string
  date: Date
  id: string
}

const ArticleListItem: React.FC<Props> = ({title, date, id}) => {
  const formattedDate = dayjs(date).format('YYYY-MM-DD')

  return (
    <article className={'hover:underline py-3'}>
      <Link href={`/p/${id}`}>
        <time dateTime={formattedDate} className={'text-sm text-slate-600'}>{formattedDate}</time>
        <h2 className={'text-lg text-slate-900'}>{title}</h2>
      </Link>
    </article>
  )
}

export default ArticleListItem
