import * as React from "react"
import styled from "styled-components"
import { Link } from 'gatsby'
import { media } from 'utils/mediatemplate'

const PostLinksContainer = styled.div`
    margin: 1em 0 0 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    ${media.phone`grid-template-columns: 1fr;`}
`

const PostLinksTitle = styled.h2`
    grid-column: 1 / 3;
`

const LeftLink = styled.span`
    padding: 0 0 1em 0;
    grid-column: 1 / 2;
`

const RightLink = styled.span`
    padding: 0 0 1em 0;
    text-align: right;
    grid-column: 2 / 3;
    ${media.phone`grid-column: 1 / 2;`}
`

const ArrowContainer = styled.svg`
    position: relative;
    top: 0.1em;
    height: 0.9em;
    fill: ${({theme}) => theme.light.linkColor};
    ${({theme}) => theme.isDark`fill: ${theme.dark.linkColor};`}
`

const LeftArrow = () => (
    <ArrowContainer viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="0,50 100,0 100,100" />
    </ArrowContainer>
)

const RightArrow = () => (
    <ArrowContainer viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="0,0 100,50 0,100" />
    </ArrowContainer>
)

const PostLinks = ({prev,next}) => (
    <PostLinksContainer>
        {(prev || next) && <PostLinksTitle>Read more</PostLinksTitle>}
        {prev !== null && <LeftLink><Link to={prev.url}><LeftArrow /> {prev.title}</Link></LeftLink>}
        {next !== null && <RightLink><Link to={next.url}>{next.title} <RightArrow /></Link></RightLink>}
    </PostLinksContainer>
)

export default PostLinks