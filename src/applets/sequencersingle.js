import * as React from "react"
import Sequencer from "applets/sequencer"
import useLocalStore from "services/localstore"
import { dspStateFromSettings } from "utils/dspsettingsinterpreter"
import scalePKB from 'data/default.pkb'
import CommonPitch from "applets/commonpitch"
import { CommonSettingsEnv } from 'services/commonsettings'
import styled from "styled-components"

const SequencerSingleContainer = styled.div`
    padding: 12px 12px 0 12px;
    margin: 0 0 1em 0;
    border: 1px solid #e6e6eb;
    border-radius: 5px;
`

const SequencerSingle = () => {
    const {commonSettings} = React.useContext(CommonSettingsEnv)
    const scaleSettings = scalePKB.replace(/musicscale/g,'FaustDSP')
    let defaultScaleState = dspStateFromSettings('scale', scaleSettings)
    defaultScaleState['/FaustDSP/Common_Parameters/Pitch'] = commonSettings['pitch']
    defaultScaleState['/FaustDSP/Common_Parameters/Fine_Tune'] = commonSettings['offSet']
    const defaultSequencerState = [
        {
            voiceName: '_voice_1',
            enabled: true,
            octave: 0,
            tone: 0,
            editorExpanded: true,
            composition: 'Sa 2'
        },
        {
            voiceName: '_voice_2',
            enabled: false,
            octave: 0,
            tone: 0,
            editorExpanded: false,
            composition: ''
        },
        {
            voiceName: '_voice_3',
            enabled: false,
            octave: 0,
            tone: 0,
            editorExpanded: false,
            composition: ''
        }
    ]
    const [sequencerLocalState, setSequencerLocalState] = useLocalStore('sequencer', defaultSequencerState)
    const updateVoiceParameters = (index, value, path) => {
        let newSequencerState = sequencerLocalState
        newSequencerState[index][`${path}`] = value
        setSequencerLocalState(newSequencerState)   
    }
    const reset = () => {
        setSequencerLocalState(defaultSequencerState)
    }
    const saveSnapshot = () => {
        return JSON.stringify(sequencerLocalState)
    }
    const restoreSnapshot = (snapshot) => {
        setSequencerLocalState(JSON.parse(snapshot))
    }
    return (
        <>
            <CommonPitch />
            <SequencerSingleContainer>
                <Sequencer scaleState={defaultScaleState} sequencerState={sequencerLocalState} onVoiceParamUpdate={updateVoiceParameters} reset={reset} save={saveSnapshot} restore={restoreSnapshot}/>
            </SequencerSingleContainer>
        </>
    )
}

export default SequencerSingle