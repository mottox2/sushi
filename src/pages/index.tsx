import Head from 'next/head'
import { App } from '../components/App'

const title = '寿司廻し'
const description = 'あなたのタイピングで寿司を回して、より速く寿司を回そう！'
const imageUrl = '/ogp.png'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} key="description" />
        <meta property="og:description" content={description} key="description" />
        <meta property="og:type" content="website" key="type" />
        <meta property="og:type" content="website" key="type" />
        <meta property="og:image" content={imageUrl} key="image" />
        <meta name="twitter:creator" content="@mottox2" key="twitter:creater" />
        <meta name="twitter:title" content={title} key="twitter:title" />
        <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
        <meta name="twitter:description" content={description} key="twitter:description" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <App />
    </div>
  )
}
