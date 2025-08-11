import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://backend'

export const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': 'http://hamchess.localhost',
        'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT',
        'Access-Control-Allow-Headers':
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    },
})

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: async ({ queryKey: [url, payload] }) => {
                if (typeof url === 'string' && !payload) {
                    const { data } = await axiosClient.get(
                        `${BASE_URL}/api/v1${url}`
                    )
                    return data
                }
                if (typeof url === 'string' && payload) {
                    const { data } = await axiosClient.post(
                        `${BASE_URL}/api/v1${url}`,
                        payload
                    )
                    return data
                }
                throw new Error('Invalid queryKey')
            },
            staleTime: Infinity,
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
})
