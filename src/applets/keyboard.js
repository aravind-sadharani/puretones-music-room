import * as React from "react"
import styled from "styled-components"
import { WhiteKey, BlackKey } from "../components/key"

const KeyboardContainer = styled.ul`
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    padding: 0;
    font-size: calc(min(2vw,1.1em));
`

const KeyContainer = styled.li`
    position: relative;
`

const Keyboard = () => {
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
        <KeyContainer>
            <WhiteKey>{note.white}</WhiteKey>
            {note.black && <BlackKey>{note.black}</BlackKey>}
        </KeyContainer>
    ))
    return (
        <>
            <p><strong>Keyboard Controls</strong></p>
            <KeyboardContainer>
                {keys}
            </KeyboardContainer>
            <br />
        </>
    )
}

export default Keyboard