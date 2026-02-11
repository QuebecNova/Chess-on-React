import { Input as ChakraInput, Field, InputProps } from '@chakra-ui/react'

type Props = {
    className?: string
    labelText?: string
} & InputProps

export default function Input({ labelText, ...props }: Props) {
    return (
        <Field.Root>
            {labelText && <Field.Label>{labelText}</Field.Label>}
            <ChakraInput variant="subtle" {...props} />
        </Field.Root>
    )
}
