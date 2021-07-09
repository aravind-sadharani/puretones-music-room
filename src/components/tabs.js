import * as React from "react"
import styled from "styled-components"

const TabBarElement = styled.div`
    margin: 0 2vmin;
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
    margin: 0 2vmin;
    padding: 6px 12px;
    border: 1px solid #e6e6eb;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    grid-template-columns: 1fr 1fr;
    &.active{
        display: block;
    }
`

class TabNav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {activeTab: props.tablist[0], activePage: props.pagelist[0]}
    }

    activateTab = (e) => {
        let activeIndex = this.props.tablist.findIndex((s) => {
            let key = s.type ? s.type.name : s
            return `tab_${key}` === e.target.id
        })
        this.setState({activeTab: this.props.tablist[activeIndex], activePage: this.props.pagelist[activeIndex]})
    }

    render() {
        let tablist = this.props.tablist
        let TabComponentList = tablist.map(s => {
            let active = (s === this.state.activeTab) ? "active" : ""
            return (
                <TabElement className={active} key={`tab_${s}`} id={`tab_${s}`} onClick={(e) => this.activateTab(e)}>{s}</TabElement>
            )
        })
        let pagelist = this.props.pagelist
        let TabPageList = tablist.map((s,index) => {
            let active = (s === this.state.activeTab) ? "active" : ""
            let tabPage = pagelist[index]
            return (
                <TabPageElement className={active} key={`page_${s}`} id={`page_${s}`}>{tabPage}</TabPageElement>
            )
        })
        return(
            <>
                <TabBarElement numtabs={tablist.length}>
                    {TabComponentList}
                </TabBarElement>
                {TabPageList}
            </>
        )
    }
}

export default TabNav