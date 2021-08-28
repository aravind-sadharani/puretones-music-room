import * as React from "react"
import styled from "styled-components"

const HeaderElement = styled.header`
    text-align: center;
    background-color: ${({theme}) => theme.light.buttonBackground};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.buttonBackground};`}
    border-radius: 5px;
    margin-bottom: 12px;
    h1 {
        margin: 0;
        padding: 12px;
        color: ${({theme}) => theme.light.linkColor};
        ${({theme}) => theme.isDark`color: ${theme.dark.linkColor};`}
        font-size: 3em;
    }
    h1 img {
        margin-right: 10px;
        margin-bottom: -5px;
        height: 48px;
    }
`

const Header = ({children}) => (
    <HeaderElement>
        {children}
    </HeaderElement>
)

export default Header