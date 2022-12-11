type HeadProps = {
  title?: string
  description?: string
  ogType?: string
  ogImage?: string
}

const DefaultHead = (props: HeadProps) => {
  const { title, description, ogType, ogImage } = props
  const titleTag = title ? `${title} - tips chips` : 'tips chips'
  const defaultDescription =
    '日々の作業で出てきた技術メモの切れ端を置いておくページ。Web周りの話題が多め。'

  return (
    <>
      <title>{titleTag}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link rel="icon" type={'image/png'} href="/chip-icon.png" />
      <link
        rel={'apple-touch-icon'}
        type={'image/png'}
        href={'/chip-icon.png'}
      />
      <meta name={'description'} content={description || defaultDescription} />
      <meta
        property={'og:description'}
        content={description || defaultDescription}
      />
      <meta property={'og:title'} content={title || titleTag} />
      {ogType && <meta property={'og:type'} content={ogType} />}
      {ogImage && <meta property={'og:image'} content={ogImage} />}
    </>
  )
}

export default DefaultHead
