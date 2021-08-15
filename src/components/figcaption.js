import * as React from 'react'
import styled from 'styled-components'

const FigCaptionContainer = styled.div`
    padding: 12px 12px 1rem 12px;
    margin: 0 0 1em 0;
    border: 1px solid #e6e6eb;
    border-top: 0;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
`

const FigCaption = ({children}) => (
    <FigCaptionContainer>
        {children}
    </FigCaptionContainer>
)

export default FigCaption