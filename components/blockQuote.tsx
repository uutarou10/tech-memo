import React from 'react'

type Props = JSX.IntrinsicElements['blockquote']

const BlockQuote: React.FC<Props> = ({ className, children, ...rest }) => {
  return (
    <blockquote
      className={`mb-2 border-l-2 border-l-black pl-4 ${className}`}
      {...rest}
    >
      {children}
    </blockquote>
  )
}

export default BlockQuote
