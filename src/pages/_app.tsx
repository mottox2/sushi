import { AppProps } from 'next/app'
import 'ress'
import './global.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
