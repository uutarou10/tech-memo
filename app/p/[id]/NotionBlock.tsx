import React, {Fragment} from 'react'
import {
  BlockObjectResponse,
  RichTextItemResponse,
  TableRowBlockObjectResponse
} from '@notionhq/client/build/src/api-endpoints'
import {getClient, getPageBlocks} from '../../../api/notion'

type ListWrapper = {
  type: '__list_wrapper',
  listType: 'bullet' | 'numbered' | 'todo',
  blocks: BlockObjectResponse[],
  id: string
}

const RichText: React.FC<{ richText: RichTextItemResponse }> = ({ richText }) => {
  const Text = richText.plain_text.split('\n').map((text, i) => <Fragment key={i}>{i !== 0 ?
    <br/> : null}{text}</Fragment>)

  return richText.href
    ? (<a href={richText.href} target="_blank" rel="noreferrer">{Text}</a>)
    : (<Fragment>{Text}</Fragment>)
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

const NotionBlock: React.FC<{ block: BlockObjectResponse | ListWrapper }> = ({ block }) => {
  switch (block.type) {
    case 'paragraph':
      return (
        <p>
          {block.paragraph.rich_text.map((richText, i) => (
            <RichText richText={richText} key={i}/>
          ))}
          {/* @ts-ignore Server Components */}
          {block.has_children ? <NotionBlocks parentBlockId={block.id} /> : null}
        </p>
      )
    case 'heading_1':
      return (
        <h1>
          {block.heading_1.rich_text.map((richText, i) => (
            <RichText richText={richText} key={i}/>
          ))}
          {/* @ts-ignore Server Components */}
          {block.has_children ? <NotionBlocks parentBlockId={block.id} /> : null}
        </h1>
      )
    case 'heading_2':
      return (
        <h2>
          {block.heading_2.rich_text.map((richText, i) => (
            <RichText richText={richText} key={i}/>
          ))}
          {/* @ts-ignore Server Components */}
          {block.has_children ? <NotionBlocks parentBlockId={block.id} /> : null}
        </h2>
      )
    case 'heading_3':
      return (
        <h3>
          {block.heading_3.rich_text.map((richText, i) => (
            <RichText richText={richText} key={i}/>
          ))}
          {/* @ts-ignore Server Components */}
          {block.has_children ? <NotionBlocks parentBlockId={block.id} /> : null}
        </h3>
      )
    case '__list_wrapper':
      const Wrapper = block.listType === 'bullet' || block.listType === 'todo' ? 'ul' : 'ol'
      return (<Wrapper>{block.blocks.map(block => <NotionBlock block={block} key={block.id}/>)}</Wrapper>)
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
        <blockquote>
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
        <details>
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
        <div>
          <code><RichTexts richTexts={block.code.rich_text}/></code>
          <p><RichTexts richTexts={block.code.caption} /></p>
        </div>
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
