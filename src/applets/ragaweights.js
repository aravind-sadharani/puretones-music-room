import * as React from 'react'
import styled from 'styled-components'

const RagaWeightsContainer = styled.div`
    margin: 0 0 1em 0;
    display: grid;
    grid-template-columns: ${({grid}) => `repeat(${grid},1fr);`}
    font-size: 0.8em;
    border: 0.5px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
    input, span {
        width: 100%;
    }
    input:last-child {
        border-radius: 0 0 5px 0;
    }
    span:first-child {
        border-radius: 5px 0 0 0;
    }
    span:nth-child(${({grid}) => `${grid}`}) {
        border-radius: 0 5px 0 0;
    }
    span:nth-child(${({grid}) => `${grid*(grid+1)+1}`}) {
        border-radius: 0 0 0 5px;
    }
`

const RagaWeightCell = styled.input`
    -webkit-appearance: none;
    appearance: none;
    padding: 0 0 0 3px;
    font-weight: ${({highlight}) => highlight === true ? 700 : 400};
    border: 0.5px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    ${({highlight,theme}) => highlight === true ? `background-color: ${theme.light.chartBackground};` : `background-color: ${theme.light.bodyBackground};`}
    ${({highlight,theme}) => highlight === true ? theme.isDark`background-color: ${theme.dark.chartBackground};` : theme.isDark`background-color: ${theme.dark.bodyBackground};`}
    color: ${({theme}) => theme.light.textColor};
    ${({highlight,theme}) => highlight === true ? theme.isDark`color: ${theme.light.textColor};` : theme.isDark`color: ${theme.dark.textColor};`}
    border-radius: 0px;
`

const RagaWeightLabel = styled.span`
    padding: 0 0 0 3px;
    font-weight: ${({highlight}) => highlight === true ? 700 : 400};
    border: 0.5px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    ${({highlight,theme}) => highlight === true ? `background-color: ${theme.light.chartBackground};` : `background-color: ${theme.light.bodyBackground};`}
    ${({highlight,theme}) => highlight === true ? theme.isDark`background-color: ${theme.dark.chartBackground};` : theme.isDark`background-color: ${theme.dark.bodyBackground};`}
    color: ${({theme}) => theme.light.textColor};
    ${({highlight,theme}) => highlight === true ? theme.isDark`color: ${theme.light.textColor};` : theme.isDark`color: ${theme.dark.textColor};`}
    border-radius: 0px;
`

const Row = ({label,data,rowID,highlight,highlightIndex,onWeightChanged}) => {
    let dataCells = data.map((datum,index) => <RagaWeightCell key={`${index}${datum.toFixed(0)}`} highlight={index === highlightIndex} type="number" value={datum.toFixed(0)} onChange={e => onWeightChanged(e.target.value,rowID,index)}></RagaWeightCell>)
    return (
        <>
            <RagaWeightLabel highlight={highlight}>{label}</RagaWeightLabel>
            {dataCells}
        </>
    )
}

const HeaderRow = ({labels,start,end}) => (
    labels.map((label,index) => <RagaWeightLabel key={index} highlight={(index-1 === start) || (index-1 === end)}>{label}</RagaWeightLabel>)
)

const RagaWeights = ({scale,weights,phrase,onWeightChanged}) => {
    let {startWeights,linkWeights,endWeights} = weights

    const headerlabels = ['Note', ...scale.map(note => note[0]), ...scale.map(note => `${note[0]}"`), 'SA"']
    const linkRows = linkWeights.map((originLinkWeights,index) => {
        let label
        let found = phrase.findIndex(note => note === index)
        let highlight = found !== -1 && found < phrase.length-1
        if(index < scale.length)
            label = scale[index][0]
        else if(index < 2*scale.length)
            label = `${scale[index - scale.length][0]}"`
        else
            label = 'SA"'
        return (
            <Row label={label} key={label} data={originLinkWeights} rowID={index} highlight={highlight} highlightIndex={found !== -1 ? phrase[found+1] : -1} onWeightChanged={onWeightChanged} />
        )
    })
    return (
        <RagaWeightsContainer grid={2*scale.length+2}>
            <HeaderRow labels={headerlabels} start={phrase[0]} end={phrase[phrase.length-1]} />
            <Row label='Start' data={startWeights} rowID="-1" highlightIndex={phrase[0]} onWeightChanged={onWeightChanged} />
            {linkRows}
            <Row label='End' data={endWeights} rowId="-2" highlightIndex={phrase[phrase.length-1]} onWeightChanged={onWeightChanged} />
        </RagaWeightsContainer>
    )
}

export default RagaWeights