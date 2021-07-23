import * as React from "react"
import Button from "../components/button"
import styled from "styled-components"
import { AudioEnv } from "../services/audioenv"

const SessionControlsContainer = styled.div`
    padding: 0;
    margin: 0;
    text-align: center;
`

const SessionControls = ({appname,code,settings,reset,generate}) => {
    const [title, updateTitle] = React.useState('Start')
    const [active, setActive] = React.useState(false)
    let {dispatch} = React.useContext(AudioEnv)
    const jobCompleted = (type) => {
        let newTitle = type === 'Error' ? 'Error! Retry' : type === 'Stop' ? 'Start' : 'Stop'
        let newState = type !== 'Stop'
        updateTitle(newTitle)
        setActive(newState)
    }
    const playStop = () => {
        let DSPCode = (!code && generate) ? generate() : code
        let type = title === 'Stop' ? "Stop" : "Play"
        let newTitle = title === 'Stop' ? "Stopping..." : "Starting..."
        let newState = title !== 'Stop'
        updateTitle(newTitle)
        setActive(newState)
        dispatch({type: type, appname: appname, code: DSPCode, settings: settings, onJobComplete: jobCompleted})
    }
    return (
        <SessionControlsContainer>
            <Button active={active} onClick={() => playStop()}>{title}</Button>
            <Button onClick={() => reset()}>Reset</Button>
            <Button>Save</Button>
            <Button>Restore</Button>
        </SessionControlsContainer>
    )
}

export default SessionControls
