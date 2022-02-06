import * as React from "react"
import styled from "styled-components"

const SliderContainer = styled.div`
    padding: 0 0 1em 0;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
`

const SliderRange = styled.input`
    grid-column-start: 1;
    grid-column-end: 3;
    display: block;
    margin: 15px auto 5px;
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 10px;
    border-radius: 5px;
    background-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.borderColor};`}
    -webkit-transition: .2s;
    transition: opacity .2s;
    ::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background-color: ${({theme}) => theme.light.linkColor};
        ${({theme}) => theme.isDark`background-color: ${theme.dark.linkColor};`}
        cursor: pointer;
    }
    ::-moz-range-thumb {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background-color: ${({theme}) => theme.light.linkColor};
        ${({theme}) => theme.isDark`background-color: ${theme.dark.linkColor};`}
        cursor: pointer;
    }
`

const SliderNumber = styled.input`
    -webkit-appearance: none;
    appearance: none;
    padding: 0 6px;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    background-color: ${({theme}) => theme.light.bodyBackground};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.bodyBackground};`}
    color: ${({theme}) => theme.light.textColor};
    ${({theme}) => theme.isDark`color: ${theme.dark.textColor};`}
    border-radius: 5px;
    margin: 0 0 0 auto;
    width: 120px;
`

const SliderKey = styled.span`
`

const Slider = ({params,path,onParamUpdate}) =>  {
    const changeValue = (value) => {
        let sanitizedValue = value === '' ? 0 : value
        onParamUpdate(sanitizedValue, path)
    }
    let {key,max,min,step,init} = params
    init = Math.floor(step) ? Number(init).toFixed(0) : Number(init).toFixed(1)
    return (
        <SliderContainer>
            <SliderKey>{key}</SliderKey>
            <SliderNumber type="number" value={init} onChange={(e) => changeValue(e.target.value)}></SliderNumber>
            <SliderRange type="range" min={min} max={max} step={step} value={init} onChange={(e) => changeValue(e.target.value)}></SliderRange>
        </SliderContainer>
    )
}

export default Slider