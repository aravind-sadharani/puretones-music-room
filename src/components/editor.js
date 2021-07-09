import * as React from "react"
import styled from "styled-components"
import ShowHideControls from "./showhidecontrols"

const EditorElement = styled.textarea`
    overflow: auto;
    outline-color: #333366;
    height: auto;
    width: 100%;
    margin-top: 1vmin;
    border: 1px solid;
    border-radius: 5px;
    padding: 0 6px;
    font-family: monospace;
    resize: vertical;
`

const Editor = () => (
    <ShowHideControls title="Composition Editor">
        <EditorElement rows="8" placeholder="Type your composition here..."/>
    </ShowHideControls>
)

export default Editor