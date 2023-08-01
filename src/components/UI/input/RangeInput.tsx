import React, { ChangeEvent } from 'react'
import classes from './rangeInput.module.scss'

type Props = {
    type: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    value: string
    min: number
    max: number
    className?: string
    label?: boolean
    id?: string
    labelText?: string
}

export default function Input(props: Props) {
    return (
        <>
            {props.label && (
                <label htmlFor={props.id} className={classes.rangeInput__label}>
                    {props.labelText}
                </label>
            )}
            <input
                type={props.type}
                id={props.id || ''}
                className={`${classes.rangeInput} ${props.className || ''}`}
                onChange={props.onChange}
                min={props.min}
                max={props.max}
                value={props.value}
            />
        </>
    )
}
