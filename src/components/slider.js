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
    width: 100%;
    height: 10px;
    border-radius: 5px;  
    background: #e6e6eb;
    outline-color: #333366;
    -webkit-transition: .2s;
    transition: opacity .2s;
    ::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        border-radius: 50%; 
        background: #f76f8e;
        cursor: pointer;
    }
    ::-moz-range-thumb {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: #f76f8e;
        cursor: pointer;
    }
`

const SliderNumber = styled.input`
    -webkit-appearance: none;
    padding: 0 6px;
    outline-color: #333366;
    border: 1px solid #e6e6eb;
    border-radius: 5px;
    margin: 0 0 0 auto;
    width: 120px;
`

const SliderKey = styled.span`
`

const Slider = ({params,path,onParamUpdate}) =>  {
    const changeValue = (value) => onParamUpdate(value, path)
    let {key,max,min,step,init} = params
    init = typeof(init) === 'string' ? init.replace('.0','') : init
    return (
        <SliderContainer>
            <SliderKey>{key}</SliderKey>
            <SliderNumber type="number" value={init} onChange={(e) => changeValue(e.target.value)}></SliderNumber>
            <SliderRange type="range" min={min} max={max} step={step} value={init} onChange={(e) => changeValue(e.target.value)}></SliderRange>
        </SliderContainer>
    )
}

export default Slider