import App from '../src/1.app/ui'
import LandingPage from '../src/2.pages/ui'

export default function IndexPage({
    BACKEND_SOCKET_URL,
}: {
    BACKEND_SOCKET_URL: string
}) {
    return (
        <App BACKEND_SOCKET_URL={BACKEND_SOCKET_URL}>
            <LandingPage />
        </App>
    )
}

export const getStaticProps = async () => {
    if (!process.env.BACKEND_SOCKET_URL) {
        console.error(
            'BACKEND_SOCKET_URL is not defined in the environment variables.'
        )
        return { props: { BACKEND_SOCKET_URL: '' } }
    }

    return { props: { BACKEND_SOCKET_URL: process.env.BACKEND_SOCKET_URL } }
}
