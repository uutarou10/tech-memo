import React, {Fragment} from 'react'
import {
  BlockObjectResponse,
  RichTextItemResponse,
  TableRowBlockObjectResponse
} from '@notionhq/client/build/src/api-endpoints'
import {getClient, getPageBlocks} from '../api/notion'
import hljs from 'highlight.js'

type ListWrapper = {
  type: '__list_wrapper',
  listType: 'bullet' | 'numbered' | 'todo',
  blocks: BlockObjectResponse[],
  id: string
}

const RichText: React.FC<{ richText: RichTextItemResponse }> = ({ richText }) => {
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
        break;
      case 'brown':
        result.push('text-yellow-700')
        break;
      case 'orange':
        result.push('text-orange-600')
        break;
      case 'yellow':
        result.push('text-yellow-600')
        break;
      case 'green':
        result.push('text-green-600')
        break;
      case 'blue':
        result.push('text-blue-600')
        break;
      case 'purple':
        result.push('text-purple-600')
        break;
      case 'pink':
        result.push('text-pink-600')
        break;
      case 'red':
        result.push('text-red-600')
        break;
      case 'gray_background':
        result.push('bg-gray-200')
        break;
      case 'brown_background':
        result.push('bg-yellow-600')
        break;
      case 'orange_background':
        result.push('bg-orange-200')
        break;
      case 'yellow_background':
        result.push('bg-yellow-200')
        break;
      case 'green_background':
        result.push('bg-green-200')
        break;
      case 'blue_background':
        result.push('bg-blue-200')
        break;
      case 'purple_background':
        result.push('bg-purple-200')
        break;
      case 'pink_background':
        result.push('bg-pink-200')
        break;
      case 'red_background':
        result.push('bg-red-200')
        break;
      case 'default':
      default:
        // do nothing
    }

    return result.join(' ')
  })()

  const Text = richText.plain_text.split('\n').map((text, i) => <Fragment key={i}>{i !== 0 ?
    <br/> : null}{text}</Fragment>)

  if (richText.href) {
    return (<a className={`underline underline-offset-4 text-sky-800 ${className}`} href={richText.href} target="_blank" rel="noreferrer">{Text}</a>)
  } else if (richText.annotations.code) {
    return (<code className={`bg-stone-200 text-red-500 p-1 ${className}`}>{Text}</code>)
  } else {
    return (<span className={className}>{Text}</span>)
  }
}

const RichTexts: React.FC<{richTexts: RichTextItemResponse[]}> = ({richTexts}) => (<>{richTexts.map((richText, i) => <RichText key={i} richText={richText} />)}</>)

const TableRow: React.FC<{cells: TableRowBlockObjectResponse['table_row']['cells'], hasColumnHeader: boolean, hasRowHeader: boolean, rowNumber: number}> = ({cells, hasColumnHeader, hasRowHeader, rowNumber}) => (
  <tr>
    {cells.map((cell, i) => {
      const Wrapper = (hasColumnHeader && i === 0) || (hasRowHeader && rowNumber === 0) ? 'th' : 'td'
      return (
        <Wrapper key={i}>
          <RichTexts richTexts={cell} />
        </Wrapper>
      )
    })}
  </tr>
)

const Table = async ({parentBlockId, hasColumnHeader, hasRowHeader}: {parentBlockId: string, hasColumnHeader: boolean, hasRowHeader: boolean}) => {
  const blocks = await getPageBlocks(getClient(), parentBlockId)

  return (
    <table>
      {blocks.map((block, i) => {
        if (block.type !== 'table_row') {
          // tableのchildrenにはtable_rowしかかえってこないハズ
          return null
        }

        if (i === 0) {
          if (hasRowHeader) {
            return (
              <thead key={i}>
                <TableRow cells={block.table_row.cells} hasColumnHeader={hasColumnHeader} hasRowHeader={hasRowHeader} rowNumber={i} />
              </thead>
            )
          } else {
            return (
              <Fragment key={i}>
                <thead></thead>
                <TableRow cells={block.table_row.cells} hasColumnHeader={hasColumnHeader} hasRowHeader={hasRowHeader} rowNumber={i} />
              </Fragment>
            )
          }
        }

        return <TableRow key={i} cells={block.table_row.cells} hasColumnHeader={hasColumnHeader} hasRowHeader={hasRowHeader} rowNumber={i} />
      })}
    </table>
  )
}

