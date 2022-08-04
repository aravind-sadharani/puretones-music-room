import * as React from 'react'
import styled from 'styled-components'
import Marquee from 'components/marquee'
import Button from 'components/button'

const NowPlayingContainer = styled.div`
    position: fixed;
    bottom: 50px;
    ${({align}) => align === 'left' ? `left: 0;` : `right: 0;`}
    z-index: 111;
    padding: 12px;
    margin: 12px;
    width: calc(50vw - 18px);
    max-width: 240px;
    text-align: center;
    background-color: ${({theme}) => theme.light.bodyBackground};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.bodyBackground};`}
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
    box-shadow: 0px 2px 12px ${({theme}) => theme.light.textColor};
    ${({theme}) => theme.isDark`box-shadow: 0px 0px 12px ${theme.dark.codeBackground};`}
`

const NowPlaying = ({align,title,buttonText,active,onClick}) => {
    return (
        <NowPlayingContainer align={align}>
            <Marquee width={title.length}>{title}</Marquee>
            <Button active={active} onClick={onClick}>{buttonText}</Button>
        </NowPlayingContainer>
    )
}

export default NowPlaying