import * as React from "react"
import styled from "styled-components"

const HeaderElement = styled.header`
    text-align: center;
    background-color: #333366;
    margin: 12px;
    padding: 6px 0;
    border-radius: 5px;
    h1 {
        margin: 0;
        padding: 0.22em;
        color: #F76F8E;
        font-size: 3em;
    }
    h1 img {
        margin-right: 10px;
        width: 79px;
        height: 48px;
    }
`

const Header = ({children}) => (
    <HeaderElement>
        {children}
    </HeaderElement>
)

export default Header