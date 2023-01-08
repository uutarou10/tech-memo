import { BookmarkData } from '#/types/bookmark'
import { JSDOM } from 'jsdom'

export const fetchOpengraphData = async (
  url: string,
  fetchOption?: RequestInit
): Promise<BookmarkData> => {
  const response = await fetch(url, {
    ...fetchOption,
    headers: {
      ...fetchOption?.headers,
      'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8,ja-JP;q=0.7'
    }
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
