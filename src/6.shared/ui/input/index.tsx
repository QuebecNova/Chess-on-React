import { ChangeEvent, KeyboardEvent } from 'react'
import classes from './input.module.css'

type Props = {
    type: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    value: string
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
    placeholder?: string
    className?: string
    label?: boolean
    id?: string
    labelText?: string
}

export default function Input(props: Props) {
    return (
        <>
            {props.label && <label htmlFor={props.id}>{props.labelText}</label>}
            <input
                type={props.type}
                id={props.id || ''}
                className={`${classes.input} ${props.className || ''}`}
                onChange={props.onChange}
                onKeyDown={props.onKeyDown}
                placeholder={props.placeholder || ''}
                value={props.value}
            />
        </>
    )
}
