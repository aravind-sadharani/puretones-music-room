import * as React from "react"
import styled from "styled-components"
import { Link } from 'gatsby'
import { media } from 'utils/mediatemplate'
import PostGraphic from "components/postgraphic"

const PostPreviewContainer = styled.div`
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
    margin: 0 0 1em 0;
    display: grid;
    grid-template-columns: 3fr 2fr;
    align-items: center;
    ${media.phone`grid-template-columns: 1fr`}
    a {
        color: inherit;
        font-weight: inherit;
    }
`

const PostExcerpt = styled.div`
    padding: 12px;
    ${media.phone`padding: 12px 12px 0 12px;`}
`

const PostTitle = styled.h3`
    margin: 0 0 1em 0;
`

const PostMedia = styled.div`
    padding: 12px;
    border-radius: 5px;
`

const PostPreview = ({title,description,url}) => (
    <PostPreviewContainer>
        <Link to={url}>
            <PostExcerpt>
                <PostTitle>{title}</PostTitle>
                {description.length > 185 ? `${description.slice(0,185)}...` : description}
            </PostExcerpt>
        </Link>
        <Link to={url}>
            <PostMedia>
                <PostGraphic title={title}/>
            </PostMedia>
        </Link>
    </PostPreviewContainer>
)

export default PostPreview