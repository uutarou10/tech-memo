import {Client, isFullBlock, isFullPage} from '@notionhq/client'
import constants from '../../constants'

export const getClient = (revalidate: number = 600) => new Client({
  auth: constants.notionApiKey,
  fetch: (url, init) => {
    return fetch(url, {...init, next: {revalidate}})
  }
})

export const getPageList = async (client: Client) => {
  const { results } = await client.databases.query({
    database_id: constants.notionDatabaseId,
    sorts: [{timestamp: 'created_time', direction: 'descending'}]
  })

  return results.map(result => {
    if (!isFullPage(result)) {
      return null
    }

    const title = (() => {
      if (result.properties.name.type !== 'title') {
        return ''
      }
      return result.properties.name.title.reduce((prev, current) => prev + current.plain_text, '')
    })()

    return {
      createdAt: new Date(result.created_time),
      title,
      id: result.id
    }
  }).filter((result): result is NonNullable<typeof result> => result !== null)
}

export const getPageBlocks = async (client: Client, pageId: string) => {
  const {results} = await client.blocks.children.list({
    block_id: pageId
  })

  return results.map((result) => {
    if (!isFullBlock(result))  {
      throw new Error('Unexpected result type')
    }
    return result
  })

}
