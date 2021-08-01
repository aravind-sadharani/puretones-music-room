import * as React from 'react'

const initialCommonSettings = {
    pitch: "3",
    offSet: "0",
    currentMotif: 'MusicRoom Sequencer'
}

const CommonSettingsEnv = React.createContext(initialCommonSettings)

const CommonSettingsEnvProvider = ({children}) => {
    const [commonSettings, setCommonSettings] = React.useState(initialCommonSettings)
    return (
        <CommonSettingsEnv.Provider value={{commonSettings,setCommonSettings}}>
            {children}
        </CommonSettingsEnv.Provider>
    )
}

export {CommonSettingsEnv, CommonSettingsEnvProvider}