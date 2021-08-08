import * as React from "react"
import styled from "styled-components"

const SelectContainer = styled.div`
    padding: 0 0 1em 0;
    margin: 0;
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

const Selector = ({params,path,onParamUpdate}) => {
    const [value,setValue] = React.useState(params.options[0].value)
    const changeValue = (value) => onParamUpdate(value, path)
    let {key,options} = params
    let OptionList = options.map(option => <OptionElement key={`key_${option.text}`} value={option.value}>{option.text}</OptionElement>)
    React.useEffect(() => {
        let value = typeof(params.default) === 'string' ? params.default.replace('.0','') : `${Number(params.default).toFixed(0)}`
        setValue(value)
    },[params])
    return (
        <SelectContainer>
            <SelectKey>{key}</SelectKey>
            <SelectElement value={value} onChange={(e) => changeValue(e.target.value)}>
                {OptionList}
            </SelectElement>
        </SelectContainer>
    )
}

export default Selector