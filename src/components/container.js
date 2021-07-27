import * as React from "react"
import styled from "styled-components"

const ContainerElement = styled.div`
    color: #404047;
    margin: 0 auto;
    max-width: 720px;
    padding: 12px;
    a {
        font-weight: 700;
        text-decoration: none;
        color: #F76F8E;
    }
    p {
        margin-bottom: 1em;
    }
`

const Container = ({children}) => (
    <ContainerElement id='container'>
        {children}
    </ContainerElement>
)

export default Container