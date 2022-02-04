import * as React from "react"
import styled from "styled-components"

const ShowHideContainer = styled.div`
    padding: 0 0 12px 0;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 120px;
`

const ShowHideKey = styled.span`
`

const ShowHideHeading = styled.span`
    font-weight: bold;
    font-size: 1.32rem;
`

const ShowHideButton = styled.button`
    padding: 0 6px;
    background-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.borderColor};`}
    color: ${({theme}) => theme.light.textColor};
    ${({theme}) => theme.isDark`color: ${theme.dark.textColor};`}
    -webkit-appearance: none;
    appearance: none;
    border: 0;
    border-radius: 5px;
    margin: auto 0 0 auto;
    width: 120px;
    &:hover {
        background-color: ${({theme}) => theme.light.buttonBackground};
        ${({theme}) => theme.isDark`background-color: ${theme.dark.buttonBackground};`}
        color: ${({theme}) => theme.light.buttonText};
        ${({theme}) => theme.isDark`color: ${theme.dark.buttonText};`}
        font-weight: 700;
        opacity: 0.8;
    }
    &.active {
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
        background-color: ${({theme}) => theme.light.buttonBackground};
        ${({theme}) => theme.isDark`background-color: ${theme.dark.buttonBackground};`}
        color: ${({theme}) => theme.light.buttonText};
        ${({theme}) => theme.isDark`color: ${theme.dark.buttonText};`}
        font-weight: 700;
    }
`

const ShowHideChildren = styled.div`
    display: none;
    margin: 0;
    padding: 12px 12px 0 12px;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
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

const ShowHideControls = ({title,label,visibility,onShowHide,heading,children}) => {
    let active = visibility ? "active" : ""
    let tabTitle = visibility ? "Hide" : "Show"
    if (label)
        tabTitle = visibility ? label.inactive : label.active
    return (
        <ShowHideContainer>
            {!heading && <ShowHideKey>{title}</ShowHideKey>}
            {heading && <ShowHideHeading>{title}</ShowHideHeading>}
            <ShowHideButton className={active} onClick={onShowHide}>{tabTitle}</ShowHideButton>
            <ShowHideChildren className={active}>
                {children}
            </ShowHideChildren>
        </ShowHideContainer>
    )
}

export default ShowHideControls