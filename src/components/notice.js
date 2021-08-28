import * as React from 'react'
import styled from 'styled-components'

const NoticeContainer = styled.div`
    padding: 12px 12px 1em 12px;
    margin: 0 0 1em 0;
    background-color: ${({theme}) => theme.light.noticeBackground};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.noticeBackground};`}
    color: ${({theme}) => theme.light.noticeText};
    ${({theme}) => theme.isDark`color: ${theme.dark.noticeText};`}
    border-radius: 5px;
`

const Notice = ({children}) => (
    <NoticeContainer>
        <strong>Note: </strong>{children}
    </NoticeContainer>
)

export default Notice