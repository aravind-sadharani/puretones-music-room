import * as React from "react"
import Selector from "components/selector"
import Editor from "components/editor"
import Toggle from 'components/toggle'
import Slider from 'components/slider'

const SequencerVoice = ({index,sequencerVoiceState,onVoiceParamUpdate}) => {
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
            },
            {
                value: 4,
                text: "Synth"
            },
            {
                value: 5,
                text: "Brass"
            },
            {
                value: 6,
                text: "Flute"
            },
            {
                value: 7,
                text: "Marimba"
            }
        ]
    }
    const gainParams = {
        key: "Level",
        init: sequencerVoiceState['gain'] || -9,
        max: 0,
        min: -40,
        step: 0.1
    }
    const panParams = {
        key: "Pan",
        init: sequencerVoiceState['pan'] || 50,
        max: 100,
        min: 0,
        step: 1
    }
    return (
        <>
            <Toggle title='Enable' status={sequencerVoiceState['enabled']} onParamUpdate={()=>onVoiceParamUpdate(Number(index),!sequencerVoiceState['enabled'],'enabled')} />
            <Selector params={octaveList} path='octave' onParamUpdate={(value,path) => onVoiceParamUpdate(Number(index),value,path)}></Selector>
            <Selector params={toneList} path='tone' onParamUpdate={(value,path) => onVoiceParamUpdate(Number(index),value,path)}></Selector>
            <Slider params={gainParams} path='gain' onParamUpdate={(value,path) => onVoiceParamUpdate(Number(index),value,path)}></Slider>
            <Slider params={panParams} path='pan' onParamUpdate={(value,path) => onVoiceParamUpdate(Number(index),value,path)}></Slider>
            <Editor expanded={sequencerVoiceState['editorExpanded']} onExpand={() => onVoiceParamUpdate(Number(index),!sequencerVoiceState['editorExpanded'],'editorExpanded')} composition={`${sequencerVoiceState['composition']}`} onCompositionChange={(composition) => onVoiceParamUpdate(Number(index),composition,'composition')} />
        </>
    )
}

export default SequencerVoice