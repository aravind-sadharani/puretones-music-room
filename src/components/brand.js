import * as React from 'react'
import styled from 'styled-components'
import PureTonesLogo from 'images/puretones-logo-small.inline.svg'

const BrandContainer = styled.div`
    text-align: right;
    margin: 0 0 8px 0;
    svg {
        position: relative;
        top: 2px;
        margin: 0 1px 0 3px;
    }
`

const Brand = () => (
    <BrandContainer>Powered by <a href='https://puretones.sadharani.com'>PureTones<PureTonesLogo /></a></BrandContainer>
)

export default Brand