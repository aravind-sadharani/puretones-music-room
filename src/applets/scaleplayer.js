import * as React from "react"
import styled from "styled-components"
import Keyboard from 'applets/keyboard'
import ShowHideControls from 'components/showhidecontrols'
import { dspStateFromSettings } from "utils/dspsettingsinterpreter"
import { AudioEnv } from "services/audioenv"
import { CommonSettingsEnv } from 'services/commonsettings'
import scaleDSPCode from 'data/musicscale.dsp'

const isBrowser = typeof window !== "undefined"

const ScalePlayerContainer = styled.div`
    padding: 12px 12px 0 12px;
    margin: 0 0 1em 0;
    border: 1px solid #e6e6eb;
    border-radius: 5px;
`

const ScalePlayer = ({title,noteSpec,scale}) => {
    const note2Offset = {'Sa': 0, 're': 1, 'Re': 2, 'ga': 3, 'Ga': 4, 'ma': 5, 'Ma': 6, 'Pa': 7, 'dha': 8, 'Dha': 9, 'ni': 10, 'Ni': 11, 'SA': 12}
    const key2Midi = (keyName) => (Number(commonSettings['pitch']) - 3 + note2Offset[`${keyName}`] + 48)
    const [keyState,setKeyState] = React.useState(Array(13).fill(0))
    const keyOn = (keyName) => {
        if(keyState[note2Offset[`${keyName}`]] === 0) {
            let newKeyState = keyState
            newKeyState[note2Offset[`${keyName}`]] = 1
            setKeyState([...newKeyState])
            let msg = [144,`${key2Midi(keyName)}`,50]
            dispatch({type: 'MIDI', appname: 'scale', message: msg})
        }
    }
    const keyOff = (keyName) => {
        if(isBrowser) {
            window.setTimeout(() => {
                let newKeyState = keyState
                newKeyState[note2Offset[`${keyName}`]] = 0
                setKeyState([...newKeyState])
            },100)
            window.setTimeout(() => {
                let msg = [144,`${key2Midi(keyName)}`,0]
                dispatch({type: 'MIDI', appname: 'scale', message: msg})
            },6000)
        } else {
            let newKeyState = keyState
            newKeyState[note2Offset[`${keyName}`]] = 0
            setKeyState([...newKeyState])
            let msg = [144,`${key2Midi(keyName)}`,0]
            dispatch({type: 'MIDI', appname: 'scale', message: msg})
        }
    }
    const [playState, updatePlayState] = React.useState('stopped')
    const [DSPSettings, setDSPSettings] = React.useState({})
    const [visibility,setVisibility] = React.useState(false)
    const toggleScaleVisibility = () => {
        if(visibility && (commonSettings['currentScale'] === title)) {
            setVisibility(false)
            stop()
        } else {
            setVisibility(true)
            play()
        }
    }
    let {state,dispatch} = React.useContext(AudioEnv)
    const {commonSettings,setCommonSettings} = React.useContext(CommonSettingsEnv)
    const jobCompleted = (type) => {
        let newPlayState = type === 'Error' ? 'error' : 'stopped'
        updatePlayState(newPlayState)
        let newSettings = commonSettings
        newSettings['currentScale'] = type === 'Error' ? 'MusicRoom Scale' : title
        setCommonSettings(newSettings)
    }
    const play = () => {
        if(commonSettings['currentScale'] === 'Busy')
            return
        if(state['scalePlaying'])
            dispatch({type: 'Stop', appname: 'scale'})
        let scaleState = dspStateFromSettings('scale',scale)
        scaleState['/FaustDSP/Common_Parameters/Pitch'] = commonSettings['pitch']
        scaleState['/FaustDSP/Common_Parameters/Fine_Tune'] = commonSettings['offSet']
        setDSPSettings({...scaleState})
        let newPlayState = "starting..."
        updatePlayState(newPlayState)
        let newSettings = commonSettings
        newSettings['currentScale'] = 'Busy'
        setCommonSettings(newSettings)
        if(!state.audioContextReady)
            dispatch({type: 'Init'})
    }
    const stop = () => {
        if(commonSettings['currentScale'] === 'Busy')
            return
        if(state['scalePlaying'])
            dispatch({type: 'Stop', appname: 'scale'})
        let newSettings = commonSettings
        newSettings['currentScale'] = 'MusicRoom Scale'
        setCommonSettings(newSettings)
    }
    React.useEffect(()=>{
        if(playState === 'starting...')
            dispatch({type: 'Play', appname: 'scale', settings: DSPSettings, code: scaleDSPCode, onJobComplete: jobCompleted})
    })
    let showHideLabel = {
        active: playState === 'starting...' ? 'Starting...' : 'Start',
        inactive: 'Stop'
    }
    return (
        <ScalePlayerContainer>
            <ShowHideControls title={title} label={showHideLabel} visibility={visibility && (commonSettings['currentScale'] === title)} onShowHide={toggleScaleVisibility}>
                <Keyboard keyOn={keyOn} keyOff={keyOff} noteSpec={noteSpec} />
            </ShowHideControls>
        </ScalePlayerContainer>
    )
}

export default ScalePlayer