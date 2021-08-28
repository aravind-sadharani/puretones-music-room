import * as React from "react"
import styled from "styled-components"

const WhiteKeyElement = styled.div`
    position: relative;
    width: 11vw;
    max-width: 80px;
    height: 33vw;
    max-height: 240px;
    border: 1px solid black;
    background: ivory;
    border-radius: 5px;
    box-shadow: 0px 1px 3px black;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 20%;
    font-weight: bold;
    color: black;
    &.fade {
        background: #d9d9cc;
        border-color: #d9d9cc;
        z-index: -1;
    }
`

const BlackKeyElement = styled.div`
    position: absolute;
    top: -1px;
    left: 62.5%;
    width: 8.25vw;
    max-width: 60px;
    height: 22vw;
    max-height: 160px;
    background: #282c34;
    border-radius: 5px;
    box-shadow: 0px 1px 3px black;
    cursor: pointer;
    z-index: 333;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 20%;
    color: white;
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