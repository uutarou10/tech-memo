import {getClient, getPageMeta} from '../../../../api/notion'

const ArticlePageHead = async ({params: {id}}: {params: {id: string}}) => {
  const {title: articleTitle} = await getPageMeta(getClient(), id)

  return (
    <>
      <title>{`${articleTitle} - tips chips`}</title>
    </>
  )
}

export default ArticlePageHead

