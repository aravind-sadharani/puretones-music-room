import * as React from "react"
import styled from "styled-components"
import ShowHideControls from "./showhidecontrols"

const EditorElement = styled.textarea`
    display: block;
    overflow: auto;
    outline-color: #333366;
    height: auto;
    width: 100%;
    margin: 0 0 12px 0;
    border: 1px solid;
    border-radius: 5px;
    padding: 0 6px;
    font-family: monospace;
    resize: vertical;
`

const Editor = ({composition,onCompositionChange,expanded,onExpand}) => (
    <ShowHideControls title="Composition Editor" visibility={expanded} onShowHide={onExpand} >
        <EditorElement rows="8" placeholder="Type your composition here..." value={composition} onChange={(e) => onCompositionChange(e.target.value)} />
    </ShowHideControls>
)

export default Editor