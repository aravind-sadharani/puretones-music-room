import * as React from "react"
import Drone from "applets/drone"
import { AudioEnv } from "services/audioenv"
import useLocalStore from "services/localstore"
import { dspSettingsFromState, dspStateFromSettings } from "utils/dspsettingsinterpreter"
import droneDSPCode from 'data/puretones.dsp'
import dronePRT from 'data/default.prt'
import CommonPitch from "applets/commonpitch"
import { CommonSettingsEnv } from 'services/commonsettings'
import styled from "styled-components"

const DroneSingleContainer = styled.div`
    padding: 12px 12px 0 12px;
    margin: 0 0 1em 0;
    border: 1px solid #e6e6eb;
    border-radius: 5px;
`

const DroneSingle = () => {
    const {commonSettings} = React.useContext(CommonSettingsEnv)
    const droneSettings = dronePRT.replace(/puretones/g,'FaustDSP')
    let defaultDroneState = dspStateFromSettings('drone', droneSettings)
    defaultDroneState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency'] = commonSettings['pitch']
    defaultDroneState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune'] = commonSettings['offSet']
    const {dispatch} = React.useContext(AudioEnv)
    const [droneLocalState, setDroneLocalState] = useLocalStore('drone', defaultDroneState)
    droneLocalState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency'] = commonSettings['pitch']
    droneLocalState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune'] = commonSettings['offSet']
    const updateParameter = (value, path) => {
        let updateParams = {}
        updateParams[`${path}`] = value
        dispatch({type: 'Configure', appname: 'drone', settings: updateParams})
        setDroneLocalState(updateParams)
    }
    const reset = () => {
        dispatch({type: 'Configure', appname: 'drone', settings: defaultDroneState})
        setDroneLocalState(defaultDroneState)
    }
    const saveSnapshot = () => {
        return dspSettingsFromState('drone',droneLocalState)
    }
    const restoreSnapshot = (snapshot) => {
        let newDroneState = {}
        newDroneState = dspStateFromSettings('drone',snapshot)
        newDroneState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency'] = commonSettings['pitch']
        newDroneState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune'] = commonSettings['offSet']
        dispatch({type: 'Configure', appname: 'drone', settings: newDroneState})
        setDroneLocalState(newDroneState)
    }
    return (
        <>
            <CommonPitch />
            <DroneSingleContainer>
                <Drone droneDSPCode={droneDSPCode} droneState={droneLocalState} onParamUpdate={updateParameter} reset={reset} save={saveSnapshot} restore={restoreSnapshot}/>
            </DroneSingleContainer>
        </>
    )
}

export default DroneSingle