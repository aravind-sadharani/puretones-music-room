import * as React from "react"
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import globalTheme from "utils/theme"

const GlobalStyle = createGlobalStyle`
    body {
        background-color: ${({theme}) => theme.light.bodyBackground};
        ${({theme}) => theme.isDark`background-color: ${theme.dark.bodyBackground};`}
    }
`

const ContainerElement = styled.div`
    color: ${({theme}) => theme.light.textColor};
    ${({theme}) => theme.isDark`color: ${theme.dark.textColor};`}
    margin: 0 auto;
    max-width: 720px;
    padding: 12px;
    a {
        font-weight: 700;
        text-decoration: none;
        color: ${({theme}) => theme.light.linkColor};
        ${({theme}) => theme.isDark`color: ${theme.dark.linkColor};`}
    }
    p {
        margin: 0 0 1rem 0;
    }
    h1, h2, h3 {
        margin: 0 0 1rem 0;
    }
    pre, code {
        overflow-x: scroll;
        border-radius: 5px;
        background-color: ${({theme}) => theme.light.borderColor};
        ${({theme}) => theme.isDark`background-color: ${theme.dark.borderColor};`}
    }
    .katex {
        font: 100%/1.666 'Noto Sans', sans-serif !important;
    }
    .gatsby-resp-image-wrapper {
        width: 100%;
        overflow-x: auto;
        border: 1px solid;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        margin-bottom: -1rem;
        border-color: ${({theme}) => theme.light.borderColor};
        ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    }
    .gatsby-resp-image-image {
        background-color: ${({theme}) => theme.light.bodyBackground};
        ${({theme}) => theme.isDark`background-color: ${theme.dark.bodyBackground};`}
    }
`

const Container = ({children}) => (
    <ThemeProvider theme={globalTheme}>
        <GlobalStyle />
        <ContainerElement>
            {children}
        </ContainerElement>
    </ThemeProvider>
)

export default Container