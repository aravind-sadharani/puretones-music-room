import * as React from "react"
import styled from "styled-components"
import ShowHideControls from "./showhidecontrols"

const EditorElement = styled.textarea`
    display: block;
    overflow: auto;
    outline-color: #333366;
    height: auto;
    width: calc(100% - 24px);
    margin: 12px;
    border: 1px solid;
    border-radius: 5px;
    padding: 0 6px;
    font-family: monospace;
    resize: vertical;
`

const Editor = ({composition,onCompositionChange}) => (
    <ShowHideControls title="Composition Editor">
        <EditorElement rows="8" placeholder="Type your composition here..." value={composition} onChange={(e) => onCompositionChange(e.target.value)} />
    </ShowHideControls>
)

export default Editor