const Code = ({richTexts, language}: {richTexts: RichTextItemResponse[], language: string}) => {
  // Notionの仕様上はcode blockの中で文字装飾が使えるが、無視してplain_textを取り出して使う
  const code = richTexts.reduce((prev, richText) => (prev + richText.plain_text), '')
  const html = hljs.highlight(code, {language}).value

  return (
    <code className={'hljs !p-4 w-full block'} dangerouslySetInnerHTML={{__html: html}} />
  )
}

const NotionBlock: React.FC<{ block: BlockObjectResponse | ListWrapper }> = ({ block }) => {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className={'mb-2'}>
          {block.paragraph.rich_text.map((richText, i) => (
            <RichText richText={richText} key={i}/>
          ))}
          {/* @ts-ignore Server Components */}
          {block.has_children ? <NotionBlocks parentBlockId={block.id} /> : null}
        </p>
      )
    case 'heading_1':
      return (
        <h2 className={'font-bold text-2xl py-2'}>
          {block.heading_1.rich_text.map((richText, i) => (
            <RichText richText={richText} key={i}/>
          ))}
          {/* @ts-ignore Server Components */}
          {block.has_children ? <NotionBlocks parentBlockId={block.id} /> : null}
        </h2>
      )
    case 'heading_2':
      return (
        <h3 className={'font-bold text-xl py-2'}>
          {block.heading_2.rich_text.map((richText, i) => (
            <RichText richText={richText} key={i}/>
          ))}
          {/* @ts-ignore Server Components */}
          {block.has_children ? <NotionBlocks parentBlockId={block.id} /> : null}
        </h3>
      )
    case 'heading_3':
      return (
        <h3 className={'font-bold text-lg py-2'}>
          {block.heading_3.rich_text.map((richText, i) => (
            <RichText richText={richText} key={i}/>
          ))}
          {/* @ts-ignore Server Components */}
          {block.has_children ? <NotionBlocks parentBlockId={block.id} /> : null}
        </h3>
      )
    case '__list_wrapper':
      const Wrapper = block.listType === 'bullet' || block.listType === 'todo' ? 'ul' : 'ol'
      const listTypeClass = block.listType === 'bullet' || block.listType === 'todo' ? 'list-disc' : 'list-decimal'
      return (<Wrapper className={`${listTypeClass} pl-7 mb-2`}>{block.blocks.map(block => <NotionBlock block={block} key={block.id}/>)}</Wrapper>)
    case 'bulleted_list_item':
      return (
        <li>
          {block.bulleted_list_item.rich_text.map((richText, i) => <RichText richText={richText} key={i}/>)}
          {/* @ts-ignore Server Components */}
          {block.has_children ? <NotionBlocks parentBlockId={block.id} /> : null}
        </li>
      )
    case 'numbered_list_item':
      return (
        <li>
          {block.numbered_list_item.rich_text.map((richText, i) => <RichText richText={richText} key={i}/>)}
          {/* @ts-ignore Server Components */}
          {block.has_children ? <NotionBlocks parentBlockId={block.id} /> : null}
        </li>
      )
    case 'quote':
      return (
        <blockquote className={'border-l-2 border-l-black mb-2 pl-4'}>
          <RichTexts richTexts={block.quote.rich_text} />
          {/* @ts-ignore Server Components */}
          {block.has_children ? <NotionBlocks parentBlockId={block.id} /> : null}
        </blockquote>
      )
    case 'to_do':
      return (
        <li>
          {/* markup直した方が良さそう */}
          <input type={'checkbox'} defaultChecked={block.to_do.checked} />
          <RichTexts richTexts={block.to_do.rich_text} />
          {/* @ts-ignore Server Components */}
          {block.has_children ? <NotionBlocks parentBlockId={block.id} /> : null}
        </li>
      )
    case 'toggle':
      return (
        <details className={'mb-2'}>
          <summary>
            <RichTexts richTexts={block.toggle.rich_text} />
          </summary>
          {/* @ts-ignore Server Components */}
          {block.has_children ? <NotionBlocks parentBlockId={block.id} /> : null}
        </details>
      )
    case 'equation':
      // katexを入れてその結果をrenderすればいいだなんだが styleの扱いとか面倒なので一旦放置
      return null
    case 'code':
      return (
        <figure className={'mb-2'}>
          <Code richTexts={block.code.rich_text} language={block.code.language} />
          <figcaption><RichTexts richTexts={block.code.caption} /></figcaption>
        </figure>
      )
    case 'callout':
      // iconの対応が必要
      return (
        <div>
          <RichTexts richTexts={block.callout.rich_text} />
          {/* @ts-ignore Server Components */}
          {block.has_children ? <NotionBlocks parentBlockId={block.id} /> : null}
        </div>
      )
    case 'divider':
      return <hr />
    case 'column_list':
      return (
        <div data-column-wrapper="">
          {/* @ts-ignore Server Components */}
          {block.has_children ? <NotionBlocks parentBlockId={block.id} /> : null}
        </div>
      )
    case 'column':
      return (
        <div data-column="">
          {/* @ts-ignore Server Components */}
          {block.has_children ? <NotionBlocks parentBlockId={block.id} /> : null}
        </div>
      )
    case 'table':
      {/* @ts-ignore Server Components */}
      return <Table parentBlockId={block.id} hasColumnHeader={block.table.has_column_header} hasRowHeader={block.table.has_row_header} />
    case 'table_row':
      // table rowはTableコンポーネント内で処理しているのでここでは何もしない
      return null
    case 'embed':
      // ひとまずURLをそのまま展開するようにしておく
      // TODO: caption未対応
      return (
        <p><a href={block.embed.url} target="_blank" rel="noreferrer">{block.embed.url}</a></p>
      )
    case 'bookmark':
      return (
        <p><a href={block.bookmark.url} target="_blank" rel="noreferrer">{block.bookmark.url}</a></p>
      )
    case 'image':
      const imageUrl = block.image.type === 'external' ? block.image.external.url : block.image.file.url
      // todo: ちゃんとしたaltを入れる
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" />
          {block.image.caption.length >= 0 ? (<figcaption><RichTexts richTexts={block.image.caption} /></figcaption>) : null}
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

export const NotionBlocks = async ({ parentBlockId }: { parentBlockId: string }) => {
  const blocks = await getPageBlocks(getClient(), parentBlockId)

  const _blocks = blocks.reduce((prev, block, i) => {
    if (block.type !== 'bulleted_list_item' && block.type !== 'numbered_list_item' && block.type !== 'to_do') {
      return [...prev, block]
    }

    const lastBlock = prev.at(-1)
    if (!lastBlock || lastBlock.type !== '__list_wrapper') {
      const listType: 'bullet' | 'numbered' | 'todo' = block.type === 'bulleted_list_item' ? 'bullet' : block.type === 'to_do' ? 'todo' : 'numbered'
      return [...prev, { type: '__list_wrapper' as const, listType: listType, blocks: [block], id: block.id }]
    }

    return [
      ...prev.slice(0, -1),
      { ...lastBlock, blocks: [...lastBlock.blocks, block] }
    ]

  }, [] as (BlockObjectResponse | ListWrapper)[])

  return <>{_blocks.map(block => <NotionBlock block={block} key={block.id}/>)}</>
}

export default NotionBlock
