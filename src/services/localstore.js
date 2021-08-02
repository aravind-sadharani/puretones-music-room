import {useState} from "react"

const isBrowser = typeof window !== "undefined"

const useLocalStore = (key,initialValue) => {
    const initialLocalValue = () => {
        if(!isBrowser)
            return initialValue
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch(error) {
            console.log(error)
            return initialValue
        }
    }

    const [localValue, setValue] = useState(initialLocalValue())

    const [throttle, setThrottle] = useState(false)

    const setLocalValue = (value) => {
        try {
            const evaluatedValue = value instanceof Function ? value(localValue) : value
            setValue(evaluatedValue)
            if(isBrowser && !throttle) {
                window.localStorage.setItem(key, JSON.stringify(evaluatedValue))
                setThrottle(true)
                window.setTimeout(()=>setThrottle(false),1000)
            }
        } catch(error) {
            console.log(error)
        }
    }

    return [localValue, setLocalValue]
}

export default useLocalStore