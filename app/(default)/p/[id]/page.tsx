import { NotionBlocks } from '../../../../components/notionBlock'
import {getClient, getPageMeta} from '../../../../api/notion'
import dayjs from 'dayjs'

export default async function Page({params: {id}}: {params: {id: string}}) {
  const {title, createdAt} = await getPageMeta(getClient(), id)
  const formattedDate = dayjs(createdAt).format('YYYY-MM-DD')

  return (
    <main>
      <div className={'mb-8'}>
        <h1 className={'text-3xl font-bold'}>{title}</h1>
        <time dateTime={formattedDate}>{formattedDate}</time>
      </div>
      <div className={'text-base leading-loose'}>
        {/* @ts-ignore Server Component */}
        <NotionBlocks parentBlockId={id} />
      </div>
    </main>
  )
}
