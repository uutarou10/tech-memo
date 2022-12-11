import ArticleListItem from '#/components/articleListItem'
import { getClient, getPageList } from '#/api/notion'

export async function generateStaticParams() {
  return []
}

export default async function Home() {
  const pages = await getPageList(getClient())

  return (
    <main>
      <section>
        <h2 className="sr-only">記事一覧</h2>
        {pages.map(page => (
          <ArticleListItem
            key={page.id}
            title={page.title}
            date={page.createdAt}
            id={page.id}
            description={page.description}
          />
        ))}
      </section>
    </main>
  )
}
