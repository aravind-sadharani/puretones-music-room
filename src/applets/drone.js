import * as React from "react"
import TabNav from "../components/tabs"
import Selector from "../components/selector"
import Slider from "../components/slider"
import DroneString from "./dronestring"
import SessionControls from "./sessioncontrols"
import { graphql, useStaticQuery } from "gatsby"
import { AudioEnv } from "../services/audioenv"

const stringTabs = ['String 1', 'String 2', 'String 3', 'String 4', 'String 5', 'String 6']
const stringPages = [
    <DroneString title='String 1' note='5' />,
    <DroneString title='String 2' note='0' />,
    <DroneString title='String 3' note='12' />,
    <DroneString title='String 4' note='5' />,
    <DroneString title='String 5' note='0' />,
    <DroneString title='String 6' note='12' />
]
const octaveList = {
    key: "Octave",
    default: 0,
    options: [
        {
            value: -1,
            text: "Low"
        },
        {
            value: 0,
            text: "Medium"
        },
        {
            value: 1,
            text: "High"
        }
    ]
}
const periodParams = {
    key: "Period",
    init: 7,
    max: 10,
    min: 4,
    step: 0.5
}
const levelParams = {
    key: "Level",
    init: 0,
    max: 30,
    min: -30,
    step: 0.5
}

const Drone = () => {
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
    let {dispatch} = React.useContext(AudioEnv)
    dispatch({type: 'Configure', appname: 'Drone', code: droneSettings})
    return (
        <>
            <p><strong>Drone Controls</strong></p>
            <SessionControls appname='Drone' code={droneDSPCode}/>
            <p><strong>Drone Parameters</strong></p>
            <br />
            <Selector params={octaveList}></Selector>
            <Slider params={periodParams}></Slider>
            <Slider params={levelParams}></Slider>
            <br />
            <TabNav tablist={stringTabs} pagelist={stringPages}></TabNav>
        </>
    )
}

export default Drone