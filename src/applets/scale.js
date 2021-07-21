import * as React from "react"
import TabNav from "../components/tabs"
import Selector from "../components/selector"
import Slider from "../components/slider"
import ScaleString from "./scalestring"
import SessionControls from "./sessioncontrols"
import Keyboard from "./keyboard"
import ListenToKeyStrokes from "../services/keystroke"

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
const varianceParams = {
    key: "Variance",
    init: 2,
    max: 4,
    min: 0,
    step: 0.1
}
const keyOn = (keyName) => {
    console.log(`${keyName} is ON`)
}
const keyOff = (keyName) => {
    console.log(`${keyName} is OFF`)
}
const handleKeyStroke = (e) => {
    let notes = {a: "Sa", w: "re", s: "Re", e: "ga", d: "Ga", f: "ma", t: "Ma", g: "Pa", y: "dha", h: "Dha", u: "ni", j: "Ni", k: "SA"}
    if(e.target.localName === "div" || e.target.localName === "body") {
        if(e.type === "keydown" && notes[e.key])
            keyOn(notes[e.key])
        if(e.type === "keyup" && notes[e.key])
        keyOff(notes[e.key])
    }
}
const Scale = () => {
    return (
        <>
            <p><strong>Scale Controls</strong></p>
            <SessionControls appname="Scale" />
            <br />
            <Keyboard keyOn={keyOn} keyOff={keyOff} />
            <ListenToKeyStrokes handleKeyStroke={handleKeyStroke} />
            <p><strong>Scale Parameters</strong></p>
            <br />
            <Selector params={octaveList}></Selector>
            <Slider params={sustainParams}></Slider>
            <Slider params={levelParams}></Slider>
            <Slider params={varianceParams}></Slider>
            <br />
            <TabNav tablist={scaleTabs} pagelist={scalePages}></TabNav>
        </>
    )
}

export default Scale