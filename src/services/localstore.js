import {useReducer} from "react"

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

    const [localValue, setLocalValue] = useReducer((localValue,value) => {
        try {
            const evaluatedValue = value instanceof Function ? value(localValue) : value
            let newValue = {...localValue, ...evaluatedValue}
            if(isBrowser) {
                window.localStorage.setItem(key, JSON.stringify(newValue))
            }
            return newValue
        } catch(error) {
            console.log(error)
            return localValue
        }
    },initialLocalValue())

    return [localValue, setLocalValue]
}

export default useLocalStore