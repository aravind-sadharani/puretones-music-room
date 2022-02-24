import * as React from 'react'
import styled from 'styled-components'

const TuningHintsContainer = styled.div`
    padding: 12px 12px 0 12px;
    margin: 0 0 1em 0;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
`

const TuningHintsElement = styled.pre`
    margin: 0 0 1em 0;
    overflow-x: scroll;
`

const TuningHints = ({tuning,scaleNotes,droneStrings}) => {
    let hints = ''
    droneStrings.forEach((stringName,stringIndex) => {
        hints = `${hints}String ${stringName[0]} Tunings:\nScale Note\tTuning\t\t\tAmplitude\tCurrent Amplitude\n`
        scaleNotes.forEach((noteName,noteIndex) => {
            let tune = tuning[noteIndex][stringIndex]
            hints = `${hints}${noteName}\t\t(${tune.min.toFixed(2)},${tune.max.toFixed(2)})\t\t${tune.amplitude.toFixed(2)} dB\t${tune.currentAmplitude.toFixed(2)} dB\n`
        })
    })
    return (
        <TuningHintsContainer>
            <TuningHintsElement>
                <code>{hints}</code>
            </TuningHintsElement>
        </TuningHintsContainer>
    )
}

export default TuningHints