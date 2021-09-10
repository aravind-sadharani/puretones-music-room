import * as React from "react"
import styled from "styled-components"

const TagContainer = styled.span`
    position: relative;
    display: inline-block;
    margin: 0 12px 12px 0;
    padding: 3px 12px;
    background-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.borderColor};`}
    color: ${({theme}) => theme.light.textColor};
    ${({theme}) => theme.isDark`color: ${theme.dark.textColor};`}
    border-radius: 16px;
    &:hover {
        background-color: ${({theme}) => theme.light.buttonBackground};
        ${({theme}) => theme.isDark`background-color: ${theme.dark.buttonBackground};`}
        color: ${({theme}) => theme.light.noticeBackground};
        ${({theme}) => theme.isDark`color: ${theme.dark.noticeBackground};`}
        font-weight: 700;
    }
    a {
        color: inherit;
        font-weight: inherit;
    }
`

const TagElement = styled.span`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
`

const TagPlaceHolder = styled.span`
    font-weight: 700;
    visibility: hidden;
    white-space: nowrap;
`

const Tag = ({children}) => (
    <TagContainer>
        <TagPlaceHolder>{children}</TagPlaceHolder>
        <TagElement>{children}</TagElement>
    </TagContainer>
)

export default Tag