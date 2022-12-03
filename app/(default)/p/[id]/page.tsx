import { NotionBlocks } from '../../../../components/notionBlock'

export default async function Page({params: {id}}: {params: {id: string}}) {

  return (
    <div>
      <h1>this is article page</h1>
      {/* @ts-ignore Server Component */}
      <NotionBlocks parentBlockId={id} />
    </div>
  )
}
