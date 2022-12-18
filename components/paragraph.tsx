import React from 'react'

type Props = {
  children: React.ReactNode
} & JSX.IntrinsicElements['p']

const Paragraph: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <p className={`mb-2 ${className}`} {...rest}>
      {children}
    </p>
  )
}

export default Paragraph
