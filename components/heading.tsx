import React from 'react'

type Level = 2 | 3 | 4
type Props = {
  level: Level
} & JSX.IntrinsicElements['h2']

// NOTE: 見た目の制御とマークアップの見出しレベルは別で指定できた方がいいかもしれない
const styleClassByLevel = (level: Level) => {
  switch (level) {
    case 2:
      return 'py-2 text-2xl font-bold'
    case 3:
      return 'py-2 text-xl font-bold'
    case 4:
      return 'py-2 text-lg font-bold'
  }
}

const Heading: React.FC<Props> = ({
  level,
  children,
  className = '',
  ...rest
}) => {
  const Wrapper: `h${Level}` = `h${level}`
  const styleClass = styleClassByLevel(level)

  return (
    <Wrapper className={`${styleClass} ${className}`} {...rest}>
      {children}
    </Wrapper>
  )
}

export default Heading
