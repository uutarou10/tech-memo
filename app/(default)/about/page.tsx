import {NotionBlocks} from '../../../components/notionBlock'

const AboutPage = () => {
  return (
    <main>
      <h1 className={'text-3xl font-bold mb-1'}>このサイトについて</h1>
      <div className={'text-base text-loose'}>
        {/* @ts-ignore react-server-component */}
        <NotionBlocks parentBlockId={'03f54a5e8e404284aac61a876ea658c7'} />
      </div>
    </main>
  )
}

export default AboutPage
