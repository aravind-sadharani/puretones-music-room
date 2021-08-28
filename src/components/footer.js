import * as React from "react"
import styled from "styled-components"

const FooterElement = styled.footer`
    background-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.borderColor};`}
    color: ${({theme}) => theme.light.textColor};
    ${({theme}) => theme.isDark`color: ${theme.dark.textColor};`}
    padding: 12px;
    border-radius: 5px;
`

const Footer = ({children}) => (
    <FooterElement>
        {children}
    </FooterElement>
)

export default Footer