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
    table {
        border-style: hidden;
        box-shadow: 0 1px 0 1px #e6e6eb;
        border-radius: 5px;
    }
    th:first-child {
        border-top-left-radius: 5px;
    }
    th:last-child {
        border-top-right-radius: 5px;
    }
    tr:last-child td:first-child{
        border-bottom-left-radius: 5px;
    }
    tr:last-child td:last-child{
        border-bottom-right-radius: 5px;
    }
    th {
        background-color: #333366;
        color: white;
    }
    tr:nth-child(even) {
        background-color: #e6e6eb;
    }
    td, th {
        padding: 0 12px;
        border: 1px solid #e6e6eb;
    }
`

const Container = ({children}) => (
    <ContainerElement id='container'>
        {children}
    </ContainerElement>
)

export default Container