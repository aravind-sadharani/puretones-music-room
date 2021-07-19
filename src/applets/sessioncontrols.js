import * as React from "react"
import Button from "../components/button"
import styled from "styled-components"
import { AudioEnv } from "../services/audioenv"

const SessionControlsContainer = styled.div`
    padding: 0;
    margin: 0;
    text-align: center;
`

const playStopTitle = {
    active: "Stop",
    inactive: "Play"
}

const SessionControls = ({appname,code}) => {
    const [active, setActive] = React.useState(false)
    let {dispatch} = React.useContext(AudioEnv)
    const playStop = () => {
        setActive(!active)
        let type = active ? "Stop" : "Play"
        dispatch({type: type, appname: appname, code: code})
    }
    return (
        <SessionControlsContainer>
            <Button stateful title={playStopTitle} onClick={() => playStop()}>Play</Button>
            <Button>New</Button>
            <Button>Save</Button>
            <Button>Restore</Button>
        </SessionControlsContainer>
    )
}

export default SessionControls
