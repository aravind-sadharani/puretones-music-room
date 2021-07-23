import * as React from "react"
import ShowHideControls from "../components/showhidecontrols"
import Selector from "../components/selector"
import Editor from "../components/editor"
import SessionControls from "./sessioncontrols"
import generateDSP from "../utils/generatedsp"

const Sequencer = ({scaleState}) => {
    const initialState = {
        octave: 0,
        tone: 0,
        composition: ''
    }
    const [sequencerState, updateSequencerState] = React.useState({...initialState})
    let octaveList = {
        key: "Octave",
        default: sequencerState['octave'],
        options: [
            {
                value: 1,
                text: "High"
            },
            {
                value: 0,
                text: "Medium"
            },
            {
                value: -1,
                text: "Low"
            }
        ]
    }
    let toneList = {
        key: "Tone",
        default: sequencerState['tone'],
        options: [
            {
                value: 0,
                text: "String 1"
            },
            {
                value: 1,
                text: "String 2"
            },
            {
                value: 2,
                text: "Bow"
            },
            {
                value: 3,
                text: "Reed"
            }
        ]
    }
    const voiceLabel = {
        inactive: "Disable",
        active: "Enable"
    }
    const updateVoiceParameters = (value, path) => {
        let newSequencerState = sequencerState
        newSequencerState[`${path}`] = value
        updateSequencerState({...newSequencerState})   
    }
    const generate = () => generateDSP(sequencerState,scaleState)
    return (
        <>
            <p><strong>Sequencer Controls</strong></p>
            <SessionControls appname='sequencer' generate={generate} />
            <br />
            <p><strong>Sequencer Parameters</strong></p>
            <br />
            <ShowHideControls title="Voice 1" label={voiceLabel}>
                <br />
                <Selector params={octaveList} path='octave' onParamUpdate={updateVoiceParameters}></Selector>
                <Selector params={toneList} path='tone' onParamUpdate={updateVoiceParameters}></Selector>
                <Editor composition={`${sequencerState['composition']}`} onCompositionChange={(composition) => updateVoiceParameters(composition,'composition')} />
            </ShowHideControls>
        </>
    )
}

export default Sequencer