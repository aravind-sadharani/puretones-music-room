import * as React from "react"
import ShowHideControls from "../components/showhidecontrols"
import Selector from "../components/selector"
import Editor from "../components/editor"

const SequencerVoice = ({index,title,sequencerVoiceState,onVoiceParamUpdate}) => {
    let octaveList = {
        key: "Octave",
        default: sequencerVoiceState['octave'],
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
        default: sequencerVoiceState['tone'],
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
    return (
        <ShowHideControls title={title} label={voiceLabel} visibility={sequencerVoiceState['enabled']} onShowHide={() => onVoiceParamUpdate(Number(index),!sequencerVoiceState['enabled'],'enabled')}>
            <br />
            <Selector params={octaveList} path='octave' onParamUpdate={(value,path) => onVoiceParamUpdate(Number(index),value,path)}></Selector>
            <Selector params={toneList} path='tone' onParamUpdate={(value,path) => onVoiceParamUpdate(Number(index),value,path)}></Selector>
            <Editor expanded={sequencerVoiceState['editorExpanded']} onExpand={() => onVoiceParamUpdate(Number(index),!sequencerVoiceState['editorExpanded'],'editorExpanded')} composition={`${sequencerVoiceState['composition']}`} onCompositionChange={(composition) => onVoiceParamUpdate(Number(index),composition,'composition')} />
        </ShowHideControls>
    )
}

export default SequencerVoice