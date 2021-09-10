import * as React from "react"
import styled from "styled-components"

const ActionElement = styled.span`
    display: inline-block;
    margin: 12px auto;
    padding: 3px 12px;
    background-color: ${({theme}) => theme.light.buttonBackground};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.buttonBackground};`}
    color: ${({theme}) => theme.light.noticeBackground};
    ${({theme}) => theme.isDark`color: ${theme.dark.noticeBackground};`}
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