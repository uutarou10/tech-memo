import { NotionBlocks } from '../../../../components/notionBlock'
import {getClient, getPageMeta} from '../../../../api/notion'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'highlight.js/styles/a11y-dark.css'

export const revalidate = 60

export default async function Page({params: {id}}: {params: {id: string}}) {
  dayjs.extend(relativeTime)
  const {title, createdAt, description} = await getPageMeta(getClient(), id)
  const formattedDate = dayjs(createdAt).format('YYYY-MM-DD')

  return (
    <main>
      <div className={'mb-8'}>
        <h1 className={'text-3xl font-bold mb-1'}>{title}</h1>
        <p className={'text-gray-600'}>{description}</p>
        <time className={'text-gray-600'} dateTime={formattedDate}>{formattedDate}</time>
      </div>
      <div className={'text-base leading-loose'}>
        {/* @ts-ignore Server Component */}
        <NotionBlocks parentBlockId={id} />
      </div>
    </main>
  )
}
