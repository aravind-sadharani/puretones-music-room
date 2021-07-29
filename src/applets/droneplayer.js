import * as React from "react"
import styled from "styled-components"
import { AudioEnv } from "services/audioenv"
import { dspStateFromSettings } from "utils/dspsettingsinterpreter"
import droneDSPCode from 'data/puretones.dsp'

const DronePlayerContainer = styled.div`
    padding: 12px;
    margin: 0 0 1em 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: 1px solid #e6e6eb;
    border-radius: 5px;
`

const DroneTitleElement = styled.blockquote`
    font-size: 1.1em;
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
    let {dispatch} = React.useContext(AudioEnv)
    const jobCompleted = (type) => {
        let newButtonTitle = type === 'Error' ? 'Error! Retry' : type === 'Stop' ? 'Start' : 'Stop'
        let newState = type !== 'Stop'
        updateButtonTitle(newButtonTitle)
        setActive(newState)
    }
    const playStop = () => {
        let newButtonTitle = buttonTitle === 'Stop' ? "Stopping..." : "Starting..."
        let newState = buttonTitle !== 'Stop'
        updateButtonTitle(newButtonTitle)
        setActive(newState)
    }
    React.useEffect(() => {
        if(buttonTitle === 'Starting...' || buttonTitle === 'Stopping...')
            dispatch({type: `${buttonTitle === 'Starting...' ? 'Play' : 'Stop'}`, appname: 'drone', code: droneDSPCode, settings: dspStateFromSettings('drone',settings), onJobComplete: jobCompleted})
    })
    React.useEffect(() => {
        dispatch({type: 'Stop', appname: 'drone'})
        dispatch({type: 'Stop', appname: 'scale'})
        dispatch({type: 'Stop', appname: 'sequencer'})
    },[dispatch])
    let buttonState = active ? "active" : ""
    return (
        <DronePlayerContainer>
            <DroneTitleElement>{title}</DroneTitleElement>
            <DroneButtonElement className={buttonState} onClick={() => playStop()}>{buttonTitle}</DroneButtonElement>
        </DronePlayerContainer>
    )
}

export default DronePlayer