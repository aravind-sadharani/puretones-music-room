import * as React from "react"
import ShowHideControls from "../components/showhidecontrols"
import Selector from "../components/selector"
import Editor from "../components/editor"
import SessionControls from "../components/sessioncontrols"

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
const toneList = {
    key: "Tone",
    default: 0,
    options: [
        {
            value: 0,
            text: "String 1"
        },
        {
            value: 1,
            text: "String 2"
        },
        {
            value: 2,
            text: "Bow"
        },
        {
            value: 3,
            text: "Reed"
        }
    ]
}
const voiceLabel = {
    inactive: "Disable",
    active: "Enable"
}

const Sequencer = () => (
    <>
        <p><strong>Sequencer Controls</strong></p>
        <SessionControls appname="Sequencer" />
        <p><strong>Sequencer Parameters</strong></p>
        <br />
        <ShowHideControls title="Voice 1" label={voiceLabel}>
            <br />
            <Selector params={octaveList}></Selector>
            <Selector params={toneList}></Selector>
            <Editor />
        </ShowHideControls>
        <ShowHideControls title="Voice 2" label={voiceLabel}>
            <br />
            <Selector params={octaveList}></Selector>
            <Selector params={toneList}></Selector>
            <Editor />
        </ShowHideControls>
        <ShowHideControls title="Voice 3" label={voiceLabel}>
            <br />
            <Selector params={octaveList}></Selector>
            <Selector params={toneList}></Selector>
            <Editor />
        </ShowHideControls>
    </>
)

export default Sequencer