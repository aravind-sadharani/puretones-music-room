import * as React from "react"

const AnalyzeLocal = ({handleLocalStorageChanges}) => {
    React.useEffect(() => {
        window.addEventListener("storage", handleLocalStorageChanges)
        return () => {
            window.removeEventListener("storage", handleLocalStorageChanges)
        }
    }, [handleLocalStorageChanges])

    return <></>
}

export default AnalyzeLocal