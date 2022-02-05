import * as React from "react"
import styled from "styled-components"
import { Link } from 'gatsby'
import PureTonesLogo from 'images/puretones-logo.inline.svg'
import { media } from 'utils/mediatemplate'

const navlinklist = [
    {path: '/app/', text: 'App'},
    {path: '/tools/', text: 'Tools'},
    {path: '/learn/', text: 'Learn'},
    {path: '/help/', text: 'Help'}
]  

const HeaderElement = styled.header`
    display: grid;
    grid-template-columns: 1fr repeat(4,80px);
    ${media.phone`grid-template-columns: repeat(4,1fr);`}
    ${media.phone`grid-template-rows: 1fr 50px;`}
    text-align: center;
    align-items: center;
    background-color: ${({theme}) => theme.light.buttonBackground};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.buttonBackground};`}
    border-radius: 5px;
    margin-bottom: 1em;
    padding: 0 12px;
    h1 {
        margin: 0;
        padding: 12px 0 14px;
        color: ${({theme}) => theme.light.linkColor};
        ${({theme}) => theme.isDark`color: ${theme.dark.linkColor};`}
        font-size: 2.5em;
        ${media.phone`grid-column: 1 / 5;`}
    }
    h1 a {
        color: inherit;
    }
    h1 svg {
        margin-right: 10px;
        margin-bottom: -10px;
        width: 79px;
        height: 48px;
        path {
            stroke: ${({theme}) => theme.light.linkColor};
            ${({theme}) => theme.isDark`stroke: ${theme.dark.linkColor};`}
        }
    }
`

const NavLinkElement = styled.span`
    padding: 8px 4px 4px 0;
    font-size: 1.5em;
    color: ${({theme}) => theme.light.linkColor};
    ${({theme}) => theme.isDark`color: ${theme.dark.linkColor};`}
    &.active, &:hover {
        font-size: 1.6em;
        font-weight: bold;
    }
    a {
        color: inherit;
        font-weight: inherit;
    }
`

const Header = ({location}) => {
    let NavLinkComponentList = navlinklist.map(s => {
        let active = (location && location.pathname === s.path) ? "active" : ""
        return (
            <NavLinkElement className={active} key={`nav_${s.path}`} id={`nav_${s.path}`}>
                <Link to={`${s.path}`}>{s.text}</Link>
            </NavLinkElement>
        )
    })
    return (
        <HeaderElement>
            <h1>
                <PureTonesLogo />
                <Link to="/">PureTones</Link>
            </h1>
            {NavLinkComponentList}
        </HeaderElement>
    )
}

export default Header