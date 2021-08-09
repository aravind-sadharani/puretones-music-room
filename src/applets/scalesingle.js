import * as React from "react"
import Scale from "applets/scale"
import { AudioEnv } from "services/audioenv"
import useLocalStore from "services/localstore"
import { dspSettingsFromState, dspStateFromSettings } from "utils/dspsettingsinterpreter"
import scaleDSPCode from 'data/musicscale.dsp'
import scalePKB from 'data/default.pkb'
import CommonPitch from "applets/commonpitch"
import { CommonSettingsEnv } from 'services/commonsettings'
import styled from "styled-components"

const ScaleSingleContainer = styled.div`
    padding: 12px 12px 0 12px;
    margin: 0 0 1em 0;
    border: 1px solid #e6e6eb;
    border-radius: 5px;
`

const ScaleSingle = () => {
    const {commonSettings} = React.useContext(CommonSettingsEnv)
    const scaleSettings = scalePKB.replace(/musicscale/g,'FaustDSP')
    let defaultScaleState = dspStateFromSettings('scale', scaleSettings)
    defaultScaleState['/FaustDSP/Common_Parameters/Pitch'] = commonSettings['pitch']
    defaultScaleState['/FaustDSP/Common_Parameters/Fine_Tune'] = commonSettings['offSet']
    const {dispatch} = React.useContext(AudioEnv)
    const [scaleLocalState, setScaleLocalState] = useLocalStore('scale', defaultScaleState)
    scaleLocalState['/FaustDSP/Common_Parameters/Pitch'] = commonSettings['pitch']
    scaleLocalState['/FaustDSP/Common_Parameters/Fine_Tune'] = commonSettings['offSet']
    const updateParameter = (value, path) => {
        let updateParams = {}
        updateParams[`${path}`] = value
        dispatch({type: 'Configure', appname: 'scale', settings: updateParams})
        setScaleLocalState(updateParams)
    }
    const sendMIDIMessage = (msg) => {
        dispatch({type: 'MIDI', appname: 'scale', message: msg})
    }
    const reset = () => {
        dispatch({type: 'Configure', appname: 'scale', settings: defaultScaleState})
        setScaleLocalState(defaultScaleState)
    }
    const saveSnapshot = () => {
        return dspSettingsFromState('scale',scaleLocalState)
    }
    const restoreSnapshot = (snapshot) => {
        let newScaleState = {}
        newScaleState = dspStateFromSettings('scale',snapshot)
        newScaleState['/FaustDSP/Common_Parameters/Pitch'] = commonSettings['pitch']
        newScaleState['/FaustDSP/Common_Parameters/Fine_Tune'] = commonSettings['offSet']
        dispatch({type: 'Configure', appname: 'scale', settings: newScaleState})
        setScaleLocalState(newScaleState)
    }
    return (
        <>
            <CommonPitch />
            <ScaleSingleContainer>
                <Scale scaleDSPCode={scaleDSPCode} scaleState={scaleLocalState} onParamUpdate={updateParameter} onMIDIMessage={sendMIDIMessage} reset={reset} save={saveSnapshot} restore={restoreSnapshot}/>
            </ScaleSingleContainer>
        </>
    )
}

export default ScaleSingle