import { NextApiRequest, NextApiResponse } from 'next'
import { JSDOM } from 'jsdom'

type OpenGraphData = {
  url: string
  imageUrl: string | null
  title: string | null
  description: string | null
}

type Response = null | OpenGraphData | { isError: true; message: string }
export default async function bookmarkApi(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { url: urlQuery } = req.query

  if (!urlQuery || typeof urlQuery !== 'string') {
    res
      .status(400)
      .json({ isError: true, message: 'url query was not provided' })
    return
  }

  let url: URL
  try {
    url = new URL(urlQuery)
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('invalid protocol')
    }
  } catch {
    res.status(400).json({ isError: true, message: 'invalid url' })
    return
  }

  res.setHeader('Cache-Control', 's-maxage=3600')

  try {
    const openGraphData = await fetchOpengraphData(url.toString())
    res.json(openGraphData)
    return
  } catch {
    res.json({
      url: url.toString(),
      imageUrl: null,
      description: null,
      title: null
    })
    return
  }
}

const fetchOpengraphData = async (url: string): Promise<OpenGraphData> => {
  const response = await fetch(url, {
    headers: { 'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8,ja-JP;q=0.7' }
  })
  const contentType = response.headers.get('Content-Type')

  if (!contentType || !contentType.startsWith('text/html')) {
    throw new Error('Invalid content-type')
  }

  const dom = new JSDOM(await response.text())
  const getOgContent = (property: string) =>
    dom.window.document
      .querySelector(`meta[property="${property}"]`)
      ?.getAttribute('content')
  const imageUrl = getOgContent('og:image') ?? null
  const title =
    getOgContent('og:title') ??
    dom.window.document.querySelector('title')?.textContent ??
    null
  const canonicalUrl = getOgContent('og:url') ?? url
  const description =
    getOgContent('og:description') ??
    dom.window.document
      .querySelector('meta[name="description"]')
      ?.getAttribute('content') ??
    null

  return {
    url: canonicalUrl,
    imageUrl,
    title,
    description
  }
}
