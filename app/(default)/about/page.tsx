import { NotionBlocks } from '#/components/notionBlock'

export const metadata = {
  title: 'このサイトについて',
  description: 'tips chipsについて',
  openGraph: {
    title: 'このサイトについて',
    description: 'tips chipsについて'
  }
}

const AboutPage = () => {
  return (
    <main>
      <h1 className={'mb-1 text-3xl font-bold'}>このサイトについて</h1>
      <div className={'text-loose text-base'}>
        {/* @ts-ignore react-server-component */}
        <NotionBlocks parentBlockId={'03f54a5e8e404284aac61a876ea658c7'} />
      </div>
    </main>
  )
}

export default AboutPage
