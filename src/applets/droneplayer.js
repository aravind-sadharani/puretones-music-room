import * as React from "react"
import styled from "styled-components"
import { AudioEnv } from "services/audioenv"
import { CommonSettingsEnv } from 'services/commonsettings'
import { dspStateFromSettings } from "utils/dspsettingsinterpreter"
import droneDSPCode from 'data/puretones.dsp'
import NowPlaying from "components/nowplaying"
import useIsInViewport from "services/viewport"
import Button from "components/button"

const DronePlayerContainer = styled.div`
    padding: 12px;
    margin: 0 0 1em 0;
    display: grid;
    grid-template-columns: 1fr 120px;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
`

const DroneTitleElement = styled.blockquote`
    font-size: 1em;
    margin: 0;
`

const DronePlayer = ({title,settings}) => {
    const [buttonTitle, updateButtonTitle] = React.useState('Start')
    const [active, setActive] = React.useState(false)
    const {state,dispatch} = React.useContext(AudioEnv)
    const {commonSettings,setCommonSettings} = React.useContext(CommonSettingsEnv)
    const [droneState,setDroneState] = React.useState({})
    const jobCompleted = (type) => {
        let newButtonTitle = type === 'Error' ? 'Error! Retry' : type === 'Stop' ? 'Start' : 'Stop'
        let newState = type !== 'Stop'
        updateButtonTitle(newButtonTitle)
        setActive(newState)
        let newSettings = commonSettings
        newSettings['currentDrone'] = type === 'Error' ? 'MusicRoom Drone' : type === 'Stop' ? 'MusicRoom Drone': title
        setCommonSettings(newSettings)
    }
    const playStop = () => {
        if(buttonTitle === 'Starting...' || buttonTitle === 'Stopping...')
            return
        let newState = buttonTitle === 'Start' || (commonSettings['currentDrone'] !== title)
        let newButtonTitle = newState ? "Starting..." : "Stopping..."
        updateButtonTitle(newButtonTitle)
        setActive(newState)
        let newDroneState = dspStateFromSettings('drone',settings)
        newDroneState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency'] = commonSettings['pitch']
        newDroneState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune'] = commonSettings['offSet']
        setDroneState(newDroneState)
        let newSettings = commonSettings
        newSettings['currentDrone'] = 'Busy'
        setCommonSettings(newSettings)
        if(newState && state['dronePlaying']) {
            dispatch({type: 'Configure', appname: 'drone', settings: newDroneState})
            jobCompleted('Play')
        }
        if(!state.audioContextReady)
            dispatch({type: 'Init'})
    }
    React.useEffect(() => {
        if(buttonTitle === 'Starting...' || buttonTitle === 'Stopping...')
            dispatch({type: `${buttonTitle === 'Starting...' ? 'Play' : 'Stop'}`, appname: 'drone', code: droneDSPCode, settings: droneState, onJobComplete: jobCompleted})
    })
    let buttonState = (active && (commonSettings['currentDrone'] === title)) ? "active" : ""
    let buttonText = (commonSettings['currentDrone'] === title) ? buttonTitle : 'Start'

    const dronePlayerRef = React.useRef(null)
    const inView = useIsInViewport(dronePlayerRef)

    return (
        <DronePlayerContainer ref={dronePlayerRef}>
            <DroneTitleElement>{title}</DroneTitleElement>
            <Button player active={buttonState} onClick={() => playStop()}>{buttonText}</Button>
            {buttonState === 'active' && !inView &&
            <NowPlaying align='left' title={title} active={(active && (commonSettings['currentDrone'] === title))} onClick={playStop} buttonText={buttonText}></NowPlaying>}
        </DronePlayerContainer>
    )
}

export default DronePlayer