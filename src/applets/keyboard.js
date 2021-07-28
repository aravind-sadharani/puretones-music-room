import * as React from "react"
import styled from "styled-components"
import { WhiteKey, BlackKey } from "../components/key"

const KeyboardContainer = styled.ul`
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    padding: 0 0 1em 0;
    margin: 0;
    font-size: calc(min(3vw,1em));
`

const KeyContainer = styled.li`
    position: relative;
`

const Keyboard = ({keyOn,keyOff}) => {
    let notes = [
        {white: "Sa", black: "re"},
        {white: "Re", black: "ga"},
        {white: "Ga"},
        {white: "ma", black: "Ma"},
        {white: "Pa", black: "dha"},
        {white: "Dha", black: "ni"},
        {white: "Ni"},
        {white: "SA"},
    ]
    let keys = notes.map(note => (
        <KeyContainer key={`${note.white}-${note.black}`}>
            <WhiteKey keyOn={()=>keyOn(note.white)} keyOff={()=>keyOff(note.white)}>{note.white}</WhiteKey>
            {note.black && <BlackKey keyOn={()=>keyOn(note.black)} keyOff={()=>keyOff(note.black)}>{note.black}</BlackKey>}
        </KeyContainer>
    ))
    return (
        <>
            <p><strong>Keyboard Controls</strong></p>
            <KeyboardContainer>
                {keys}
            </KeyboardContainer>
        </>
    )
}

export default Keyboard