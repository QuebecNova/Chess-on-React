import MainLayout from './layout/MainLayout'

export default function App({ children }: { children: React.ReactNode }) {
    return <MainLayout>{children}</MainLayout>
}
