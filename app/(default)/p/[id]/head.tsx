import { getClient, getPageMeta } from '#/api/notion'
import DefaultHead from '#/components/defaultHead'

const ArticlePageHead = async ({
  params: { id }
}: {
  params: { id: string }
}) => {
  const { title: articleTitle, description } = await getPageMeta(
    getClient(),
    id
  )
  const domain = process.env.VERCEL_URL ?? ''
  const urlSearchParam = new URLSearchParams({ title: articleTitle })
  const ogImageUrl = `https://${domain}/api/og?${urlSearchParam.toString()}`

  return (
    <>
      <DefaultHead
        title={articleTitle}
        description={description}
        ogType={'article'}
        ogImage={ogImageUrl}
      />
    </>
  )
}

export default ArticlePageHead
