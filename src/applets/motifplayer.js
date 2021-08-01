import * as React from "react"
import styled from "styled-components"
import generateDSP from "utils/generatedsp"
import { dspStateFromSettings } from "utils/dspsettingsinterpreter"
import { AudioEnv } from "services/audioenv"
import { CommonPitchEnv } from 'services/commonpitch'
import ShowHideControls from "components/showhidecontrols"

const MotifPlayerContainer = styled.div`
    padding: 12px 12px 0 12px;
    margin: 0 0 1em 0;
    border: 1px solid #e6e6eb;
    border-radius: 5px;
    display: grid;
    grid-template-columns: 1fr 52px;
`

const MotifElement = styled.pre`
    margin: 0 0 1em 0;
    overflow-x: scroll;
`

const MotifPlayButton = styled.button`
    padding: 0 6px;
    outline-color: #333366;
    -webkit-appearance: none;
    background-color: #e6e6eb;
    border: 0;
    border-radius: 5px;
    margin: 0 0 auto auto;
    width: 40px;
    svg {
        fill: black;
    }
    &:hover {
        background-color: #333366;
        color: white;
        font-weight: 700;
        opacity: 0.8;
        svg {
            fill: white;
        }
    }
`

const MotifStopButton = styled.button`
    padding: 0 6px;
    outline-color: #333366;
    -webkit-appearance: none;
    border: 0;
    border-radius: 5px;
    margin: 0 0 auto auto;
    width: 40px;
    background-color: #333366;
    color: white;
    font-weight: 700;
    svg {
        fill: white;
    }
    &:hover {
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

const MotifPlayer = ({label,motif,scale}) => {
    const PlayTitle = () => (
        <svg height='1em' xmlns="http://www.w3.org/2000/svg" viewBox='0 0 10 10'>
            <polygon points="2,2 10,6 2,10" />
        </svg>
    )
    const StopTitle = () => (
        <svg height='1em' xmlns="http://www.w3.org/2000/svg" viewBox='0 0 10 10'>
            <polygon points="1,2 9,2 9,10 1,10" />
        </svg>
    )
    const [title, updateTitle] = React.useState(PlayTitle)
    const [DSPCode, setDSPCode] = React.useState('')
    const [DSPSettings, setDSPSettings] = React.useState({})
    const [motifVisibility, setMotifVisibility] = React.useState(false)
    const toggleMotifVisibility = () => setMotifVisibility(!motifVisibility)
    let {state,dispatch} = React.useContext(AudioEnv)
    const {commonPitch,setCommonPitch} = React.useContext(CommonPitchEnv)
    const jobCompleted = (type) => {
        let newTitle = type === 'Error' ? '𝗫' : PlayTitle
        updateTitle(newTitle)
    }
    const generate = () => {
        let scaleState = dspStateFromSettings('scale',scale)
        let sequencerState = defaultSequencerState
        sequencerState[0]['composition'] = motif
        let code = generateDSP(sequencerState,scaleState)
        setDSPCode(code)
        let sequencerSettings = {}
        sequencerSettings['/FaustDSP/Motif/Pitch'] = commonPitch['pitch']
        sequencerSettings['/FaustDSP/Motif/Fine_Tune'] = commonPitch['offSet']
        setDSPSettings({...sequencerSettings})
    }
    const play = () => {
        if(state['sequencerPlaying'])
            dispatch({type: 'Stop', appname: 'sequencer'})
        generate()
        let newTitle = "..."
        updateTitle(newTitle)
        let newPitch = commonPitch
        newPitch['currentMotif'] = label
        setCommonPitch({...newPitch})
        if(!state.audioContextReady)
            dispatch({type: 'Init'})
    }
    const stop = () => {
        if(state['sequencerPlaying'])
            dispatch({type: 'Stop', appname: 'sequencer'})
        let newPitch = commonPitch
        newPitch['currentMotif'] = 'sequencer'
        setCommonPitch({...newPitch})
    }
    React.useEffect(()=>{
        if(title === '...')
            dispatch({type: 'Play', appname: 'sequencer', settings: DSPSettings, code: DSPCode, onJobComplete: jobCompleted})
    })
    return (
        <MotifPlayerContainer>
            <ShowHideControls title={label} visibility={motifVisibility} onShowHide={toggleMotifVisibility}>
                <MotifElement>{motif}</MotifElement>
            </ShowHideControls>
            {(commonPitch['currentMotif'] !== label) && <MotifPlayButton onClick={() => play()}>{title}</MotifPlayButton>}
            {(commonPitch['currentMotif'] === label) && <MotifStopButton onClick={() => stop()}><StopTitle /></MotifStopButton>}
        </MotifPlayerContainer>
    )
}

export default MotifPlayer
