import * as React from "react"
import styled from "styled-components"

const SelectContainer = styled.div`
    padding: 0 0 12px 0;
    margin: 0 2vmin;
    display: grid;
    grid-template-columns: 1fr 1fr;
`

const SelectElement = styled.select`
    padding: 0 6px;
    border-color: #e6e6eb;
    outline-color: #333366;
    -webkit-appearance: none;
    background-color: #e6e6eb;
    border-width: 1px;
    border-radius: 5px;
    margin: 0 0 0 auto;
    width: 120px;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><polygon points="0,0 4,6 8,0" style="fill:black"/></svg>');
    background-position-x: 120%;
    background-position-y: 55%;
    background-repeat: no-repeat;
    background-size: 2em;
    &:hover {
        background-color: #333366;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><polygon points="0,0 4,6 8,0" style="fill:white"/></svg>');
        color: white;
    }
`

const OptionElement = styled.option`
`

const SelectKey = styled.span`
`

class Selector extends React.Component {
    constructor(props) {
        super(props)
        this.state = {value: props.params.default}
    }

    changeValue = (value) => this.setState({value: value})

    render = () => {
        let {key,options} = this.props.params
        let OptionList = options.map(option => <OptionElement key={`key_${option.text}`} value={option.value}>{option.text}</OptionElement>)
        return (
            <SelectContainer>
                <SelectKey>{key}</SelectKey>
                <SelectElement value={this.state.value} onChange={(e) => this.changeValue(e.target.value)}>
                    {OptionList}
                </SelectElement>
            </SelectContainer>
        )
    }
}

export default Selector