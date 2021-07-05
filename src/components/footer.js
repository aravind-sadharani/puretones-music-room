import * as React from "react"
import styled from "styled-components"

const FooterElement = styled.footer`
    background-color: #e6e6eb;
    color: #404047;
    margin: 2vmin;
    padding: 1vmin;
    border-radius: 1vmin;
`

const Footer = ({children}) => (
    <FooterElement>
        {children}
    </FooterElement>
)

export default Footer