import * as React from "react"
import Button from "../components/button"
import styled from "styled-components"

const SessionControlsContainer = styled.div`
    padding: 0;
    margin: 0;
    text-align: center;
`

const playStopTitle = {
    active: "Stop",
    inactive: "Play"
}

const SessionControls = () => (
    <SessionControlsContainer>
        <Button stateful title={playStopTitle}>Play</Button>
        <Button>New</Button>
        <Button>Save</Button>
        <Button>Restore</Button>
    </SessionControlsContainer>
)

export default SessionControls
