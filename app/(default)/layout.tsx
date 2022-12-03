import Header from '../../components/header'

const DefaultLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="font-sans px-4 md:px-8 pt-2">
      <Header className={'mb-6'} />
      <>{children}</>
    </div>
  )
}

export default DefaultLayout

