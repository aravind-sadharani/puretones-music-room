import * as React from "react"
import styled from "styled-components"
import { Link } from 'gatsby'
import { media } from 'utils/mediatemplate'

const PostLinksContainer = styled.div`
    margin: 2em 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    ${media.phone`grid-template-columns: 1fr;`}
`

const PostLinksTitle = styled.h3`
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

const PostLinks = ({prev,next}) => (
    <PostLinksContainer>
        {(prev || next) && <PostLinksTitle>Read more</PostLinksTitle>}
        {prev !== null && <LeftLink><Link to={prev.url}>◀︎ {prev.title}</Link></LeftLink>}
        {next !== null && <RightLink><Link to={next.url}>{next.title} ►</Link></RightLink>}
    </PostLinksContainer>
)

export default PostLinks