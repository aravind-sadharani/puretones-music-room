import * as React from "react"
import styled from "styled-components"

const ButtonElement = styled.button`
    padding: 0 6px;
    border-color: #e6e6eb;
    outline-color: #333366;
    -webkit-appearance: none;
    background-color: #e6e6eb;
    border: 0;
    border-radius: 5px;
    margin: 6px;
    width: 120px;
    &:hover {
        background-color: #333366;
        color: white;
        font-weight: 700;
        opacity: 0.8;
    }
    &.active {
        background-color: #333366;
        color: white;
        font-weight: 700;
    }
`

const Button = ({active,onClick,children}) => {
    let buttonState = active ? "active" : ""
    return (
        <ButtonElement className={buttonState} onClick={()=>{
            if(onClick)
                onClick()
        }}>{children}</ButtonElement>
    )
}

export default Button