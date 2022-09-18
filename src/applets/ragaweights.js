import * as React from 'react'
import styled from 'styled-components'

const RagaWeightsContainer = styled.div`
    margin: 0 0 1em 0;
    border: 0;
    display: grid;
    grid-template-columns: repeat(16,1fr);
    font-size: 0.7em;
`

const RagaWeightCell = styled.input`
    -webkit-appearance: none;
    appearance: none;
    padding: 1px;
    max-width: 43px;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    background-color: ${({theme}) => theme.light.bodyBackground};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.bodyBackground};`}
    color: ${({theme}) => theme.light.textColor};
    ${({theme}) => theme.isDark`color: ${theme.dark.textColor};`}
    border-radius: 5px;
    grid-column: auto / span 1;
`

const RagaWeightLabel = styled.span`
    padding: 1px;
    border: 1px solid;
    font-weight: 700;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    background-color: ${({theme}) => theme.light.bodyBackground};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.bodyBackground};`}
    color: ${({theme}) => theme.light.textColor};
    ${({theme}) => theme.isDark`color: ${theme.dark.textColor};`}
    border-radius: 5px;
    grid-column: auto / span 1;
`

const RagaWeights = ({scale,weights,onWeightChanged}) => {
    let {startWeights,linkWeights,endWeights} = weights

    const headerlabels = ['Notes', ...scale.map(note => note[0]), ...scale.map(note => `${note[0]}"`), 'SA"']
    const HeaderRow = () => (
        headerlabels.map((label,index) => <RagaWeightLabel key={index}>{label}</RagaWeightLabel>)
    )
    const Row = ({label,data,rowID}) => {
        let dataCells = data.map((datum,index) => <RagaWeightCell key={`${index}${datum.toFixed(0)}`} type="number" value={datum.toFixed(0)} onChange={e => onWeightChanged(e.target.value,rowID,index)}></RagaWeightCell>)
        return (
            <>
                <RagaWeightLabel>{label}</RagaWeightLabel>
                {dataCells}
            </>
        )
    }
    const linkRows = linkWeights.map((originLinkWeights,index) => {
        let label
        if(index < scale.length)
            label = scale[index][0]
        else if(index < 2*scale.length)
            label = `${scale[index - scale.length][0]}"`
        else
            label = 'SA"'
        return (
            <Row label={label} key={label} data={originLinkWeights} rowID={index}/>
        )
    })
    return (
        <RagaWeightsContainer>
            <HeaderRow />
            <Row label='Start' data={startWeights} rowID="-1" />
            {linkRows}
            <Row label='End' data={endWeights} rowId="-2" />
        </RagaWeightsContainer>
    )
}

export default RagaWeights