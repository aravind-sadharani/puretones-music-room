import * as React from 'react'

const initialCommonPitch = {
    pitch: "3",
    offSet: "0"
}

const CommonPitchEnv = React.createContext(initialCommonPitch)

const CommonPitchEnvProvider = ({children}) => {
    const [commonPitch, setCommonPitch] = React.useState(initialCommonPitch)
    return (
        <CommonPitchEnv.Provider value={{commonPitch,setCommonPitch}}>
            {children}
        </CommonPitchEnv.Provider>
    )
}

export {CommonPitchEnv, CommonPitchEnvProvider}