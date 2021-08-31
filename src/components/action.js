import * as React from "react"
import styled from "styled-components"

const ActionElement = styled.span`
    display: inline-block;
    margin: 12px;
    padding: 3px 12px;
    background-color: ${({theme}) => theme.light.buttonBackground};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.buttonBackground};`}
    color: ${({theme}) => theme.light.buttonText};
    ${({theme}) => theme.isDark`color: ${theme.dark.buttonText};`}
    font-weight: 700;
    border-radius: 5px;
    a {
        color: inherit;
    }
`

const Action = ({children}) => (
    <ActionElement>{children}</ActionElement>
)

export default Action