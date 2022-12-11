import Header from '../../components/header'

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-4 pt-2 font-sans md:px-8">
      <Header className={'mb-6'} />
      <>{children}</>
    </div>
  )
}

export default DefaultLayout
