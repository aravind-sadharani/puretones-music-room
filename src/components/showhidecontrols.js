import * as React from "react"
import styled from "styled-components"

const ShowHideContainer = styled.div`
    padding: 0 0 12px 0;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
`

const ShowHideKey = styled.span`
`

const ShowHideButton = styled.button`
    padding: 0 6px;
    border-color: #e6e6eb;
    outline-color: #333366;
    -webkit-appearance: none;
    background-color: #e6e6eb;
    border: 0;
    border-radius: 5px;
    margin: 0 0 0 auto;
    width: 120px;
    &:hover {
        background-color: #333366;
        color: white;
        font-weight: 700;
        opacity: 0.8;
    }
    &.active {
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
        background-color: #333366;
        color: white;
        font-weight: 700;
    }
`

const ShowHideChildren = styled.div`
    display: none;
    margin: 0;
    padding: 12px 12px 0 12px;
    border: 1px solid #e6e6eb;
    border-top-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    grid-template-columns: 1fr 1fr;
    &.active{
        display: block;
    }
    grid-column-start: 1;
    grid-column-end: 3;
`

const ShowHideControls = ({title,label,visibility,onShowHide,children}) => {
    let active = visibility ? "active" : ""
    let tabTitle = visibility ? "Hide" : "Show"
    if (label)
        tabTitle = visibility ? label.inactive : label.active
    return (
        <ShowHideContainer>
            <ShowHideKey>{title}</ShowHideKey>
            <ShowHideButton className={active} onClick={onShowHide}>{tabTitle}</ShowHideButton>
            <ShowHideChildren className={active}>
                {children}
            </ShowHideChildren>
        </ShowHideContainer>
    )
}

export default ShowHideControls