import * as React from 'react'
import styled from 'styled-components'

const PureTonesEmbedContainer = styled.div`
`

const PureTonesEmbed = ({location}) => {
    let queryParameters = new URLSearchParams(location.search)
    console.log(queryParameters.get("hello"))
    return (
        <PureTonesEmbedContainer>
            <p>Embed</p>
        </PureTonesEmbedContainer>
    )
}

export default PureTonesEmbed