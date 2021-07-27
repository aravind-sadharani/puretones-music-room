import * as React from "react"
import styled from "styled-components"

const FooterElement = styled.footer`
    background-color: #e6e6eb;
    color: #404047;
    padding: 12px;
    border-radius: 5px;
`

const Footer = ({children}) => (
    <FooterElement>
        {children}
    </FooterElement>
)

export default Footer