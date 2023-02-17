import * as React from 'react'
import styled from 'styled-components'
import Button from 'components/button'
import Editor from 'components/editor'
import SaveRestore from 'components/saverestore'
import generateJsonMidi from 'utils/generateJsonMidi'

const isBrowser = typeof window !== "undefined"

const MidiJsonContainer = styled.div`
    padding: 12px 0 8px 0;
    margin: 0 0 1em 0;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
`

const MidiJsonElement = styled.pre`
    margin: 0 12px 1em 12px;
    overflow-x: scroll;
    height: 300px;
    overflow-y: scroll;
`

const MIDIExport = () => {
    const [midiData,setMidiData] = React.useState([])
    const [ready,setReady] = React.useState(false)
    const [composition,updateComposition] = React.useState("Sa 2")
    const [expanded,toggleExpanded] = React.useState(true)
    const [JsonMidi,setJsonMidi] = React.useState('')
    const prepareJSON = () => {
        setReady(false)
        setJsonMidi(generateJsonMidi(composition))
    }
    const prepareMIDI = () => {
        if(isBrowser) {
            import('json-midi-encoder').then((encoder) => {
                encoder.encode(JsonMidi).then((midiFile) => {
                    let newMidiData = new Blob([midiFile])
                    setMidiData(newMidiData)
                    setReady(true)
                },(err) => console.log(err))
            },(err) => console.log(err))
        }
    }
    const saveMIDI = () => (URL.createObjectURL(midiData))
    return (
        <>
            <Editor composition={composition} onCompositionChange={updateComposition} expanded={expanded} onExpand={() => toggleExpanded(!expanded)} />
            <center><Button onClick={prepareJSON}>Prepare JSON</Button></center>
            <br />
            {JsonMidi !== '' &&
                <MidiJsonContainer>
                    <MidiJsonElement>
                        <code>
                            {JSON.stringify(JsonMidi, undefined, 2)}
                        </code>
                    </MidiJsonElement>
                    <center>
                        <Button onClick={prepareMIDI}>Encode MIDI</Button>
                        {ready && <SaveRestore extn='mid' save={saveMIDI} savetitle='Save MIDI' />}
                    </center>
                </MidiJsonContainer>
            }
        </>
    )
}

export default MIDIExport