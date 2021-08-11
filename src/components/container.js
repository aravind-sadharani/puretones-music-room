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
        margin: 0 0 1rem 0;
    }
    h1, h2, h3 {
        margin: 0 0 1rem 0;
    }
    .katex {
        font: 100%/1.666 'Noto Sans', sans-serif !important;
    } 
`

const Container = ({children}) => (
    <ContainerElement id='container'>
        {children}
    </ContainerElement>
)

export default Container