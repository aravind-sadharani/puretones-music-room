import * as React from "react"
import styled from "styled-components"

const ActionElement = styled.span`
    display: inline-block;
    margin: ${({center}) => center ? `12px auto` : `12px 12px 12px 0`};
    padding: 3px 12px;
    background-color: ${({theme}) => theme.light.buttonBackground};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.buttonBackground};`}
    color: ${({theme}) => theme.light.noticeBackground};
    ${({theme}) => theme.isDark`color: ${theme.dark.noticeBackground};`}
    font-weight: 700;
    border-radius: ${({action}) => action ? `5px` : `16px`};
    a {
        color: inherit;
    }
`

const Action = ({center, action, children}) => (
    <ActionElement center={center} action={action}>{children}</ActionElement>
)

export default Action