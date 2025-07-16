import MainLayout from './layout/MainLayout'

export default function App({
    children,
    BACKEND_SOCKET_URL,
}: {
    children: React.ReactNode
    BACKEND_SOCKET_URL: string
}) {
    return (
        <MainLayout BACKEND_SOCKET_URL={BACKEND_SOCKET_URL}>
            {children}
        </MainLayout>
    )
}
