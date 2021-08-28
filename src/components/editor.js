import * as React from "react"
import styled from "styled-components"
import ShowHideControls from "components/showhidecontrols"

const EditorElement = styled.textarea`
    color: ${({theme}) => theme.light.textColor};
    ${({theme}) => theme.isDark`color: ${theme.dark.textColor};`}
    background-color: ${({theme}) => theme.light.bodyBackground};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.bodyBackground};`}
    display: block;
    overflow: auto;
    height: auto;
    width: 100%;
    margin: 0 0 12px 0;
    border: 1px solid;
    border-radius: 5px;
    padding: 0 6px;
    font-size: 0.85rem;
    resize: vertical;
`

const Editor = ({composition,onCompositionChange,expanded,onExpand}) => (
    <ShowHideControls title="Composition Editor" visibility={expanded} onShowHide={onExpand} >
        <EditorElement rows="8" placeholder="Type your composition here..." value={composition} onChange={(e) => onCompositionChange(e.target.value)} />
    </ShowHideControls>
)

export default Editor