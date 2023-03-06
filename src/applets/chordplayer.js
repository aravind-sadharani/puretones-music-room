import * as React from "react"
import styled from "styled-components"
import { ChordKey } from "components/keys"

const ChordPlayerContainer = styled.div`
    margin: 0 0 1em 0;
`

const ChordRowContainer = styled.ul`
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: calc(min(3vw,1em));
`

const ChordContainer = styled.li`
    position: relative;
    margin: 0;
`

const ChordName = styled.span`
    font-weight: bold;
`

const ChordNotes = styled.span`
    font-size: 0.8em;
`

const Chord = ({chord,chordOn,chordOff}) => {
    if(chord.name === 'fade') {
        return (
            <ChordKey fade />
        )
    }
    return (
        <ChordKey keyOn={()=>chordOn(chord)} keyOff={()=>chordOff(chord)}>
            <center>
                <ChordName>{`${chord.name}`}</ChordName>
                <br />
                <ChordNotes>{`(${chord.root}-${chord.harmony}-${chord.fifth})`}</ChordNotes>
            </center>
        </ChordKey>
    )
}

const ChordPlayer = ({keyOn,keyOff,chordSpec}) => {
    const chordOn = (chord) => {
        keyOn(chord.root)
        keyOn(chord.harmony)
        keyOn(chord.fifth)
    }
    const chordOff = (chord) => {
        keyOff(chord.root)
        keyOff(chord.harmony)
        keyOff(chord.fifth)
    }

    let chords = [
        [
            { name: "Sa-Maj", root: "Sa", harmony: "Ga", fifth: "Pa" },
            { name: "fade", root: "re", harmony: "ma", fifth: "dha" },
            { name: "Re-Maj", root: "Re", harmony: "Ma", fifth: "Dha" },
            { name: "ga-Maj", root: "ga", harmony: "Pa", fifth: "ni" },
            { name: "Ga-Maj", root: "Ga", harmony: "dha", fifth: "Ni" },
            { name: "ma-Maj", root: "ma", harmony: "Dha", fifth: "SA" },
            { name: "Ma-Maj", root: "Ma", harmony: "ni", fifth: "re\""}
        ],
        [
            { name: "Sa-Min", root: "Sa", harmony: "ga", fifth: "Pa" },
            { name: "re-Min", root: "re", harmony: "Ga", fifth: "dha" },
            { name: "fade", root: "Re", harmony: "ma", fifth: "Dha" },
            { name: "ga-Min", root: "ga", harmony: "Ma", fifth: "ni" },
            { name: "Ga-Min", root: "Ga", harmony: "Pa", fifth: "Ni" },
            { name: "ma-Min", root: "ma", harmony: "dha", fifth: "SA" },
            { name: "Ma-Min", root: "Ma", harmony: "Dha", fifth: "re\""}
        ]
    ]
    if(chordSpec)
        chords = chordSpec
    let chordKeys = chords.map((chordRow,i) => (
        <ChordRowContainer key={`Chord-Row-${i}`}>
            {chordRow.map((chord,j) => (
                <ChordContainer key={`${chord.root}-${chord.harmony}-${chord.fifth}-${i}-${j}`}>
                    <Chord chord={chord} chordOn={chordOn} chordOff={chordOff} />
                </ChordContainer>
            ))}
        </ChordRowContainer>
    ))
    return (
        <ChordPlayerContainer>
            {chordKeys}
        </ChordPlayerContainer>
    )
}

export default ChordPlayer