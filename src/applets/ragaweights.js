import * as React from 'react'
import styled from 'styled-components'

const RagaWeightsContainer = styled.div`
    margin: 0 0 1em 0;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
    display: grid;
    grid-template-columns: repeat(16,1fr);
    font-size: 0.7em;
`

const RagaWeightCell = styled.span`
    padding: 1px;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    grid-column: auto / span 1;
`

const RagaWeightLabel = styled.span`
    padding: 1px;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    grid-column: auto / span 1;
`

const RagaWeights = ({scale,weights}) => {
    let {startWeights,linkWeights,endWeights} = weights
    let localStartWeights = [...startWeights]
    for(let i=localStartWeights.length-1; i>0; i--) {
        localStartWeights[i] -= localStartWeights[i-1]
    }
    let localLinkWeights = [...linkWeights.map(originLinkWeights => [...originLinkWeights])]
    for(let i=0; i<localLinkWeights.length; i++) {
        for(let j=localLinkWeights[i].length-1; j>0; j--) {
            localLinkWeights[i][j] -= localLinkWeights[i][j-1]
        }
    }
    let localEndWeights = [...endWeights]
    for(let i=localEndWeights.length-1; i>0; i--) {
        localEndWeights[i] -= localEndWeights[i-1]
    }
    const headerlabels = ['Notes', ...scale.map(note => note[0]), ...scale.map(note => `${note[0]}"`), 'SA"']
    const HeaderRow = () => (
        headerlabels.map((label,index) => <RagaWeightLabel key={index}>{label}</RagaWeightLabel>)
    )
    const Row = ({label,data}) => {
        let dataCells = data.map((datum,index) => <RagaWeightCell key={`${index}${datum.toFixed(2)}`}>{datum.toFixed(2)}</RagaWeightCell>)
        return (
            <>
                <RagaWeightLabel>{label}</RagaWeightLabel>
                {dataCells}
            </>
        )
    }
    const linkRows = localLinkWeights.map((originLinkWeights,index) => {
        let label
        if(index < scale.length)
            label = scale[index][0]
        else if(index < 2*scale.length)
            label = `${scale[index - scale.length][0]}"`
        else
            label = 'SA"'
        return (
            <Row label={label} key={label} data={originLinkWeights} />
        )
    })
    return (
        <RagaWeightsContainer>
            <HeaderRow />
            <Row label='Start' data={localStartWeights} />
            {linkRows}
            <Row label='End' data={localEndWeights} />
        </RagaWeightsContainer>
    )
}

export default RagaWeights