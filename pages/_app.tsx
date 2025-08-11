import { Viewport } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import App from '../src/1.app/ui'
import '../src/1.app/ui/styles/index.css'

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
}
export default function _app({
    Component,
    pageProps,
    user,
}: AppProps & { user: any }) {
    return (
        <>
            <Head>
                <link rel="icon" href="./favicon.ico" type="./favicon.ico" />
                <title>Hamchess</title>
            </Head>
            <App>
                <Component {...pageProps} user={user} />
            </App>
        </>
    )
}
