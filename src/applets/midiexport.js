import * as React from 'react'
import Button from 'components/button'
import SaveRestore from 'components/saverestore'

const isBrowser = typeof window !== "undefined"

const songJSON = {
    "division": 480,
    "format": 1,
    "tracks": [
        [
            {
                "trackName": "Clarinet",
                "delta": 0
            },
            {
                "programChange": {
                    "programNumber": 72,
                },
                "delta": 0
            },
            {
                "noteOn": {
                    "noteNumber": 68,
                    "velocity": 100,
                },
                "channel": 0,
                "delta": 480
            },
            {
                "noteOff": {
                    "noteNumber": 68,
                    "velocity": 100,
                },
                "channel": 0,
                "delta": 480
            },
            {
                "noteOn": {
                    "noteNumber": 70,
                    "velocity": 100,
                },
                "channel": 0,
                "delta": 0
            },
            {
                "noteOff": {
                    "noteNumber": 70,
                    "velocity": 100,
                },
                "channel": 0,
                "delta": 480
            },
            {
                "noteOn": {
                    "noteNumber": 70,
                    "velocity": 100,
                },
                "channel": 0,
                "delta": 0
            },
            {
                "pitchBend" : 10240,
                "channel": 0,
                "delta" : 60
            },
            {
                "pitchBend" : 12288,
                "channel": 0,
                "delta" : 60
            },
            {
                "pitchBend" : 14336,
                "channel": 0,
                "delta" : 60
            },
            {
                "pitchBend" : 16384,
                "channel": 0,
                "delta" : 60
            },
            {
                "noteOff": {
                    "noteNumber": 72,
                    "velocity": 100,
                },
                "channel": 0,
                "delta": 480
            },
            {
                "endOfTrack": true,
                "delta": 0
            }
        ],
                [
            {
                "trackName": "Bass",
                "delta": 0
            },
            {
                "programChange": {
                    "programNumber": 34,
                },
                "delta": 0
            },
            {
                "noteOn": {
                    "noteNumber": 42,
                    "velocity": 100,
                },
                "channel": 1,
                "delta": 480
            },
            {
                "noteOff": {
                    "noteNumber": 42,
                    "velocity": 100,
                },
                "channel": 1,
                "delta": 480
            },
            {
                "noteOn": {
                    "noteNumber": 44,
                    "velocity": 100,
                },
                "channel": 1,
                "delta": 0
            },
            {
                "noteOff": {
                    "noteNumber": 44,
                    "velocity": 100,
                },
                "channel": 1,
                "delta": 480
            },
            {
                "noteOn": {
                    "noteNumber": 44,
                    "velocity": 100,
                },
                "channel": 1,
                "delta": 0
            },
            {
                "pitchBend" : 10240,
                "channel": 1,
                "delta" : 60
            },
            {
                "pitchBend" : 12288,
                "channel": 1,
                "delta" : 60
            },
            {
                "pitchBend" : 14336,
                "channel": 1,
                "delta" : 60
            },
            {
                "pitchBend" : 16384,
                "channel": 1,
                "delta" : 60
            },
            {
                "noteOff": {
                    "noteNumber": 46,
                    "velocity": 100,
                },
                "channel": 1,
                "delta": 480
            },
            {
                "endOfTrack": true,
                "delta": 0
            }
        ]
    ]
}

const MIDIExport = () => {
    const [midiData,setMidiData] = React.useState([])
    const [ready,setReady] = React.useState(false)
    const prepareMIDI = () => {
        if(isBrowser) {
            import('json-midi-encoder').then((encoder) => {
                encoder.encode(songJSON).then((midiFile) => {
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
            {!ready && <Button onClick={prepareMIDI}>Prepare MIDI</Button>}
            {ready && <SaveRestore extn='mid' save={saveMIDI} savetitle='Save MIDI' />}
        </>
    )
}

export default MIDIExport