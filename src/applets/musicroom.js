import * as React from "react"
import TabNav from "../components/tabs"
import Selector from "../components/selector"
import Slider from "../components/slider"
import Drone from "../applets/drone"
import Scale from "../applets/scale"
import Sequencer from "../applets/sequencer"
import { AudioEnv } from "../services/audioenv"
import { graphql, useStaticQuery } from "gatsby"
import useLocalStore from "../services/localstore"

const MusicRoom = () => {
    const {dsp,prt} = useStaticQuery(
        graphql`
            query DroneDSPQuery {
                dsp: file(relativePath: {eq: "puretones.dsp"}){
                    childPlainText {
                        content
                    }
                  },
                prt: file(relativePath: {eq: "default.prt"}){
                    childPlainText {
                        content
                    }
                }
            }
        `
    )
    const droneDSPCode = dsp.childPlainText.content
    const droneSettings = prt.childPlainText.content.replace(/puretones/g,'FaustDSP')
    const {dispatch} = React.useContext(AudioEnv)
    let defaultDroneState = {}
    droneSettings.split('\n').forEach((s) => {
        let [value, path] = s.split(' ')
        if(value && path)
            defaultDroneState[`${path}`] = value
    })
    const [droneLocalState, setDroneLocalState] = useLocalStore('drone', defaultDroneState)
    React.useEffect(() => configureDrone({...droneLocalState}), [droneLocalState])
    const [droneState, configureDrone] = React.useState(defaultDroneState)
    const updateParameter = (value, path) => {
        let updateParams = {}
        updateParams[`${path}`] = value
        dispatch({type: 'Configure', appname: 'drone', settings: updateParams})
        let newDroneState = droneState
        newDroneState[`${path}`] = value
        setDroneLocalState(newDroneState)
    }
    const resetDrone = () => {
        dispatch({type: 'Configure', appname: 'drone', settings: defaultDroneState})
        setDroneLocalState(defaultDroneState)
    }
    const commonFreqParams = {
        key: "Key",
        default: Number(droneState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency']),
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
        init: Number(droneState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune']),
        max: 100,
        min: -100,
        step: 1
    }

    let mainNavTabs = ['Drone', 'Scale', 'Sequencer']
    let mainNavPages = [
        <Drone droneDSPCode={droneDSPCode} droneState={droneState} onParamUpdate={updateParameter} resetDrone={resetDrone} />, 
        <Scale />,
        <Sequencer />
    ]

    return (
        <>
            <p><strong>Common Parameters</strong></p>
            <br />
            <Selector params={commonFreqParams} path='/FaustDSP/PureTones_v1.0/0x00/Common_Frequency' onParamUpdate={updateParameter}></Selector>
            <Slider params={offsetParams} path='/FaustDSP/PureTones_v1.0/0x00/Fine_Tune' onParamUpdate={updateParameter} ></Slider>
            <br />
            <TabNav tablist={mainNavTabs} pagelist={mainNavPages}></TabNav>
        </>
    )
}

export default MusicRoom