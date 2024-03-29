import * as React from 'react'

const isBrowser = typeof window !== "undefined"

const useIsInViewport = (ref) => {
    const [isInView, setInView] = React.useState(false)

    const observer = React.useMemo(
        () => {
            if(!isBrowser)
                return null
            return new IntersectionObserver(([element]) => {
                    setInView(element.isIntersecting)
                },{threshold: 0.5})
        },
    [],)

    React.useEffect(() => {
        observer.observe(ref.current)

        return () => observer.disconnect()
    },[ref, observer])

    return isInView
}

export default useIsInViewport