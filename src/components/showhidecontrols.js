import * as React from "react"
import styled from "styled-components"

const ShowHideContainer = styled.div`
    padding: 0 0 12px 0;
    margin: 0 12px;
    display: grid;
    grid-template-columns: 1fr 1fr;
`

const ShowHideKey = styled.span`
`

const ShowHideButton = styled.button`
    padding: 0 6px;
    border-color: #e6e6eb;
    outline-color: #333366;
    -webkit-appearance: none;
    background-color: #e6e6eb;
    border: 0;
    border-radius: 5px;
    margin: 0 0 0 auto;
    width: 120px;
    &:hover {
        background-color: #333366;
        color: white;
        font-weight: 700;
        opacity: 0.8;
    }
    &.active {
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
        background-color: #333366;
        color: white;
        font-weight: 700;
    }
`

const ShowHideChildren = styled.div`
    display: none;
    margin: 0;
    padding: 0px 0px;
    border: 1px solid #e6e6eb;
    border-top-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    grid-template-columns: 1fr 1fr;
    &.active{
        display: block;
    }
    grid-column-start: 1;
    grid-column-end: 3;
`

class ShowHideControls extends React.Component {
    constructor(props) {
        super(props)
        this.state = {visibility: false}
    }

    showhide = () => this.setState({visibility: !(this.state.visibility)})

    render = () => {
        let children = this.props.children
        let active = this.state.visibility ? "active" : ""
        let label = this.state.visibility ? "Hide" : "Show"
        if (this.props.label)
            label = this.state.visibility ? this.props.label.inactive : this.props.label.active
        let title = this.props.title
        return (
            <ShowHideContainer>
                <ShowHideKey>{title}</ShowHideKey>
                <ShowHideButton className={active} onClick={() => this.showhide()}>{label}</ShowHideButton>
                <ShowHideChildren className={active}>
                    {children}
                </ShowHideChildren>
            </ShowHideContainer>
        )
    }
}

export default ShowHideControls