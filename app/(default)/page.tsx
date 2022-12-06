import {getPageListWithCache} from '../../api/notion'
import ArticleListItem from '../../components/articleListItem'
import { headers } from 'next/headers'

export const revalidate = 60

export default async function Home() {
  headers() // dynamic renderingを有効化するために参照している
  const pages = await getPageListWithCache()

  return (
    <main>
      <section>
        <h2 className="sr-only">記事一覧</h2>
        {pages.map(page => (
          <ArticleListItem key={page.id} title={page.title} date={page.createdAt} id={page.id} description={page.description} />
        ))}
      </section>
    </main>
  )
}
