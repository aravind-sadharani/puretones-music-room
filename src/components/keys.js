import * as React from "react"
import styled from "styled-components"

const WhiteKeyElement = styled.div`
    position: relative;
    width: calc(12.5vw - 9px);
    max-width: 80px;
    height: 30vw;
    max-height: 240px;
    border: 1px solid;
    border-radius: 5px;
    background-color: ${({theme}) => theme.ivory};
    box-shadow: 0px 1px 3px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 20%;
    font-weight: bold;
    color: ${({theme}) => theme.light.textColor};
    &.fade {
        opacity: 0.7;
        border: none;
        z-index: -1;
    }
`

const BlackKeyElement = styled.div`
    position: absolute;
    top: -1px;
    left: 62.5%;
    width: calc(9.375vw - 6px);
    max-width: 60px;
    height: 20vw;
    max-height: 160px;
    background-color: ${({theme}) => theme.ebony};
    border-radius: 5px;
    box-shadow: 0px 1px 3px;
    cursor: pointer;
    z-index: 333;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 20%;
    color: ${({theme}) => theme.light.buttonText};
    &.fade {
        opacity: 0.5;
    }
`

const WhiteKey = ({keyOn,keyOff,children}) => (
    <WhiteKeyElement className={`${children === 'fade' ? 'fade' : ''}`} onTouchStart={keyOn} onTouchEnd={keyOff} onMouseDown={keyOn} onMouseUp={keyOff}>{children !== 'fade' && children}</WhiteKeyElement>
)

const BlackKey = ({keyOn,keyOff,children}) => (
    <BlackKeyElement className={`${children === 'fade' ? 'fade' : ''}`} onTouchStart={keyOn} onTouchEnd={keyOff} onMouseDown={keyOn} onMouseUp={keyOff}>{children !== 'fade' && children}</BlackKeyElement>
)

export {WhiteKey, BlackKey}