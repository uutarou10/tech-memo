import Link from 'next/link'
import {getClient, getPageList} from '../../api/notion'
import ArticleListItem from '../../components/articleListItem'

export default async function Home() {
  const pages = await getPageList(getClient())

  return (
    <main>
      <section>
        <h2 className="sr-only">記事一覧</h2>
        {pages.map(page => (
          <ArticleListItem key={page.id} title={page.title} date={page.createdAt} id={page.id} />
        ))}
      </section>
    </main>
  )
}
