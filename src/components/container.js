import * as React from "react"
import styled from "styled-components"

const ContainerElement = styled.div`
    color: #404047;
    margin: 0 auto;
    max-width: 720px;
    * {
        margin: 0;
        padding: 0;
    }
    p {
        padding: 6px 12px;
    }
    a {
        font-weight: 700;
        text-decoration: none;
        color: #F76F8E;
    }
`

const Container = ({children}) => (
    <ContainerElement>
        {children}
    </ContainerElement>
)

export default Container