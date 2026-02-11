'use client'

import { Flex, HStack, Separator, Stack, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'
import { useUserStore } from 'src/4.features/model/providers'
import { UserActionTypes } from 'src/4.features/model/store'
import { queryClient } from 'src/6.shared/api'
import { Button, Input, PasswordInput } from 'src/6.shared/ui'

export default function SignIn() {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<{
        password: string
        email: string
    }>()
    const password = watch('password')
    const email = watch('email')
    const dispatch = useUserStore((state) => state.dispatch)
    const { data: url, isSuccess } = useQuery(
        { queryKey: ['/auth/get-url-auth'] },
        queryClient
    )
    const {
        data: signInData,
        refetch,
        isLoading: isSignInLoading,
    } = useQuery<{ email: string; photo: string }>(
        {
            enabled: false,
            queryKey: ['/auth/signin', { password, email }],
        },
        queryClient
    )

    useEffect(() => {
        if (signInData) {
            dispatch({
                type: UserActionTypes.SIGN_IN,
                payload: {
                    email: signInData.email,
                    profilePicture: signInData.photo,
                },
            })
        }
    }, [signInData])

    async function onSignInWithGoogle() {
        router.push(url)
    }

    const SignIn = handleSubmit(() => {
        if (email && password) {
            refetch()
        }
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                SignIn()
            }}
        >
            <Flex flexDirection="column" gap="4">
                <Input
                    labelText="Email"
                    placeholder="Enter your email"
                    {...register('email')}
                />
                <Stack mb="8">
                    <PasswordInput
                        labelText="Password"
                        {...register('password')}
                    />
                </Stack>
                <Button type="submit" disabled={isSignInLoading}>
                    Sign in
                </Button>
                <HStack>
                    <Separator flex="1" borderColor="gray" />
                    <Text flexShrink="0" fontSize="md">
                        Or
                    </Text>
                    <Separator flex="1" borderColor="gray" />
                </HStack>
                <Button onClick={onSignInWithGoogle} disabled={!isSuccess}>
                    <FcGoogle /> Sign in with Google
                </Button>
            </Flex>
        </form>
    )
}
