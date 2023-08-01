import React, { ReactNode } from 'react'
import classes from './button.module.css'

type Props = {
    className?: string
    onClick?: () => void
    children?: ReactNode
}

export default function Button(props: Props) {
    return (
        <button
            className={`${classes.btn} ${props.className || ''}`}
            onClick={props.onClick}
        >
            <span>{props.children}</span>
        </button>
    )
}
