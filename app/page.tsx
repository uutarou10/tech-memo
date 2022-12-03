import Link from 'next/link'
import {getClient, getPageList} from '../api/notion'

export default async function Home() {
  const pages = await getPageList(getClient())

  return (
    <div>
      <h1>hello world!!</h1>
      <ul>
        {pages.map(page => (
          <li key={page.id}>
            <Link href={`p/${page.id}`}>
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
