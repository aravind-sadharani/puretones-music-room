import * as React from 'react'
import { CommonPitchEnv } from 'services/commonpitch'
import { AudioEnv } from "services/audioenv"
import Selector from 'components/selector'
import Slider from 'components/slider'
import useLocalStore from "services/localstore"

const CommonPitch = () => {
    const {commonPitch, setCommonPitch} = React.useContext(CommonPitchEnv)
    const {state, dispatch} = React.useContext(AudioEnv)
    const [proxyPitch, setProxyPitch] = React.useState(commonPitch)
    const [localCommonPitch, setLocalCommonPitch] = useLocalStore('commonpitch',commonPitch)
    const onParamUpdate = (value,path) => {
        let newPitch = proxyPitch
        newPitch[`${path}`] = value
        setLocalCommonPitch({...newPitch})
        let newDroneState = {}
        let newScaleState = {}
        let newSequencerState = {}
        switch(path) {
            case 'pitch':
                newDroneState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency'] = value
                newScaleState['/FaustDSP/Common_Parameters/Pitch'] = value
                newSequencerState['/FaustDSP/Motif/Pitch'] = value
                break
            case 'offSet':
                newDroneState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune'] = value
                newScaleState['/FaustDSP/Common_Parameters/Fine_Tune'] = value
                newSequencerState['/FaustDSP/Motif/Fine_Tune'] = value
                break
            default:
                console.log(`Common Pitch Applet: Incorrect Path ${path}`)
                return
        }
        if(state['dronePlaying'])
            dispatch({type: 'Configure', appname: 'drone', settings: newDroneState})
        if(state['scalePlaying'])
            dispatch({type: 'Configure', appname: 'scale', settings: newScaleState})
        if(state['sequencerPlaying'])
            dispatch({type: 'Configure', appname: 'sequencer', settings: newSequencerState}) 
    }

    React.useEffect(() => {
        setCommonPitch(localCommonPitch)
        setProxyPitch({...localCommonPitch})
    },[localCommonPitch,setCommonPitch])

    let commonFreqParams = {
        key: "Key",
        default: Number(localCommonPitch['pitch']),
        options: [
            {
                value: "14",
                text: "B"
            },
            {
                value: "13",
                text: "A#"
            },
            {
                value: "12",
                text: "A"
            },
            {
                value: "11",
                text: "G#"
            },
            {
                value: "10",
                text: "G"
            },
            {
                value: "9",
                text: "F#"
            },
            {
                value: "8",
                text: "F"
            },
            {
                value: "7",
                text: "E"
            },
            {
                value: "6",
                text: "D#"
            },
            {
                value: "5",
                text: "D"
            },
            {
                value: "4",
                text: "C#"
            },
            {
                value: "3",
                text: "C"
            }
        ]
    }
    
    let offsetParams = {
        key: "Offset",
        init: Number(localCommonPitch['offSet']),
        max: 100,
        min: -100,
        step: 1
    }
    return (
        <>
            <Selector params={commonFreqParams} path='pitch' onParamUpdate={onParamUpdate}></Selector>
            <Slider params={offsetParams} path='offSet' onParamUpdate={onParamUpdate} ></Slider>
        </>
    )
}

export default CommonPitch