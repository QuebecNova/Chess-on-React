import { AppProps } from 'next/app'
import '../src/1.app/ui/styles/index.css'
import { buildClient } from '../src/6.shared/api/buildClient'

export default function _app({
    Component,
    pageProps,
    user,
}: AppProps & { user: any }) {
    return <Component {...pageProps} user={user} />
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
