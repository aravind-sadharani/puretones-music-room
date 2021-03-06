import * as React from "react"
import styled from "styled-components"

const TabBarElement = styled.div`
    margin: 12px 0 0 0;
    overflow: hidden;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    background-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.borderColor};`}
    display: grid;
    grid-template-columns: repeat(${props => props.numtabs},1fr);
`

const TabElement = styled.button`
    background-color: inherit;
    float: left;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 4px 4px;
    transition: 0.3s;
    font-weight: normal;
    font-size: calc(min(${props => `${(130/(props.numtabs*Math.max(3,props.children.length))).toFixed(1)}vw`},1em));
    color: ${({theme}) => theme.light.textColor};
    ${({theme}) => theme.isDark`color: ${theme.dark.textColor};`}
    &:hover {
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        background-color: ${({theme}) => theme.light.buttonBackground};
        ${({theme}) => theme.isDark`background-color: ${theme.dark.buttonBackground};`}
        color: ${({theme}) => theme.light.buttonText};
        ${({theme}) => theme.isDark`color: ${theme.dark.buttonText};`}
        font-weight: bold;
        opacity: 0.8;
    }
    &.active {
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        background-color: ${({theme}) => theme.light.buttonBackground};
        ${({theme}) => theme.isDark`background-color: ${theme.dark.buttonBackground};`}
        color: ${({theme}) => theme.light.buttonText};
        ${({theme}) => theme.isDark`color: ${theme.dark.buttonText};`}
        font-weight: bold;
    }
`

const TabPageElement = styled.div`
    display: none;
    margin: 0 0 12px 0;
    padding: 12px 12px 0 12px;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-top: 0;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    grid-template-columns: 1fr 1fr;
    &.active{
        display: block;
    }
`

const TabNav = ({tablist,pagelist}) => {
    const [state,setState] = React.useState({activeTab: tablist[0], activePage: pagelist[0]})
    const activateTab = (e) => {
        let activeIndex = tablist.findIndex((s) => {
            let key = s.type ? s.type.name : s
            return `tab_${key}` === e.target.id
        })
        setState({activeTab: tablist[activeIndex], activePage: pagelist[activeIndex]})
    }
    let TabComponentList = tablist.map(s => {
        let active = (s === state.activeTab) ? "active" : ""
        return (
            <TabElement numtabs={tablist.length} className={active} key={`tab_${s}`} id={`tab_${s}`} onClick={(e) => activateTab(e)}>{s}</TabElement>
        )
    })
    let TabPageList = tablist.map((s,index) => {
        let active = (s === state.activeTab) ? "active" : ""
        let tabPage = pagelist[index]
        return (
            <TabPageElement className={active} key={`page_${s}`} id={`page_${s}`}>{tabPage}</TabPageElement>
        )
    })
    return (
        <>
            <TabBarElement numtabs={tablist.length}>
                {TabComponentList}
            </TabBarElement>
            {TabPageList}
        </>
    )
}

export default TabNav