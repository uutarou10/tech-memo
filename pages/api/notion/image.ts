import type { NextApiRequest, NextApiResponse } from 'next'
import { Client, isFullBlock } from '@notionhq/client'
import constants from '#/constants'

type Response = { imageUrl: string; isExternal: boolean } | { message: string }

export default async function notionImage(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { blockId } = req.query
  if (!blockId || typeof blockId !== 'string') {
    res.status(400)
    res.json({ message: 'bad request' })
    return
  }

  const notion = new Client({ auth: constants.notionApiKey })
  const response = await notion.blocks.retrieve({ block_id: blockId })

  if (!isFullBlock(response) || response.type !== 'image') {
    res.status(400)
    res.json({ message: 'invalid block type' })
    return
  }

  res.setHeader('Cache-Control', 's-maxage=3500')

  if (response.image.type === 'external') {
    res.json({
      imageUrl: response.image.external.url,
      isExternal: true
    })
    return
  }

  res.json({
    imageUrl: response.image.file.url,
    isExternal: false
  })
}
