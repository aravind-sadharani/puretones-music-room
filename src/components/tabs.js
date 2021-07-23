import * as React from "react"
import styled from "styled-components"

const TabBarElement = styled.div`
    margin: 0 12px;
    overflow: hidden;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    background-color: #e6e6eb;
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
    &:hover {
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        background-color: #333366;
        color: white;
        font-weight: bold;
        opacity: 0.8;
    }
    &.active {
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        background-color: #333366;
        color: white;
        font-weight: bold;
    }
`

const TabPageElement = styled.div`
    display: none;
    margin: 0 12px 12px;
    padding: 12px 0 0 0;
    border: 1px solid #e6e6eb;
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
            <TabElement className={active} key={`tab_${s}`} id={`tab_${s}`} onClick={(e) => activateTab(e)}>{s}</TabElement>
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