import * as React from 'react'
import styled from 'styled-components'
import {media} from "utils/mediatemplate"
import FigCaption from 'components/figcaption'

const CardContainer = styled.div`
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    margin: 0;
    display: grid;
    grid-template-columns: 3fr 2fr;
    align-items: center;
    ${media.phone`grid-template-columns: 1fr`}
`

const CardDescription = styled.div`
    padding: 12px;
    ${media.phone`padding: 12px 12px 0 12px;`}
`

const CardMedia = styled.div`
    padding: 12px;
    border-radius: 5px;
`

const Card = ({title,description,media,caption}) => (
    <>
        <CardContainer>
            <CardDescription>
                <h4>{title}</h4>
                {description}
            </CardDescription>
            <CardMedia>
                {media}
            </CardMedia>
        </CardContainer>
        <FigCaption>{caption}</FigCaption>
    </>
)

export default Card