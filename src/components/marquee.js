import * as React from 'react'
import styled from 'styled-components'

const MarqueeElement = styled.blockquote`
    ${({width}) => width ? `width: ${width-4}ch;` : `width: 100%;`}
    font-size: 1em;
    margin: 0 0 6px 0;
    -moz-animation: marquee 10s linear infinite;
    -webkit-animation: marquee 10s linear infinite;
    animation: marquee 10s linear infinite;
`

const MarqueeContainer = styled.div`
    white-space: nowrap;
    overflow: hidden;
    @-moz-keyframes marquee {
        0%   { -moz-transform: translateX(50%); }
        100% { -moz-transform: translateX(-50%); }
    }

    @-webkit-keyframes marquee {
        0%   { -webkit-transform: translateX(50%); }
        100% { -webkit-transform: translateX(-50%); }
    }

    @keyframes marquee {
        0%   { 
            -moz-transform: translateX(50%);
            -webkit-transform: translateX(50%);
            transform: translateX(50%); 		
        }
        100% { 
            -moz-transform: translateX(-50%);
            -webkit-transform: translateX(-50%);
            transform: translateX(-50%); 
        }
    }
`

const Marquee = ({width,children}) => (
    <MarqueeContainer><MarqueeElement width={width}>{children}</MarqueeElement></MarqueeContainer>
)

export default Marquee