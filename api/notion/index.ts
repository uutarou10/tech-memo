import { Client, isFullBlock, isFullPage } from '@notionhq/client'
import constants from '#/constants'

export const getClient = (revalidate: number = 600) =>
  new Client({
    auth: constants.notionApiKey,
    fetch: (url, init) => {
      return fetch(url, { ...init, next: { revalidate } })
    }
  })

export const getPageList = async (client: Client) => {
  const { results } = await client.databases.query({
    database_id: constants.notionDatabaseId,
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    filter: {
      and: [
        { property: 'publish', checkbox: { equals: true } },
        { property: 'description', rich_text: { is_not_empty: true } }
      ]
    }
  })

  return results
    .map(result => {
      if (!isFullPage(result)) {
        return null
      }

      const title = (() => {
        if (result.properties.name.type !== 'title') {
          return ''
        }
        return result.properties.name.title.reduce(
          (prev, current) => prev + current.plain_text,
          ''
        )
      })()

      const description = (() => {
        if (result.properties.description.type !== 'rich_text') {
          return ''
        }
        return result.properties.description.rich_text.reduce(
          (prev, current) => prev + current.plain_text,
          ''
        )
      })()

      return {
        createdAt: new Date(result.created_time),
        title,
        id: result.id,
        description,
        lastEdited: new Date(result.last_edited_time)
      }
    })
    .filter((result): result is NonNullable<typeof result> => result !== null)
}

export const getPageBlocks = async (client: Client, pageId: string) => {
  const { results } = await client.blocks.children.list({
    block_id: pageId
  })

  return results.map(result => {
    if (!isFullBlock(result)) {
      throw new Error('Unexpected result type')
    }
    return result
  })
}

export const getPageMeta = async (
  client: Client,
  pageId: string
): Promise<{ title: string; createdAt: Date; description: string }> => {
  const page = await client.pages.retrieve({
    page_id: pageId
  })

  if (!isFullPage(page)) {
    throw new Error('Unexpected response type')
  }

  const title = (() => {
    if (page.properties.name.type !== 'title') {
      return ''
    }
    return page.properties.name.title.reduce(
      (prev, current) => prev + current.plain_text,
      ''
    )
  })()

  const description = (() => {
    if (page.properties.description.type !== 'rich_text') {
      return ''
    }
    return page.properties.description.rich_text.reduce(
      (prev, current) => prev + current.plain_text,
      ''
    )
  })()

  const published =
    page.properties.publish.type === 'checkbox' &&
    page.properties.publish.checkbox
  if (!published) {
    throw new Error('forbidden')
  }

  return {
    title,
    description,
    createdAt: new Date(page.created_time)
  }
}
