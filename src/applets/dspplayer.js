import * as React from "react"
import styled from "styled-components"
import Button from "../components/button"
import { AudioEnv } from "../services/audioenv"
import { dspStateFromSettings } from "../utils/dspsettingsinterpreter"

const DSPPlayerContainer = styled.div`
    padding: 12px;
    margin: 0;
    text-align: center;
    border: 1px solid #e6e6eb;
    border-radius: 5px;
`

const DSPTitleElement = styled.blockquote`
    font-size: 1.2em;
    margin: 0;
`

const DSPPlayer = ({appname,title,code,settings}) => {
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
            dispatch({type: `${buttonTitle === 'Starting...' ? 'Play' : 'Stop'}`, appname: appname, code: code, settings: dspStateFromSettings(appname,settings), onJobComplete: jobCompleted})
    })
    React.useEffect(() => {
        dispatch({type: 'Stop', appname: 'drone'})
        dispatch({type: 'Stop', appname: 'scale'})
        dispatch({type: 'Stop', appname: 'sequencer'})
    },[dispatch])
    return (
        <DSPPlayerContainer>
            <DSPTitleElement>{title}</DSPTitleElement>
            <Button active={active} onClick={() => playStop()}>{buttonTitle}</Button>
        </DSPPlayerContainer>
    )
}

export default DSPPlayer