import * as React from "react"
import styled from "styled-components"
import Button from "../components/button"
import generateDSP from "../utils/generatedsp"
import { dspStateFromSettings } from "../utils/dspsettingsinterpreter"
import { AudioEnv } from "../services/audioenv"

const MotifPlayerContainer = styled.div`
    padding: 12px;
    margin: 0;
    text-align: center;
    border: 1px solid #e6e6eb;
    border-radius: 5px;
`

const MotifElement = styled.blockquote`
    font-size: 1.2em;
    font-family: monospace;
    margin: 0;
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
    const [title, updateTitle] = React.useState('Start')
    const [DSPCode, setDSPCode] = React.useState('')
    let {state,dispatch} = React.useContext(AudioEnv)
    const jobCompleted = (type) => {
        let newTitle = type === 'Error' ? 'Error! Retry' : 'Start'
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
        let newTitle = "Starting..."
        updateTitle(newTitle)
    }
    const stop = () => {
        if(state['sequencerPlaying'])
           dispatch({type: 'Stop', appname: 'sequencer'})
    }
    React.useEffect(()=>{
        if(title === 'Starting...')
            dispatch({type: 'Play', appname: 'sequencer', code: DSPCode, onJobComplete: jobCompleted})
    })
    return (
        <MotifPlayerContainer>
            <MotifElement>{motif}</MotifElement>
            <Button onClick={() => play()}>{title}</Button>
            <Button onClick={() => stop()}>Stop</Button>
        </MotifPlayerContainer>
    )
}

export default MotifPlayer
