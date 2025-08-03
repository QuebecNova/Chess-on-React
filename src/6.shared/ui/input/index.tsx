import { Input as ChakraInput, Field } from '@chakra-ui/react'
import { ChangeEvent, KeyboardEvent } from 'react'

type Props = {
    type: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    value: string
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
    placeholder?: string
    className?: string
    id?: string
    labelText?: string
}

export default function Input(props: Props) {
    return (
        <Field.Root>
            {props.labelText && <Field.Label>{props.labelText}</Field.Label>}
            <ChakraInput
                type={props.type}
                id={props.id || ''}
                variant="subtle"
                onChange={props.onChange}
                onKeyDown={props.onKeyDown}
                placeholder={props.placeholder || ''}
                value={props.value}
            />
        </Field.Root>
    )
}
