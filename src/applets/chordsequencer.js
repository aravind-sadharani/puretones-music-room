import * as React from 'react'
import styled from 'styled-components'
import Slider from 'components/slider'
import Selector from 'components/selector'
import Editor from 'components/editor'

const ChordSequencerContainer = styled.div`
    padding: 12px 12px 0 12px;
    margin: 0 0 1em 0;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
`

const ChordSequencer = () => {
    const [tempo,setTempo] = React.useState(120)
    const [sequencerVoiceState,setSequencerVoiceState] = React.useState({
        'tone': 1,
        'gain': -9,
        'pan': 50,
        'editorExpanded': true,
        'composition': 'Sa(C)(ga,Pa)'
    })
    const toneList = {
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
    const tempoParams = {
        key: "Tempo (BPM)",
        init: Number(tempo),
        max: 240,
        min: 60,
        step: 1
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
        <ChordSequencerContainer>
            <strong><p>Chord Sequencer</p></strong>
            <Selector params={toneList} path='tone' onParamUpdate={(value,path) => setSequencerVoiceState({...sequencerVoiceState,'tone': value})}></Selector>
            <Slider params={tempoParams} path='/FaustDSP/Motif/Motif_Tempo' onParamUpdate={(value,path)=>setTempo(value)}></Slider>
            <Slider params={gainParams} path='gain' onParamUpdate={(value,path) => setSequencerVoiceState({...sequencerVoiceState,'gain': value})}></Slider>
            <Slider params={panParams} path='pan' onParamUpdate={(value,path) => setSequencerVoiceState({...sequencerVoiceState,'pan': value})}></Slider>
            <Editor expanded={sequencerVoiceState['editorExpanded']} onExpand={() => setSequencerVoiceState({...sequencerVoiceState, 'editorExpanded': !sequencerVoiceState['editorExpanded']})} composition={`${sequencerVoiceState['composition']}`} onCompositionChange={(composition) => setSequencerVoiceState({...sequencerVoiceState,'composition': composition})} />
        </ChordSequencerContainer>
    )
}

export default ChordSequencer