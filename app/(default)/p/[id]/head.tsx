import {getClient, getPageMeta} from '../../../../api/notion'
import DefaultHead from '../../../../components/defaultHead'

const ArticlePageHead = async ({params: {id}}: {params: {id: string}}) => {
  const {title: articleTitle, description} = await getPageMeta(getClient(), id)

  return (
    <>
      <DefaultHead />
      <title>{`${articleTitle} - tips chips`}</title>
      <meta property={'og:title'} content={articleTitle} />
      <meta property={'og:description'} content={description} />
      <meta property={'og:type'} content={'article'} />
    </>
  )
}

export default ArticlePageHead

