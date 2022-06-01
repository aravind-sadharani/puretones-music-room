import * as React from "react"
import styled from "styled-components"
import generateDSP from "utils/generatedsp"
import { dspStateFromSettings } from "utils/dspsettingsinterpreter"
import { AudioEnv } from "services/audioenv"
import { CommonSettingsEnv } from 'services/commonsettings'
import ShowHideControls from "components/showhidecontrols"
import sequencerPSQ from 'data/default.psq'

const MotifPlayerContainer = styled.div`
    padding: 12px 12px 0 12px;
    margin: 0 0 1em 0;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
    pre, code {
        padding: 0;
        background-color: ${({theme}) => theme.light.bodyBackground};
        ${({theme}) => theme.isDark`background-color: ${theme.dark.bodyBackground};`}    
    }
`

const MotifElement = styled.pre`
    margin: 0 0 1em 0;
    overflow-x: scroll;
`

const defaultSequencerState = JSON.parse(sequencerPSQ)

const MotifPlayer = ({title,motif,scale,staticCode}) => {
    const [playState, updatePlayState] = React.useState('stopped')
    const [DSPCode, setDSPCode] = React.useState('')
    const [DSPSettings, setDSPSettings] = React.useState({})
    const [motifVisibility, setMotifVisibility] = React.useState(false)
    const toggleMotifVisibility = () => {
        if(motifVisibility && (commonSettings['currentMotif'] === title)) {
            setMotifVisibility(false)
            stop()
        } else {
            setMotifVisibility(true)
            play()
        }
    }
    let {state,dispatch} = React.useContext(AudioEnv)
    const {commonSettings,setCommonSettings} = React.useContext(CommonSettingsEnv)
    const jobCompleted = (type) => {
        let newPlayState = type === 'Error' ? 'error' : 'stopped'
        updatePlayState(newPlayState)
        let newSettings = commonSettings
        newSettings['currentMotif'] = type === 'Error' ? 'MusicRoom Sequencer' : title
        setCommonSettings(newSettings)
    }
    const generate = () => {
        let sequencerState = defaultSequencerState
        sequencerState[0]['composition'] = motif
        let code = staticCode || generateDSP(sequencerState,dspStateFromSettings('scale',scale))
        setDSPCode(code)
        let sequencerSettings = {}
        sequencerSettings['/FaustDSP/Motif/Pitch'] = commonSettings['pitch']
        sequencerSettings['/FaustDSP/Motif/Fine_Tune'] = commonSettings['offSet']
        setDSPSettings(sequencerSettings)
    }
    const play = () => {
        if(commonSettings['currentMotif'] === 'Busy')
            return
        if(state['sequencerPlaying'])
            dispatch({type: 'Stop', appname: 'sequencer'})
        generate()
        let newPlayState = "starting..."
        updatePlayState(newPlayState)
        let newSettings = commonSettings
        newSettings['currentMotif'] = 'Busy'
        setCommonSettings(newSettings)
        if(!state.audioContextReady)
            dispatch({type: 'Init'})
    }
    const stop = () => {
        if(commonSettings['currentMotif'] === 'Busy')
            return
        if(state['sequencerPlaying'])
            dispatch({type: 'Stop', appname: 'sequencer'})
        let newSettings = commonSettings
        newSettings['currentMotif'] = 'MusicRoom Sequencer'
        setCommonSettings(newSettings)
    }
    React.useEffect(()=>{
        if(playState === 'starting...')
            dispatch({type: 'Play', appname: 'sequencer', settings: DSPSettings, code: DSPCode, onJobComplete: jobCompleted})
    })
    let showHideLabel = {
        active: playState === 'starting...' ? 'Starting...' : 'Start',
        inactive: 'Stop'
    }
    return (
        <MotifPlayerContainer>
            <ShowHideControls title={title} label={showHideLabel} visibility={motifVisibility && (commonSettings['currentMotif'] === title)} onShowHide={toggleMotifVisibility}>
                { (!staticCode && <MotifElement><code>{motif}</code></MotifElement>) || (<p>{motif}</p>) }
            </ShowHideControls>
        </MotifPlayerContainer>
    )
}

export default MotifPlayer