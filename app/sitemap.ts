import { MetadataRoute } from 'next'
import { getClient, getPageList } from '#/api/notion'
import constants from '#/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getPageList(getClient())
  return pages.map(({ id, lastEdited }) => ({
    url: `https://${constants.siteHost}/p/${id}`,
    lastModified: lastEdited
  }))
}
