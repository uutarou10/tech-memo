import React, { Fragment } from 'react'
import {
  BlockObjectResponse,
  CodeBlockObjectResponse,
  RichTextItemResponse,
  TableRowBlockObjectResponse
} from '@notionhq/client/build/src/api-endpoints'
import { getClient, getPageBlocks } from '#/api/notion'
import hljs from 'highlight.js'

type ListWrapper = {
  type: '__list_wrapper'
  listType: 'bullet' | 'numbered' | 'todo'
  blocks: BlockObjectResponse[]
  id: string
}

const RichText: React.FC<{ richText: RichTextItemResponse }> = ({
  richText
}) => {
  const className = (() => {
    let result = []
    if (richText.annotations.bold) {
      result.push('font-bold')
    }
    if (richText.annotations.italic) {
      result.push('italic')
    }
    if (richText.annotations.underline) {
      result.push('underline')
    }
    if (richText.annotations.strikethrough) {
      result.push('line-through')
    }
    switch (richText.annotations.color) {
      case 'gray':
        result.push('text-gray-600')
        break
      case 'brown':
        result.push('text-yellow-700')
        break
      case 'orange':
        result.push('text-orange-600')
        break
      case 'yellow':
        result.push('text-yellow-600')
        break
      case 'green':
        result.push('text-green-600')
        break
      case 'blue':
        result.push('text-blue-600')
        break
      case 'purple':
        result.push('text-purple-600')
        break
      case 'pink':
        result.push('text-pink-600')
        break
      case 'red':
        result.push('text-red-600')
        break
      case 'gray_background':
        result.push('bg-gray-200')
        break
      case 'brown_background':
        result.push('bg-yellow-600')
        break
      case 'orange_background':
        result.push('bg-orange-200')
        break
      case 'yellow_background':
        result.push('bg-yellow-200')
        break
      case 'green_background':
        result.push('bg-green-200')
        break
      case 'blue_background':
        result.push('bg-blue-200')
        break
      case 'purple_background':
        result.push('bg-purple-200')
        break
      case 'pink_background':
        result.push('bg-pink-200')
        break
      case 'red_background':
        result.push('bg-red-200')
        break
      case 'default':
      default:
      // do nothing
    }

    return result.join(' ')
  })()

  const Text = richText.plain_text.split('\n').map((text, i) => (
    <Fragment key={i}>
      {i !== 0 ? <br /> : null}
      {text}
    </Fragment>
  ))

  if (richText.href) {
    return (
      <a
        className={`text-sky-800 underline underline-offset-4 ${className}`}
        href={richText.href}
        target="_blank"
        rel="noreferrer"
      >
        {Text}
      </a>
    )
  } else if (richText.annotations.code) {
    return (
      <code className={`bg-stone-200 p-1 text-red-500 ${className}`}>
        {Text}
      </code>
    )
  } else {
    return <span className={className}>{Text}</span>
  }
}

const RichTexts: React.FC<{ richTexts: RichTextItemResponse[] }> = ({
  richTexts
}) => (
  <>
    {richTexts.map((richText, i) => (
      <RichText key={i} richText={richText} />
    ))}
  </>
)

const TableRow: React.FC<{
  cells: TableRowBlockObjectResponse['table_row']['cells']
  hasColumnHeader: boolean
  hasRowHeader: boolean
  rowNumber: number
}> = ({ cells, hasColumnHeader, hasRowHeader, rowNumber }) => (
  <tr>
    {cells.map((cell, i) => {
      const Wrapper =
        (hasColumnHeader && i === 0) || (hasRowHeader && rowNumber === 0)
          ? 'th'
          : 'td'
      return (
        <Wrapper
          key={i}
          className={`border border-gray-200 p-1 text-left ${
            Wrapper === 'th' ? 'bg-gray-100' : ''
          }`}
        >
          <RichTexts richTexts={cell} />
        </Wrapper>
      )
    })}
  </tr>
)

const Table = async ({
  parentBlockId,
  hasColumnHeader,
  hasRowHeader
}: {
  parentBlockId: string
  hasColumnHeader: boolean
  hasRowHeader: boolean
}) => {
  const blocks = await getPageBlocks(getClient(), parentBlockId)

  return (
    <table className={'mb-2 w-full max-w-[1280px] border border-gray-200 py-3'}>
      {blocks[0] && blocks[0].type === 'table_row' && hasRowHeader && (
        <thead>
          <TableRow
            cells={blocks[0].table_row.cells}
            hasColumnHeader={hasColumnHeader}
            hasRowHeader={hasRowHeader}
            rowNumber={0}
          />
        </thead>
      )}

      <tbody>
        {blocks.map((block, i) => {
          if ((i === 0 && hasRowHeader) || block.type !== 'table_row') {
            return null
          }

          return (
            <TableRow
              key={i}
              cells={block.table_row.cells}
              hasColumnHeader={hasColumnHeader}
              hasRowHeader={hasRowHeader}
              rowNumber={i}
            />
          )
        })}
      </tbody>
    </table>
  )
}

