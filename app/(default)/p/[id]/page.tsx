import { NotionBlocks } from '../../../../components/notionBlock'
import { getClient, getPageList, getPageMeta } from '../../../../api/notion'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'highlight.js/styles/a11y-dark.css'

export async function generateStaticParams() {
  const pages = await getPageList(getClient())
  return pages.map(page => ({ id: page.id }))
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params
  dayjs.extend(relativeTime)
  const { title, createdAt, description } = await getPageMeta(getClient(), id)
  const formattedDate = dayjs(createdAt).format('YYYY-MM-DD')

  return (
    <main>
      <div className={'mb-8'}>
        <h1 className={'mb-1 text-3xl font-bold'}>{title}</h1>
        <p className={'text-gray-600'}>{description}</p>
        <time className={'text-gray-600'} dateTime={formattedDate}>
          {formattedDate}
        </time>
      </div>
      <div className={'text-base leading-loose'}>
        {/* @ts-ignore Server Component */}
        <NotionBlocks parentBlockId={id} />
      </div>
    </main>
  )
}
