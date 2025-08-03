'use client'

import { useEffect, useState } from 'react'

function getWidth(): number {
    if (typeof window === 'undefined') return 0
    window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
}

export function useCurrentWidth(): number {
    let [width, setWidth] = useState(getWidth())

    useEffect(() => {
        // timeoutId for debounce mechanism
        let timeoutId: NodeJS.Timeout | null = null
        const resizeListener = () => {
            // prevent execution of previous setTimeout
            clearTimeout(timeoutId)
            // change width from the state object after 150 milliseconds
            timeoutId = setTimeout(() => setWidth(getWidth()), 150)
        }
        window.addEventListener('resize', resizeListener)

        return () => {
            window.removeEventListener('resize', resizeListener)
        }
    }, [])

    return width
}
