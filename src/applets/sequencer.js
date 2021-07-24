import * as React from "react"
import SessionControls from "./sessioncontrols"
import SequencerVoice from "./sequencervoice"
import generateDSP from "../utils/generatedsp"

const Sequencer = ({sequencerState,scaleState,onVoiceParamUpdate,reset,save,restore}) => {
    const generate = () => generateDSP(sequencerState,scaleState)
    return (
        <>
            <p><strong>Sequencer Controls</strong></p>
            <SessionControls appname='sequencer' reset={reset} generate={generate} save={save} restore={restore}/>
            <br />
            <p><strong>Sequencer Parameters</strong></p>
            <br />
            <SequencerVoice index='0' title='Voice 1' sequencerVoiceState={sequencerState[0]} onVoiceParamUpdate={onVoiceParamUpdate} />
            <SequencerVoice index='1' title='Voice 2' sequencerVoiceState={sequencerState[1]} onVoiceParamUpdate={onVoiceParamUpdate} />
            <SequencerVoice index='2' title='Voice 3' sequencerVoiceState={sequencerState[2]} onVoiceParamUpdate={onVoiceParamUpdate} />
        </>
    )
}

export default Sequencer