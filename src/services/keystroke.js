import * as React from "react"

const ListenToKeyStrokes = ({handleKeyStroke}) => {
    React.useEffect(() => {
        window.addEventListener("keydown", handleKeyStroke)
        window.addEventListener("keyup", handleKeyStroke)
        return () => {
            window.removeEventListener("keydown", handleKeyStroke)
            window.removeEventListener("keyup", handleKeyStroke)
        }
    }, [handleKeyStroke])

    return <></>
}

export default ListenToKeyStrokes