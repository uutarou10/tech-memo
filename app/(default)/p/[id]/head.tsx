import {getClient, getPageMeta} from '../../../../api/notion'
import DefaultHead from '../../../../components/defaultHead'

const ArticlePageHead = async ({params: {id}}: {params: {id: string}}) => {
  const {title: articleTitle, description} = await getPageMeta(getClient(), id)

  return (
    <>
      <DefaultHead title={articleTitle} description={description} ogType={'article'} />
    </>
  )
}

export default ArticlePageHead

