import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useUserStore } from 'src/4.features/model/providers'
import { UserActionTypes } from 'src/4.features/model/store/user/reducer'
import { queryClient } from 'src/6.shared/api'
import { Loading } from 'src/6.shared/ui'

export default function CallbackPage() {
    const router = useRouter()
    const params = useSearchParams()
    const code = params.get('code')
    const dispatch = useUserStore((state) => state.dispatch)
    const { data: signInData } = useQuery<{
        email: string
        given_name: string
        picture: string
    }>({ enabled: !!code, queryKey: ['/auth/google', { code }] }, queryClient)

    useEffect(() => {
        if (signInData) {
            dispatch({
                type: UserActionTypes.SIGN_IN,
                payload: {
                    email: signInData.email,
                    username: signInData.given_name,
                    profilePicture: signInData.picture,
                },
            })
            router.push('/')
        }
    }, [signInData])

    return <Loading />
}
