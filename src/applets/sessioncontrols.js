import * as React from "react"
import styled from "styled-components"
import Button from "../components/button"
import SaveRestore from "../components/saverestore"
import { AudioEnv } from "../services/audioenv"

const SessionControlsContainer = styled.div`
    padding: 0;
    margin: 0;
    text-align: center;
`

const FileExtn = {
    drone: 'prt',
    scale: 'pkb',
    sequencer: 'psq'
}

const SessionControls = ({appname,code,settings,reset,generate,save,restore}) => {
    const [title, updateTitle] = React.useState('Start')
    const [active, setActive] = React.useState(false)
    const [DSPCode, setDSPCode] = React.useState(code || '')
    let {dispatch} = React.useContext(AudioEnv)
    const jobCompleted = (type) => {
        let newTitle = type === 'Error' ? 'Error! Retry' : type === 'Stop' ? 'Start' : 'Stop'
        let newState = type !== 'Stop'
        updateTitle(newTitle)
        setActive(newState)
    }
    const playStop = () => {
        setDSPCode((!code && generate) ? generate() : code)
        let newTitle = title === 'Stop' ? "Stopping..." : "Starting..."
        let newState = title !== 'Stop'
        updateTitle(newTitle)
        setActive(newState)
    }
    React.useEffect(()=>{
        if(title === 'Starting...' || title === 'Stopping...')
            dispatch({type: `${title === 'Starting...' ? 'Play' : 'Stop'}`, appname: appname, code: DSPCode, settings: settings, onJobComplete: jobCompleted})
    })
    React.useEffect(() => {
        dispatch({type: 'Stop', appname: appname})
    },[appname,dispatch])
    return (
        <SessionControlsContainer>
            <Button active={active} onClick={() => playStop()}>{title}</Button>
            <Button onClick={() => reset()}>Reset</Button>
            <SaveRestore extn={FileExtn[`${appname}`]} save={save} restore={restore}/>
        </SessionControlsContainer>
    )
}

export default SessionControls
