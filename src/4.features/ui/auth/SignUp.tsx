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
import {
    Button,
    Input,
    PasswordInput,
    PasswordStrengthMeter,
} from 'src/6.shared/ui'

export default function SignUp() {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<{
        password: string
        passwordConfirm: string
        email: string
    }>()
    const dispatch = useUserStore((state) => state.dispatch)
    const password = watch('password')
    const email = watch('email')
    const { data: url, isSuccess } = useQuery(
        { queryKey: ['/auth/get-url-auth'] },
        queryClient
    )
    const {
        data: signUpData,
        refetch,
        isLoading: isSignUpLoading,
    } = useQuery<{ email: string; photo: string }>(
        {
            enabled: false,
            queryKey: ['/auth/signup', { password, email }],
        },
        queryClient
    )

    useEffect(() => {
        if (signUpData) {
            dispatch({
                type: UserActionTypes.SIGN_IN,
                payload: {
                    email: signUpData.email,
                    profilePicture: signUpData.photo,
                },
            })
        }
    }, [signUpData])

    async function onSignUpWithGoogle() {
        router.push(url)
    }

    const SignUp = handleSubmit(() => {
        if (email && password) {
            refetch()
        }
    })

    function getPasswordStrength() {
        if (password) {
            if (password.length < 4) return 1
            if (password.length < 8) return 2
            if (password.length < 12) return 3
            if (password.length >= 12) return 4
        }
        return 0
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                SignUp()
            }}
        >
            <Flex flexDirection="column" gap="4">
                <Input
                    labelText="Email"
                    placeholder="Enter your email"
                    {...register('email')}
                />
                <Stack>
                    <PasswordInput
                        labelText="Password"
                        {...register('password')}
                    />
                    <PasswordStrengthMeter value={getPasswordStrength()} />
                </Stack>
                <Button type="submit" disabled={isSignUpLoading}>
                    Sign up
                </Button>
                <HStack>
                    <Separator flex="1" borderColor="gray" />
                    <Text flexShrink="0" fontSize="md">
                        Or
                    </Text>
                    <Separator flex="1" borderColor="gray" />
                </HStack>
                <Button onClick={onSignUpWithGoogle} disabled={!isSuccess}>
                    <FcGoogle /> Sign up with Google
                </Button>
            </Flex>
        </form>
    )
}
