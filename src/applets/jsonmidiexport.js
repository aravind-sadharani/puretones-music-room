import * as React from 'react'
import styled from 'styled-components'
import Button from 'components/button'
import Editor from 'components/editor'
import SaveRestore from 'components/saverestore'
import ShowHideControls from "components/showhidecontrols"
import {generateJsonMidi, psq2JsonMidi} from 'utils/generateJsonMidi'

const isBrowser = typeof window !== "undefined"

const JsonMidiContainer = styled.div`
    padding: 12px 12px 0 12px;
    margin: 0 0 1em 0;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
`

const JsonMidiElement = styled.pre`
    margin: 0 0 1em 0;
    overflow-x: scroll;
    height: 300px;
    overflow-y: scroll;
`

const JSONMIDIExport = () => {
    const [midiData,setMidiData] = React.useState([])
    const [ready,setReady] = React.useState(false)
    const [composition,updateComposition] = React.useState("Sa 2")
    const [expanded,toggleExpanded] = React.useState(true)
    const [jsonMidi,setJsonMidi] = React.useState('')
    const [midiEncoder,setMidiEncoder] = React.useState(null)
    const [jsonVisibility,setJsonVisibility] = React.useState(false)
    const [metaData,setMetaData] = React.useState('')
    if(isBrowser) {
        if(midiEncoder === null) {
            import('json-midi-encoder').then((encoder) => {
                setMidiEncoder(encoder)
            },(err) => console.log(err))
        }
    }
    const prepareMIDI = () => {
        setReady(false)
        let newJsonData = generateJsonMidi(composition)
        setMetaData('')
        setJsonMidi(newJsonData)
        if(midiEncoder !== null) {
            midiEncoder.encode(newJsonData).then((midiFile) => {
                let newMidiData = new Blob([midiFile])
                setMidiData(newMidiData)
                setReady(true)
            },(err) => console.log(err))
        }
    }
    const saveMIDI = () => (URL.createObjectURL(midiData))
    const loadPSQ = (psqString,psqName) => {
        let newJsonData = psq2JsonMidi(psqString)
        setMetaData(` - ${psqName.replace('.psq','')}`)
        setJsonMidi(newJsonData)
        if(midiEncoder !== null) {
            midiEncoder.encode(newJsonData).then((midiFile) => {
                let newMidiData = new Blob([midiFile])
                setMidiData(newMidiData)
                setReady(true)
            },(err) => console.log(err))
        }
    }
    return (
        <JsonMidiContainer>
            <strong>Sequencer Parameters</strong>
            <p />
            <Editor composition={composition} onCompositionChange={updateComposition} expanded={expanded} onExpand={() => toggleExpanded(!expanded)} />
            <center>
                <Button onClick={prepareMIDI}>Editor to MIDI</Button>
                <SaveRestore extn='psq' restore={loadPSQ} restoretitle='PSQ to MIDI' />
                {ready && <SaveRestore extn='mid' save={saveMIDI} savetitle='Save MIDI File' />}
            </center>
            {jsonMidi === '' && <p />}
            {jsonMidi !== '' &&
                <>
                    <p />
                    <strong>MIDI Sequence{metaData}</strong>
                    <p />            
                    <ShowHideControls title='JSON Representation' visibility={jsonVisibility} onShowHide={() => setJsonVisibility(!jsonVisibility)}>
                        <JsonMidiElement>
                            <code>
                                {JSON.stringify(jsonMidi, undefined, 2)}
                            </code>
                        </JsonMidiElement>
                    </ShowHideControls>
                </>
            }
        </JsonMidiContainer>
    )
}

export default JSONMIDIExport