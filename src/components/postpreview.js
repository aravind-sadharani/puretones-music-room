import * as React from "react"
import styled from "styled-components"
import { Link } from 'gatsby'
import { media } from 'utils/mediatemplate'

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

const PostMedia = styled.div`
    padding: 12px;
    border-radius: 5px;
`

const PostGraphic = ({title}) => (
    <svg>
        <text x="0" y="80" transform="rotate(-30 150,30)">Graphic for {title}</text>
    </svg>
)

const PostPreview = ({title,description,image,url}) => (
    <PostPreviewContainer>
        <Link to={url}>
            <PostExcerpt>
                <h4>{title}</h4>
                {description}
            </PostExcerpt>
        </Link>
        <Link to={url}>
            <PostMedia>
                <PostGraphic title={title}/>
                {image}
            </PostMedia>
        </Link>
    </PostPreviewContainer>
)

export default PostPreview