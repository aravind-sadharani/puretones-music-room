import * as React from "react"
import styled from "styled-components"
import generateDSP from "utils/generatedsp"
import { dspStateFromSettings } from "utils/dspsettingsinterpreter"
import { AudioEnv } from "services/audioenv"

const MotifPlayerContainer = styled.div`
    padding: 12px;
    margin: 0 0 1em 0;
    border: 1px solid #e6e6eb;
    border-radius: 5px;
    display: grid;
    grid-template-columns: 1fr 52px 52px;
`

const MotifElement = styled.pre`
    margin: 0;
    border: 1px solid #e6e6eb;
    border-radius: 5px;
    padding: 0 12px;
    overflow-x: scroll;
`

const MotifButtonElement = styled.button`
    padding: 0 6px;
    border-color: #e6e6eb;
    outline-color: #333366;
    -webkit-appearance: none;
    background-color: #e6e6eb;
    border: 0;
    border-radius: 5px;
    margin: auto 0 0 auto;
    width: 40px;
    &:hover {
        background-color: #333366;
        color: white;
        font-weight: 700;
        opacity: 0.8;
    }
`

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

const MotifPlayer = ({motif,scale,drone}) => {
    const [title, updateTitle] = React.useState('▶')
    const [DSPCode, setDSPCode] = React.useState('')
    let {state,dispatch} = React.useContext(AudioEnv)
    const jobCompleted = (type) => {
        let newTitle = type === 'Error' ? '𝗫' : '▶'
        updateTitle(newTitle)
    }
    const generate = () => {
        let scaleState = dspStateFromSettings('scale',scale)
        let droneState = dspStateFromSettings('drone',drone)
        scaleState['/FaustDSP/Common_Parameters/Pitch'] = droneState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency']
        scaleState['/FaustDSP/Common_Parameters/Fine_Tune'] = droneState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune']
        let sequencerState = defaultSequencerState
        sequencerState[0]['composition'] = motif
        let code = generateDSP(sequencerState,scaleState)
        setDSPCode(code)
    }
    const play = () => {
        if(state['sequencerPlaying'])
            dispatch({type: 'Stop', appname: 'sequencer'})
        generate()
        let newTitle = "..."
        updateTitle(newTitle)
    }
    const stop = () => {
        if(state['sequencerPlaying'])
           dispatch({type: 'Stop', appname: 'sequencer'})
    }
    React.useEffect(()=>{
        if(title === '...')
            dispatch({type: 'Play', appname: 'sequencer', code: DSPCode, onJobComplete: jobCompleted})
    })
    return (
        <MotifPlayerContainer>
            <MotifElement>{motif}</MotifElement>
            <MotifButtonElement onClick={() => play()}><small>{title}</small></MotifButtonElement>
            <MotifButtonElement onClick={() => stop()}>&#x25FC;</MotifButtonElement>
        </MotifPlayerContainer>
    )
}

export default MotifPlayer
