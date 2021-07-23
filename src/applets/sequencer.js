import * as React from "react"
import SessionControls from "./sessioncontrols"
import SequencerVoice from "./sequencervoice"
import generateDSP from "../utils/generatedsp"

const Sequencer = ({scaleState}) => {
    const initialState = [
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
    const [sequencerState, updateSequencerState] = React.useState({...initialState})
    const updateVoiceParameters = (index, value, path) => {
        let newSequencerState = sequencerState
        newSequencerState[index][`${path}`] = value
        updateSequencerState({...newSequencerState})   
    }
    const reset = () => {
        updateSequencerState({...initialState})
    }
    const generate = () => generateDSP(sequencerState,scaleState)
    return (
        <>
            <p><strong>Sequencer Controls</strong></p>
            <SessionControls appname='sequencer' reset={reset} generate={generate} />
            <br />
            <p><strong>Sequencer Parameters</strong></p>
            <br />
            <SequencerVoice index='0' title='Voice 1' sequencerVoiceState={sequencerState[0]} onVoiceParamUpdate={updateVoiceParameters} />
            <SequencerVoice index='1' title='Voice 2' sequencerVoiceState={sequencerState[1]} onVoiceParamUpdate={updateVoiceParameters} />
            <SequencerVoice index='2' title='Voice 3' sequencerVoiceState={sequencerState[2]} onVoiceParamUpdate={updateVoiceParameters} />
        </>
    )
}

export default Sequencer