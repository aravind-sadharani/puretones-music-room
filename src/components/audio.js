import * as React from "react"
import styled from "styled-components"

const AudioContainer = styled.div`
    overflow-x: auto;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    margin: 0;
    text-align: center;
    padding: 12px;
    audio {
        margin-bottom: -0.4em;
    }
`

const Audio = ({src, caption}) => (
    <AudioContainer>
        <audio src={src} controls preload="auto">
            This browser does not support audio.
            <track default kind="captions" srclang="en" src={caption}></track>
        </audio>
    </AudioContainer>
)

export default Audio