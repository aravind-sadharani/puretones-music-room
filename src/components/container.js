import * as React from "react"
import styled from "styled-components"

const ContainerElement = styled.div`
    color: #404047;
    margin: 0 auto;
    max-width: 720px;
`

const Container = ({children}) => (
    <ContainerElement>
        {children}
    </ContainerElement>
)

export default Container