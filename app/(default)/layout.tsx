import { Metadata } from 'next'
import Header from '#/components/header'

const siteDescription =
  '日々の作業で出てきた技術メモの切れ端を置いておくページ。Web周りの話題が多め。'
export const metadata: Metadata = {
  title: {
    default: 'tips chips',
    template: '%s - tips chips'
  },
  description: siteDescription,
  openGraph: {
    title: 'tips chips',
    siteName: 'tips chips',
    description: siteDescription
  },
  icons: {
    icon: '/chip-icon.png',
    apple: '/chip-icon.png'
  }
}

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-4 pt-2 font-sans md:px-8">
      <Header className={'mb-6'} />
      <>{children}</>
    </div>
  )
}

export default DefaultLayout
