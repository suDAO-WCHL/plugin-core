import { useState } from 'react'

export function usePlugin() {
    const [count, setCount] = useState(0)
    return {
        count,
        setCount,
    }
}
