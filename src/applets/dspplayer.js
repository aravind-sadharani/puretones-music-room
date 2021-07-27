import * as React from "react"
import styled from "styled-components"
import Button from "../components/button"
import { AudioEnv } from "../services/audioenv"
import { dspStateFromSettings } from "../utils/dspsettingsinterpreter"

const DSPPlayerContainer = styled.div`
    padding: 0;
    margin: 0;
    text-align: center;
`

const DSPPlayer = ({appname,code,settings}) => {
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
        let newTitle = title === 'Stop' ? "Stopping..." : "Starting..."
        let newState = title !== 'Stop'
        updateTitle(newTitle)
        setActive(newState)
    }
    React.useEffect(() => {
        if(title === 'Starting...' || title === 'Stopping...')
            dispatch({type: `${title === 'Starting...' ? 'Play' : 'Stop'}`, appname: appname, code: code, settings: dspStateFromSettings(appname,settings), onJobComplete: jobCompleted})
    })
    React.useEffect(() => {
        dispatch({type: 'Stop', appname: 'drone'})
        dispatch({type: 'Stop', appname: 'scale'})
        dispatch({type: 'Stop', appname: 'sequencer'})
    },[dispatch])
    return (
        <DSPPlayerContainer>
            <Button active={active} onClick={() => playStop()}>{title}</Button>
        </DSPPlayerContainer>
    )
}

export default DSPPlayer