const Code = (props: {
  richTexts: RichTextItemResponse[]
  language: CodeBlockObjectResponse['code']['language']
  className: string
}) => {
  const { richTexts, language, className } = props
  const code = richTexts.reduce(
    (prev, richText) => prev + richText.plain_text,
    ''
  )

  // 手抜きだが、Notionから渡されてきたlanguageをそのままhighlight.jsに渡している
  // highlight.js側が対応していないと例外をthrowするのでその時はhighlightAutoを使う
  const html = (() => {
    const formattedLanguage = language === 'plain text' ? 'plaintext' : language
    try {
      return hljs.highlight(code, { language: formattedLanguage }).value
    } catch {
      return hljs.highlightAuto(code).value
    }
  })()

  return (
    <code
      className={`hljs !md:p-4 block w-full overflow-x-scroll whitespace-pre !p-3 leading-normal ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

const NotionBlock: React.FC<{ block: BlockObjectResponse | ListWrapper }> = ({
  block
}) => {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className={'mb-2'}>
          {block.paragraph.rich_text.map((richText, i) => (
            <RichText richText={richText} key={i} />
          ))}
          {block.has_children ? (
            <>
              {/* @ts-ignore Server Components */}
              <NotionBlocks parentBlockId={block.id} />
            </>
          ) : null}
        </p>
      )
    case 'heading_1':
      return (
        <h2 className={'py-2 text-2xl font-bold'}>
          {block.heading_1.rich_text.map((richText, i) => (
            <RichText richText={richText} key={i} />
          ))}
          {block.has_children ? (
            <>
              {/* @ts-ignore Server Components */}
              <NotionBlocks parentBlockId={block.id} />
            </>
          ) : null}
        </h2>
      )
    case 'heading_2':
      return (
        <h3 className={'py-2 text-xl font-bold'}>
          {block.heading_2.rich_text.map((richText, i) => (
            <RichText richText={richText} key={i} />
          ))}
          {block.has_children ? (
            <>
              {/* @ts-ignore Server Components */}
              <NotionBlocks parentBlockId={block.id} />
            </>
          ) : null}
        </h3>
      )
    case 'heading_3':
      return (
        <h3 className={'py-2 text-lg font-bold'}>
          {block.heading_3.rich_text.map((richText, i) => (
            <RichText richText={richText} key={i} />
          ))}
          {block.has_children ? (
            <>
              {/* @ts-ignore Server Components */}
              <NotionBlocks parentBlockId={block.id} />
            </>
          ) : null}
        </h3>
      )
    case '__list_wrapper':
      const Wrapper =
        block.listType === 'bullet' || block.listType === 'todo' ? 'ul' : 'ol'
      const listTypeClass =
        block.listType === 'bullet' || block.listType === 'todo'
          ? 'list-disc'
          : 'list-decimal'
      return (
        <Wrapper className={`${listTypeClass} mb-2 pl-7`}>
          {block.blocks.map(block => (
            <NotionBlock block={block} key={block.id} />
          ))}
        </Wrapper>
      )
    case 'bulleted_list_item':
      return (
        <li>
          {block.bulleted_list_item.rich_text.map((richText, i) => (
            <RichText richText={richText} key={i} />
          ))}
          {block.has_children ? (
            <>
              {/* @ts-ignore Server Components */}
              <NotionBlocks parentBlockId={block.id} />
            </>
          ) : null}
        </li>
      )
    case 'numbered_list_item':
      return (
        <li>
          {block.numbered_list_item.rich_text.map((richText, i) => (
            <RichText richText={richText} key={i} />
          ))}
          {block.has_children ? (
            <>
              {/* @ts-ignore Server Components */}
              <NotionBlocks parentBlockId={block.id} />
            </>
          ) : null}
        </li>
      )
    case 'quote':
      return (
        <blockquote className={'mb-2 border-l-2 border-l-black pl-4'}>
          <RichTexts richTexts={block.quote.rich_text} />
          {block.has_children ? (
            <>
              {/* @ts-ignore Server Components */}
              <NotionBlocks parentBlockId={block.id} />
            </>
          ) : null}
        </blockquote>
      )
    case 'to_do':
      return (
        <li>
          {/* markup直した方が良さそう */}
          <input type={'checkbox'} defaultChecked={block.to_do.checked} />
          <RichTexts richTexts={block.to_do.rich_text} />
          {block.has_children ? (
            <>
              {/* @ts-ignore Server Components */}
              <NotionBlocks parentBlockId={block.id} />
            </>
          ) : null}
        </li>
      )
    case 'toggle':
      return (
        <details className={'mb-2'}>
          <summary>
            <RichTexts richTexts={block.toggle.rich_text} />
          </summary>
          {block.has_children ? (
            <>
              {/* @ts-ignore Server Components */}
              <NotionBlocks parentBlockId={block.id} />
            </>
          ) : null}
        </details>
      )
    case 'equation':
      // katexを入れてその結果をrenderすればいいだなんだが styleの扱いとか面倒なので一旦放置
      return null
    case 'code':
      return (
        <figure className={'mb-2'}>
          <Code
            className={'mb-1'}
            richTexts={block.code.rich_text}
            language={block.code.language}
          />
          {block.code.caption.length > 0 && (
            <figcaption className={'text-sm text-gray-700'}>
              <RichTexts richTexts={block.code.caption} />
            </figcaption>
          )}
        </figure>
      )
    case 'callout':
      // iconの対応が必要
      return (
        <section className={'mb-2 bg-gray-100 p-4'}>
          <RichTexts richTexts={block.callout.rich_text} />
          {block.has_children ? (
            <>
              {/* @ts-ignore Server Components */}
              <NotionBlocks parentBlockId={block.id} />
            </>
          ) : null}
        </section>
      )
    case 'divider':
      return <hr className={'py-2'} />
    case 'column_list':
      return (
        <div className={'flex flex-col gap-0 md:flex-row md:gap-2'}>
          {block.has_children ? (
            <>
              {/* @ts-ignore Server Components */}
              <NotionBlocks parentBlockId={block.id} />
            </>
          ) : null}
        </div>
      )
    case 'column':
      return (
        <div className={'flex-grow'}>
          {block.has_children ? (
            <>
              {/* @ts-ignore Server Components */}
              <NotionBlocks parentBlockId={block.id} />
            </>
          ) : null}
        </div>
      )
    case 'table':
      return (
        <>
          {/* @ts-ignore Server Components */}
          <Table
            parentBlockId={block.id}
            hasColumnHeader={block.table.has_column_header}
            hasRowHeader={block.table.has_row_header}
          />
        </>
      )
    case 'table_row':
      // table rowはTableコンポーネント内で処理しているのでここでは何もしない
      return null
    case 'embed':
      // ひとまずURLをそのまま展開するようにしておく
      // TODO: caption未対応
      return (
        <p className={'mb-2'}>
          <a
            className={'text-sky-800 underline underline-offset-4'}
            href={block.embed.url}
            target="_blank"
            rel="noreferrer"
          >
            {block.embed.url}
          </a>
        </p>
      )
    case 'bookmark':
      return (
        <p className={'mb-2'}>
          <a
            className={'text-sky-800 underline underline-offset-4'}
            href={block.bookmark.url}
            target="_blank"
            rel="noreferrer"
          >
            {block.bookmark.url}
          </a>
        </p>
      )
    case 'image':
      const imageUrl =
        block.image.type === 'external'
          ? block.image.external.url
          : block.image.file.url
      // ちゃんとしたaltを入れたいがどうしたものか…
      return (
        <figure className={'mb-2 max-w-full'}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={'mb-1 w-full max-w-[1280px]'}
            src={imageUrl}
            alt="画像"
          />
          {block.image.caption.length >= 0 ? (
            <figcaption className={'text-sm text-gray-700'}>
              <RichTexts richTexts={block.image.caption} />
            </figcaption>
          ) : null}
        </figure>
      )
    //  以下面倒なので作る気がない要素たち
    case 'template':
    case 'synced_block':
    case 'child_page':
    case 'child_database':
    case 'breadcrumb':
    case 'table_of_contents': // tocはどっちにしても自分で構築しないといけないようなので
    case 'link_to_page': // これは内部リンクだったら有効にしてもいいかもしれないな
    case 'video':
    case 'pdf':
    case 'file':
    case 'audio':
    case 'link_preview':
    case 'unsupported':
      return null
  }
}

export const NotionBlocks = async ({
  parentBlockId
}: {
  parentBlockId: string
}) => {
  const blocks = await getPageBlocks(getClient(), parentBlockId)

  const _blocks = blocks.reduce((prev, block, i) => {
    if (
      block.type !== 'bulleted_list_item' &&
      block.type !== 'numbered_list_item' &&
      block.type !== 'to_do'
    ) {
      return [...prev, block]
    }

    const lastBlock = prev.at(-1)
    if (!lastBlock || lastBlock.type !== '__list_wrapper') {
      const listType: 'bullet' | 'numbered' | 'todo' =
        block.type === 'bulleted_list_item'
          ? 'bullet'
          : block.type === 'to_do'
          ? 'todo'
          : 'numbered'
      return [
        ...prev,
        {
          type: '__list_wrapper' as const,
          listType: listType,
          blocks: [block],
          id: block.id
        }
      ]
    }

    return [
      ...prev.slice(0, -1),
      { ...lastBlock, blocks: [...lastBlock.blocks, block] }
    ]
  }, [] as (BlockObjectResponse | ListWrapper)[])

  return (
    <>
      {_blocks.map(block => (
        <NotionBlock block={block} key={block.id} />
      ))}
    </>
  )
}

export default NotionBlock
