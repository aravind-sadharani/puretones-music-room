import * as React from "react"
import TabNav from "../components/tabs"
import Selector from "../components/selector"

const stringTabs = ['String 1', 'String 2', 'String 3', 'String 4', 'String 5', 'String 6']
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
const Drone = () => (
    <>
        Drone Page
        <br />
        <br />
        <Selector params={octaveList}></Selector>
        <TabNav tablist={stringTabs} pagelist={stringTabs}></TabNav>
    </>
)

export default Drone