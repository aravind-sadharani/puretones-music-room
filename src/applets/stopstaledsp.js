import * as React from 'react'
import { AudioEnv } from "services/audioenv"

const StopStaleDSP = ({location}) => {
    const {dispatch} = React.useContext(AudioEnv)
    React.useEffect(() => {
        dispatch({type: 'Stop', appname: 'drone'})
        dispatch({type: 'Stop', appname: 'scale'})
        dispatch({type: 'Stop', appname: 'sequencer'})
    },[dispatch,location])
    return <></>
}

export default StopStaleDSP