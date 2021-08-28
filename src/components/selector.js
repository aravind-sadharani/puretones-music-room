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
    -webkit-appearance: none;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    background-color: ${({theme}) => theme.light.bodyBackground};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.bodyBackground};`}
    color: ${({theme}) => theme.light.textColor};
    ${({theme}) => theme.isDark`color: ${theme.dark.textColor};`}
    border-width: 1px;
    border-radius: 5px;
    margin: 0 0 0 auto;
    width: 120px;
    background-image: ${({theme}) => `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><polygon points="0,0 4,6 8,0" style="fill:${theme.light.textColor.replace('#','%23')}"/></svg>')`};
    ${({theme}) => theme.isDark`background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><polygon points="0,0 4,6 8,0" style="fill:${theme.dark.textColor.replace('#','%23')}"/></svg>')`};
    background-position-x: 120%;
    background-position-y: 55%;
    background-repeat: no-repeat;
    background-size: 2em;
    &:hover {
        background-color: ${({theme}) => theme.light.buttonBackground};
        background-image: ${({theme}) => `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><polygon points="0,0 4,6 8,0" style="fill:${theme.light.buttonText.replace('#','%23')}"/></svg>')`};
        color: ${({theme}) => theme.light.buttonText};
    }
    ${({theme}) => theme.isDark`&:hover {
        background-color: ${theme.dark.buttonBackground};
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><polygon points="0,0 4,6 8,0" style="fill:${theme.dark.buttonText.replace('#','%23')}"/></svg>');
        color: ${theme.dark.buttonText};
    }`}
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