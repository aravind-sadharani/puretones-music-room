import * as React from "react"
import styled from "styled-components"

const ButtonElement = styled.button`
    padding: 0 6px;
    background-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.borderColor};`}
    color: ${({theme}) => theme.light.textColor};
    ${({theme}) => theme.isDark`color: ${theme.dark.textColor};`}
    -webkit-appearance: none;
    appearance: none;
    border: 0;
    border-radius: 5px;
    margin: ${props => props.player === 'true' ? 'auto 0 0 auto' : '6px'};
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
        background-color: ${({theme}) => theme.light.buttonBackground};
        ${({theme}) => theme.isDark`background-color: ${theme.dark.buttonBackground};`}
        color: ${({theme}) => theme.light.buttonText};
        ${({theme}) => theme.isDark`color: ${theme.dark.buttonText};`}
        font-weight: 700;
    }
`

const Button = ({active,onClick,children,player}) => {
    let buttonState = active ? "active" : ""
    return (
        <ButtonElement player={`${player}`} className={buttonState} onClick={()=>{
            if(onClick)
                onClick()
        }}>{children}</ButtonElement>
    )
}

export default Button