import * as React from 'react'
import styled from 'styled-components'

const CaptionContainer = styled.div`
    padding: 12px 12px 1rem 12px;
    margin: 0;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
`

const Caption = ({children}) => (
    <CaptionContainer>
        {children}
    </CaptionContainer>
)

export default Caption