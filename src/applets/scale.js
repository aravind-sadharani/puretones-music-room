import * as React from "react"
import TabNav from "../components/tabs"
import Selector from "../components/selector"
import Slider from "../components/slider"
import ScaleString from "./scalestring"
import SessionControls from "../components/sessioncontrols"

const scaleTabs = ['Sa', 're', 'Re', 'ga', 'Ga', 'ma', 'Ma', 'Pa', 'dha', 'Dha', 'ni', 'Ni', 'SA']
const scalePages = scaleTabs.map((s) => <ScaleString title={s} />)
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
const sustainParams = {
    key: "Sustain",
    init: 2,
    max: 3,
    min: 0,
    step: 0.1
}
const levelParams = {
    key: "Level",
    init: -6,
    max: 30,
    min: -30,
    step: 0.5
}

const Scale = () => (
    <>
        <p><strong>Scale Controls</strong></p>
        <SessionControls appname="Scale" />
        <p><strong>Scale Parameters</strong></p>
        <br />
        <Selector params={octaveList}></Selector>
        <Slider params={sustainParams}></Slider>
        <Slider params={levelParams}></Slider>
        <br />
        <TabNav tablist={scaleTabs} pagelist={scalePages}></TabNav>
    </>
)

export default Scale