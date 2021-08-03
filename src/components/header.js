import * as React from "react"
import styled from "styled-components"

const HeaderElement = styled.header`
    text-align: center;
    background-color: #333366;
    border-radius: 5px;
    margin-bottom: 12px;
    h1 {
        margin: 0;
        padding: 12px;
        color: #F76F8E;
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