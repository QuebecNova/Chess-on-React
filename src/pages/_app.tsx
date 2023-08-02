import { AppProps } from 'next/app'
import MainLayout from '../layout/MainLayout'
import '../styles/index.scss'
import { buildClient } from '../api/buildClient'

export default function _app({
    Component,
    pageProps,
    user,
}: AppProps & { user: any }) {
    return (
        <MainLayout>
            <Component {...pageProps} user={user} />
        </MainLayout>
    )
}

_app.getInitialProps = async ({ Component, ctx }) => {
    const client = buildClient(ctx)
    try {
        const { data } = await client.post('/api/v1/users/signin', {
            email: 'test@example.com',
            password: 'password1234',
            passwordConfirm: 'password1234',
        })
        console.log(data)
        let pageProps = {}
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx, client, data.user)
        }

        return { pageProps, ...data }
    } catch (err) {
        console.error(err.message)
        return {}
    }
}
