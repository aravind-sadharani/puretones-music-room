import * as React from "react"
import TabNav from "components/tabs"
import Selector from "components/selector"
import Slider from "components/slider"
import DroneString from "applets/dronestring"
import SessionControls from "applets/sessioncontrols"

const Drone = ({droneDSPCode,droneState,onParamUpdate,reset,save,restore}) => {
    const stringTabs = ['String 1', 'String 2', 'String 3', 'String 4', 'String 5', 'String 6']
    const stringNames = ['1st_String', '2nd_String', '3rd_String', '4th_String', '5th_String', '6th_String']
    let stringPages = stringNames.map((s,index) => {
        let basePath = `/FaustDSP/PureTones_v1.0/0x00/${s}`
        let stringState = {}
        Object.entries(droneState).filter(item => item[0].includes(`${basePath}`)).forEach(item => stringState[`${item[0]}`] = item[1])
        return <DroneString title={`String ${index+1}`} stringState={stringState} basePath={basePath} onParamUpdate={(value,path) => onParamUpdate(value,path)} />
    })
    let octaveList = {
        key: "Octave",
        default: droneState['/FaustDSP/PureTones_v1.0/0x00/Octave_Selector'],
        options: [
            {
                value: 1,
                text: "High"
            },
            {
                value: 0,
                text: "Medium"
            },
            {
                value: -1,
                text: "Low"
            }
        ]
    }
    let periodParams = {
        key: "Period",
        init: droneState['/FaustDSP/PureTones_v1.0/0x00/Period'],
        max: 10,
        min: 4,
        step: 0.5
    }
    let levelParams = {
        key: "Level",
        init: droneState['/FaustDSP/Zita_Light/Level'],
        max: 30,
        min: -30,
        step: 0.5
    }
    return (
        <>
            <p><strong>Drone Controls</strong></p>
            <SessionControls appname='drone' code={droneDSPCode} settings={droneState} reset={reset} save={save} restore={restore}/>
            <p><strong>Drone Parameters</strong></p>
            <Selector params={octaveList} path="/FaustDSP/PureTones_v1.0/0x00/Octave_Selector" onParamUpdate={(value,path) => onParamUpdate(value,path)}></Selector>
            <Slider params={periodParams} path="/FaustDSP/PureTones_v1.0/0x00/Period" onParamUpdate={(value,path) => onParamUpdate(value,path)}></Slider>
            <Slider params={levelParams} path="/FaustDSP/Zita_Light/Level" onParamUpdate={(value,path) => onParamUpdate(value,path)}></Slider>
            <TabNav tablist={stringTabs} pagelist={stringPages}></TabNav>
        </>
    )
}

export default Drone