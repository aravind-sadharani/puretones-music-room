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
import TabNav from "components/tabs"
import Selector from "components/selector"
import Slider from "components/slider"
import Button from 'components/button'
import {analyzeDrone} from 'utils/analyzedrone'

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

const DroneAnalyzerResultElement = styled.pre`
    margin: 0 0 1em 0;
    overflow-x: scroll;
`

const chartOptions = {
    responsive: true,
    scales: {
        yAxes: {
            title: {
                display: true,
                text: 'Count',
                font: {
                    size: 15,
                }
            }
        },
        xAxes: {
            title: {
                display: true,
                text: 'Ratio',
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

const stringSelectParams = {
    key: "Note",
    options: [
      {
        value: "0",
        text: "SA"
      },
      {
        value: "1",
        text: "Ni"
      },
      {
        value: "2",
        text: "ni"
      },
      {
        value: "3",
        text: "Dha"
      },
      {
        value: "4",
        text: "dha"
      },
      {
        value: "5",
        text: "Pa"
      },
      {
        value: "6",
        text: "Ma"
      },
      {
        value: "7",
        text: "ma"
      },
      {
        value: "8",
        text: "Ga"
      },
      {
        value: "9",
        text: "ga"
      },
      {
        value: "10",
        text: "Re"
      },
      {
        value: "11",
        text: "re"
      },
      {
        value: "12",
        text: "Sa"
      }
    ]
}

const fineTuneParams = {
    key: "Fine Tune",
    init: 0,
    max: 100,
    min: -100,
    step: 1
}

const ultraFineTuneParams = {
    key: "Ultrafine Tune",
    init: 0,
    max: 100,
    min: -100,
    step: 1
}

const DroneAnalyzer = () => {
    const [droneState,setDroneState] = React.useState({
        strings: [
            {
                value: 5,
                finetune: 0,
                ultrafinetune: 0,
            },
            {
                value: 0,
                finetune: 0,
                ultrafinetune: 0,
            },
            {
                value: 12,
                finetune: 0,
                ultrafinetune: 0,
            }
        ]
    })

    const onDroneStateChange = (value,path) => {
        let newStrings = droneState.strings
        if(path.includes('select')) {
            newStrings[Number(path.replace("select",""))].value = Number(value)
        } else if(path.includes('fine')) {
            newStrings[Number(path.replace("fine",""))].finetune = Number(value)
        } else if(path.includes('ultra')) {
            newStrings[Number(path.replace("ultra",""))].ultrafinetune = Number(value)
        }
        setDroneState({strings: newStrings})
    }

    const stringTabs = ['String 1', 'String 2', 'String 3']

    const stringConfig = droneState.strings.map((string,index) => {
        const selectorParams = {...stringSelectParams,
            default: `${string.value}`,
        }
        const fineParams = {...fineTuneParams,
            init: `${string.finetune}`,
        }
        const ultraFineParams = {...ultraFineTuneParams,
            init: `${string.ultrafinetune}`,
        }
        let path = `${index}`
        return (
            <>
                <Selector params={selectorParams} path={`select${path}`} onParamUpdate={onDroneStateChange} />
                <Slider params={fineParams} path={`fine${path}`} onParamUpdate={onDroneStateChange} />
                <Slider params={ultraFineParams} path={`ultra${path}`} onParamUpdate={onDroneStateChange} />
            </>
        )
    })

    const [droneAnalysis,setDroneAnalysis] = React.useState({status: false, message: ""})
    const [dronePitches,setDronePitches] = React.useState({})

    const analyze = () => {
        let result = analyzeDrone(droneState.strings)

        setDroneAnalysis({status: result.status, message: result.message})
        setDronePitches({
            labels: result.pitches.map((pitch) => (2**(pitch.ratio/1200)).toFixed(5)),
            datasets: [
                {
                    label: 'Standard Pitches',
                    data: result.pitches.map((pitch) => pitch.stdCount),
                    backgroundColor: '#5c5c85',
                    barThickness: 2,
                },
                {
                    label: 'Generated Pitches',
                    data: result.pitches.map((pitch) => pitch.count),
                    backgroundColor: '#f98ca4',
                },
            ],
        })
    }

    return (
        <>
            <DroneAnalyzerContainer>
                <p><strong>Drone Analyzer</strong></p>
                <TabNav tablist={stringTabs} pagelist={stringConfig} />
                <center>
                    <Button onClick={() => analyze()}>Analyze</Button>
                </center>
            </DroneAnalyzerContainer>
            {droneAnalysis.status && <DroneAnalyzerContainer>
                <p><strong>Pitches Generated by the Drone</strong></p>
                <Bar options={chartOptions} data={dronePitches} />
            </DroneAnalyzerContainer>}
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