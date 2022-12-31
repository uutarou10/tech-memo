import { GetServerSidePropsContext } from 'next'
import { getClient, getPageList } from '#/api/notion'
import { create } from 'xmlbuilder2'
import constants from '#/constants'
import dayjs from 'dayjs'

export const getServerSideProps = async ({
  res
}: GetServerSidePropsContext) => {
  const pages = await getPageList(getClient())

  const sitemap = create({
    urlset: {
      '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      url: pages.map(({ id, lastEdited }) => ({
        loc: `https://${constants.siteHost}/p/${id}`,
        lastmod: dayjs(lastEdited).format('YYYY-MM-DD')
      }))
    }
  })

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', `s-maxage=${3600 * 12}`) // 半日キャッシュする
  res.end(sitemap.end())

  return {
    props: {}
  }
}

const Page = () => null

export default Page
