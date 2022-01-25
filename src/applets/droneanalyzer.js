import * as React from 'react'
import styled from 'styled-components'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import Button from 'components/button'
import SaveRestore from 'components/saverestore'
import {analyzeDrone} from 'utils/analyzedrone'
import {dspStateFromSettings} from 'utils/dspsettingsinterpreter'
import dronePRT from 'data/default.prt'
import scalePKB from 'data/default.pkb'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const DroneAnalyzerContainer = styled.div`
    padding: 12px 12px 0 12px;
    margin: 0 0 1em 0;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
`

const ChartContainer = styled(DroneAnalyzerContainer)`
    canvas {
        max-height: 900px;
        margin-bottom: 1em;
    }
`

const DroneAnalyzerResultElement = styled.pre`
    margin: 0 0 1em 0;
    overflow-x: scroll;
`

const chartOptions = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    responsive: true,
    scales: {
        yAxes: {
            title: {
                display: true,
                text: 'Ratio',
                font: {
                    size: 15,
                }
            }
        },
        xAxes: {
            title: {
                display: true,
                text: 'Count',
                font: {
                    size: 15,
                }  
            }
        },
    },
    plugins: {
        legend: {
            display: true,
            position: 'top',
        },
        title: {
            display: false,
            text: 'Drone Analysis',
        }
    },
}

const DroneAnalyzer = () => {
    let defaultDroneState = dspStateFromSettings('drone', dronePRT)
    let defaultScaleState = dspStateFromSettings('scale', scalePKB)
    const [droneState,setDroneState] = React.useState(defaultDroneState)
    const [scaleState,setScaleState] = React.useState(defaultScaleState)
    const [droneFilename,setDroneFilename] = React.useState("")
    const [scaleFilename,setScaleFilename] = React.useState("")

    const [droneAnalysis,setDroneAnalysis] = React.useState({status: false, message: ""})
    const [dronePitches,setDronePitches] = React.useState({})

    const restoreDrone = (dronesnapshot,dronefilename) => {
        let droneState = dspStateFromSettings('drone',dronesnapshot)
        setDroneFilename(dronefilename.replace('.prt',''))
        setDroneState({...droneState})
    }

    const restoreScale = (scalesnapshot,scalefilename) => {
        let scaleState = dspStateFromSettings('scale',scalesnapshot)
        setScaleFilename(scalefilename.replace('.pkb',''))
        setScaleState({...scaleState})
    }

    const analyze = () => {
        let result = analyzeDrone(droneState,scaleState)

        setDroneAnalysis({status: result.status, message: result.message})
        setDronePitches({
            labels: result.pitches.map((pitch) => (2**(pitch.ratio/1200)).toFixed(5)),
            datasets: [
                {
                    label: `${droneFilename || 'Standard'} Drone`,
                    data: result.pitches.map((pitch) => pitch.count),
                    backgroundColor: '#f98ca4',
                },
                {
                    label: `${scaleFilename || 'Standard'} Scale`,
                    data: result.pitches.map((pitch) => pitch.stdCount),
                    backgroundColor: '#5c5c85',
                    barThickness: 2,
                },
            ],
        })
    }

    return (
        <>
            <DroneAnalyzerContainer>
                <p><strong>Drone Analyzer</strong></p>
                <DroneAnalyzerContainer>
                    <p><strong>Configure Drone</strong></p>
                    <p>Upload a drone tuning {droneFilename !== '' ? `or keep using〝${droneFilename}〞drone` : 'or use the standard drone'}</p>
                    <center>
                        <SaveRestore extn='prt' restore={restoreDrone} restoretitle='Load Drone' />
                    </center>
                    <p></p>
                </DroneAnalyzerContainer>
                <DroneAnalyzerContainer>
                    <p><strong>Configure Scale</strong></p>
                    <p>Upload a scale tuning {scaleFilename !== '' ? `or keep using〝${scaleFilename}〞scale` : 'or use the standard scale'}</p>
                    <center>
                        <SaveRestore extn='pkb' restore={restoreScale} restoretitle='Load Scale' />
                    </center>
                    <p></p>
                </DroneAnalyzerContainer>
                <p>Press Analyze to view the results.</p>
                <center>
                    <Button onClick={() => analyze()}>Analyze</Button>
                </center>
                <p></p>
            </DroneAnalyzerContainer>
            {droneAnalysis.status && <ChartContainer>
                <p><strong>Analysis Results</strong></p>
                <Bar options={chartOptions} data={dronePitches} />
            </ChartContainer>}
            {droneAnalysis.message !== '' && <DroneAnalyzerContainer>
                <p><strong>Detailed Results</strong></p>
                <DroneAnalyzerResultElement>
                        <code>
                            {droneAnalysis.message}
                        </code>
                </DroneAnalyzerResultElement>
            </DroneAnalyzerContainer>}
        </>
    )
}

export default DroneAnalyzer