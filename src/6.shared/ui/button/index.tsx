import { ButtonProps, Button as ChakraButton } from '@chakra-ui/react'
import { ReactNode } from 'react'

type Props = {
    className?: string
    onClick?: () => void
    children?: ReactNode
} & ButtonProps

export default function Button(props: Props) {
    return (
        <ChakraButton variant="surface" onClick={props.onClick} {...props}>
            {props.children}
        </ChakraButton>
    )
}
