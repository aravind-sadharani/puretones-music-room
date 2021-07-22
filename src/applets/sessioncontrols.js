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
    let {dispatch} = React.useContext(AudioEnv)
    const jobCompleted = (type) => {
        let newTitle = type === 'Stop' ? 'Start' : 'Stop'
        updateTitle(newTitle)
    }
    const playStop = () => {
        if(generate) {
            console.log(generate())
            return
        }
        let type = title === 'Start' ? "Play" : "Stop"
        let newTitle = title === 'Start' ? "Starting..." : "Stopping..."
        updateTitle(newTitle)
        dispatch({type: type, appname: appname, code: code, settings: settings, onJobComplete: jobCompleted})
    }
    return (
        <SessionControlsContainer>
            <Button stateful onClick={() => playStop()}>{title}</Button>
            <Button onClick={() => reset()}>Reset</Button>
            <Button>Save</Button>
            <Button>Restore</Button>
        </SessionControlsContainer>
    )
}

export default SessionControls
