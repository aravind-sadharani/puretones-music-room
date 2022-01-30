import * as React from 'react'
import styled from 'styled-components'

const DroneAnalysisContainer = styled.div`
    padding: 12px 12px 0 12px;
    margin: 0 0 1em 0;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
`

const DroneAnalysisTableElement = styled.pre`
    margin: 0 0 1em 0;
    overflow-x: scroll;
`

const stringNames = ['1st_String', '2nd_String', '3rd_String', '4th_String', '5th_String', '6th_String']
const noteNames = ['SA','Ni','ni','Dha','dha','Pa','Ma','ma','Ga','ga','Re','re','Sa']

const DroneAnalysisTable = ({pitches,droneState}) => {
    let stringConfig = stringNames.map(name => {
        let basePath = `/FaustDSP/PureTones_v1.0/0x00/${name}`
        return ({
            value: Number(droneState[`${basePath}/Select_Note`]),
            finetune: Number(droneState[`${basePath}/Fine_Tune`]),
            ultrafinetune: Number(droneState[`${basePath}/Ultrafine_Tune`]),
        })
    })

    let message = `Drone Analysis with ${stringConfig.length} strings tuned as\n  ${stringConfig.map((s,i) => `${noteNames[s.value]} (${Number(s.finetune) + Number(s.ultrafinetune)/100})${(i+1) % 3 === 0 ? '\n  ' : ', '}`).join('')}\n`

    if(pitches.length !== 0) {
        let pitchList = [...pitches]
        pitchList.sort((tone1, tone2) => tone2.amplitude - tone1.amplitude)
        let pitchHeader = '  Ratio\t\tCents    \tSNR (in dB)\n'
        let pitchDetails = pitchList.filter(tone => tone.amplitude > 0).map(tone => `  ${(2**(tone.ratio/1200)).toFixed(5)}\t${' '.repeat(7-tone.ratio.toFixed(2).length)}${tone.ratio.toFixed(2)} ¢\t${' '.repeat(6-tone.amplitude.toFixed(2).length)}${tone.amplitude.toFixed(2)} dB`).join('\n')
    
        message = `${message}${pitchHeader}${pitchDetails}`
    } else
        message = ''

    return (
        <DroneAnalysisContainer>
            <p><strong>Detailed Results</strong></p>
            <DroneAnalysisTableElement>
                <code>{message}</code>
            </DroneAnalysisTableElement>
        </DroneAnalysisContainer>
    )
}

export default DroneAnalysisTable