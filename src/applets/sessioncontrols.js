import * as React from "react"
import Button from "../components/button"
import styled from "styled-components"
import { AudioEnv } from "../services/audioenv"

const SessionControlsContainer = styled.div`
    padding: 0;
    margin: 0;
    text-align: center;
`

const SessionControls = ({appname,code,settings}) => {
    const [title, updateTitle] = React.useState('Play')
    let {dispatch} = React.useContext(AudioEnv)
    const jobCompleted = (type) => {
        let newTitle = type === 'Stop' ? 'Play' : 'Stop'
        updateTitle(newTitle)
    }
    const playStop = () => {
        let type = title === 'Play' ? "Play" : "Stop"
        let newTitle = title === 'Play' ? "Starting..." : "Stopping..."
        updateTitle(newTitle)
        dispatch({type: type, appname: appname, code: code, settings: settings, onJobComplete: jobCompleted})
    }
    return (
        <SessionControlsContainer>
            <Button stateful onClick={() => playStop()}>{title}</Button>
            <Button>New</Button>
            <Button>Save</Button>
            <Button>Restore</Button>
        </SessionControlsContainer>
    )
}

export default SessionControls
