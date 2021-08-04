import * as React from 'react'
import useLocalStore from "services/localstore"

const initialCachedSettings = {
    pitch: "3",
    offSet: "0"
}

const initialVolatileSettings = {
    currentMotif: 'MusicRoom Sequencer',
    currentScale: 'MusicRoom Scale'
}

const CommonSettingsEnv = React.createContext({...initialCachedSettings, ...initialVolatileSettings})

const CommonSettingsEnvProvider = ({children}) => {
    const [cachedSettings,setCachedSettings] = useLocalStore('commonsettings',initialCachedSettings)
    const [volatileSettings,setVolatileSettings] = React.useState(initialVolatileSettings)
    const setCommonSettings = (newSettings) => {
        let newCachedSettings = {}
        newCachedSettings['pitch'] = newSettings['pitch']
        newCachedSettings['offSet'] = newSettings['offSet']
        let newVolatileSettings = {}
        newVolatileSettings['currentMotif'] = newSettings['currentMotif']
        newVolatileSettings['currentScale'] = newSettings['currentScale']
        setCachedSettings(newCachedSettings)
        setVolatileSettings(newVolatileSettings)
    }
    let commonSettings = {...cachedSettings, ...volatileSettings}
    return (
        <CommonSettingsEnv.Provider value={{commonSettings,setCommonSettings}}>
            {children}
        </CommonSettingsEnv.Provider>
    )
}

export {CommonSettingsEnv, CommonSettingsEnvProvider}