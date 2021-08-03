import * as React from 'react'
import useLocalStore from "services/localstore"

const initialCommonSettings = {
    pitch: "3",
    offSet: "0",
    currentMotif: 'MusicRoom Sequencer',
    currentScale: 'MusicRoom Scale'
}

const CommonSettingsEnv = React.createContext(initialCommonSettings)

const CommonSettingsEnvProvider = ({children}) => {
    const [localCommonSettings,setLocalCommonSettings] = useLocalStore('commonsettings',initialCommonSettings)
    const [commonSettings,updateCommonSettings] = React.useState(localCommonSettings)
    const setCommonSettings = (newSettings) => {
        let localSettings = {...newSettings}
        localSettings['currentMotif'] = 'MusicRoom Sequencer'
        localSettings['currentScale'] = 'MusicRoom Scale'
        setLocalCommonSettings(localSettings)
        updateCommonSettings(newSettings)
    }
    return (
        <CommonSettingsEnv.Provider value={{commonSettings,setCommonSettings}}>
            {children}
        </CommonSettingsEnv.Provider>
    )
}

export {CommonSettingsEnv, CommonSettingsEnvProvider}