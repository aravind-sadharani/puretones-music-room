import * as React from "react"
import styled from "styled-components"
import { AudioEnv } from "services/audioenv"
import { CommonSettingsEnv } from 'services/commonsettings'
import { dspStateFromSettings } from "utils/dspsettingsinterpreter"
import droneDSPCode from 'data/puretones.dsp'

const DronePlayerContainer = styled.div`
    padding: 12px;
    margin: 0 0 1em 0;
    display: grid;
    grid-template-columns: 1fr 120px;
    border: 1px solid #e6e6eb;
    border-radius: 5px;
`

const DroneTitleElement = styled.blockquote`
    font-size: 1em;
    margin: 0;
`

const DroneButtonElement = styled.button`
    padding: 0 6px;
    border-color: #e6e6eb;
    outline-color: #333366;
    -webkit-appearance: none;
    background-color: #e6e6eb;
    border: 0;
    border-radius: 5px;
    margin: auto 0 0 auto;
    width: 120px;
    &:hover {
        background-color: #333366;
        color: white;
        font-weight: 700;
        opacity: 0.8;
    }
    &.active {
        background-color: #333366;
        color: white;
        font-weight: 700;
    }
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
    React.useEffect(() => {
        dispatch({type: 'Stop', appname: 'drone'})
        dispatch({type: 'Stop', appname: 'scale'})
        dispatch({type: 'Stop', appname: 'sequencer'})
    },[dispatch])
    let buttonState = (active && (commonSettings['currentDrone'] === title)) ? "active" : ""
    let buttonText = (commonSettings['currentDrone'] === title) ? buttonTitle : 'Start'
    return (
        <DronePlayerContainer>
            <DroneTitleElement>{title}</DroneTitleElement>
            <DroneButtonElement className={buttonState} onClick={() => playStop()}>{buttonText}</DroneButtonElement>
        </DronePlayerContainer>
    )
}

export default DronePlayer