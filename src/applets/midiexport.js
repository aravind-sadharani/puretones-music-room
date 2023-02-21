import * as React from 'react'
import styled from 'styled-components'
import Button from 'components/button'
import SaveRestore from 'components/saverestore'
import ShowHideControls from "components/showhidecontrols"
import {sequencer2MIDI} from 'utils/generateJsonMidi'

const JsonMidiElement = styled.pre`
    margin: 0 0 1em 0;
    overflow-x: scroll;
    height: 300px;
    overflow-y: scroll;
`

const isBrowser = typeof window !== "undefined"

const MIDIExport = ({sequencerState, sequencerSettings, scaleState, sequencerName}) => {
    const [ready,setReady] = React.useState(false)
    const [jsonMidi,setJsonMidi] = React.useState('')
    const [midiEncoder,setMidiEncoder] = React.useState(null)
    const [midiData,setMidiData] = React.useState([])
    const [jsonVisibility,setJsonVisibility] = React.useState(false)

    if(isBrowser) {
        if(midiEncoder === null) {
            import('json-midi-encoder').then((encoder) => {
                setMidiEncoder(encoder)
            },(err) => console.log(err))
        }
    }

    const prepareMIDI = () => {
        let newJsonData = sequencer2MIDI(sequencerState,sequencerSettings,scaleState)
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

    React.useEffect(() => {
        setReady(false)
        setMidiData([])
        setJsonMidi('')
    },[sequencerState,sequencerSettings,scaleState])

    return (
        <>
            <p><strong>Convert to MIDI</strong></p>
            <center>
                <Button onClick={prepareMIDI}>Prepare MIDI</Button>
                {ready && <SaveRestore extn='mid' save={saveMIDI} savetitle='Save MIDI' />}
            </center>
            <p />
            {jsonMidi === '' && <p />}
            {jsonMidi !== '' &&
                <>
                    <p><strong>MIDI Sequence {sequencerName.replace('loaded ','')}</strong></p> 
                    <ShowHideControls title='JSON Representation' visibility={jsonVisibility} onShowHide={() => setJsonVisibility(!jsonVisibility)}>
                        <JsonMidiElement>
                            <code>
                                {JSON.stringify(jsonMidi, undefined, 2)}
                            </code>
                        </JsonMidiElement>
                    </ShowHideControls>
                </>
            }
        </>
    )
}

export default MIDIExport