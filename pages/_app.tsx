import { AppProps } from 'next/app'
import App from '../src/1.app/ui'
import '../src/1.app/ui/styles/index.css'

export default function _app({
    Component,
    pageProps,
    user,
    BACKEND_SOCKET_URL,
}: AppProps & { user: any; BACKEND_SOCKET_URL: string }) {
    return (
        <App BACKEND_SOCKET_URL={BACKEND_SOCKET_URL}>
            <Component {...pageProps} user={user} />
        </App>
    )
}

_app.getStaticProps = async ({ Component, ctx }) => {
    // const client = buildClient(ctx)
    if (!process.env.BACKEND_SOCKET_URL) {
        console.error(
            'BACKEND_SOCKET_URL is not defined in the environment variables.'
        )
        return { props: { BACKEND_SOCKET_URL: '' } }
    }

    return { props: { BACKEND_SOCKET_URL: process.env.BACKEND_SOCKET_URL } }
    // try {
    //     const { data } = await client.post('/api/v1/users/signin', {
    //         email: 'test@example.com',
    //         password: 'password1234',
    //         passwordConfirm: 'password1234',
    //     })
    //     console.log(data)
    //     let pageProps = {}
    //     if (Component.getInitialProps) {
    //         pageProps = await Component.getInitialProps(ctx, client, data.user)
    //     }

    //     return { pageProps, ...data }
    // } catch (err) {
    //     console.error(err.message)
    //     return {}
    // }
}
