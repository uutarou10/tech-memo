import {getClient, getPageBlocks} from '../../../api/notion'
import NotionBlock, { NotionBlocks } from './NotionBlock'

export default async function Page({params: {id}}: {params: {id: string}}) {
  // const pageBlocks = await getPageBlocks(getClient(), id)

  return (
    <div>
      <h1>this is article page</h1>
      {/* @ts-ignore Server Component */}
      <NotionBlocks parentBlockId={id} />
    </div>
  )
}
