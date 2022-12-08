type HeadProps = {
  title?: string
  description?: string
  ogType?: string
}

const DefaultHead = (props: HeadProps) => {
  const {
    title,
    description,
    ogType
  } = props
  const titleTag = title ? `${title} - tips chips` : 'tips chips'

  return (
    <>
      <title>{titleTag}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link rel="icon" type={'image/png'} href="/chip-icon.png" />
      <link rel={'apple-touch-icon'} type={'image/png'} href={'/chip-icon.png'} />
      <meta name={'description'} content={description} />
      <meta property={'og:description'} content={description} />
      <meta property={'og:title'} content={title} />
      {ogType && <meta property={'og:type'} content={ogType} />}
    </>
  )
}

export default DefaultHead
