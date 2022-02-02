import * as React from 'react'
import styled from 'styled-components'
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js'
import { Bubble } from 'react-chartjs-2'

ChartJS.register(
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend
)

const SLICE = 100

const ChartContainer = styled.div`
    padding: 12px 12px 0 12px;
    margin: 0 0 1em 0;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
    canvas {
        max-width: 670px;
        max-height: 600px;
        margin-bottom: 1em;
    }
`

const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
        yAxes: {
            title: {
                display: true,
                text: 'Sa      re       Re     ga      Ga     ma     Ma     Pa     dha    Dha     ni        Ni     SA',
                font: {
                    size: 15,
                }
            },
            min: -20,
            max: 1220,
            ticks : {
                display: false,
            }
        },
        xAxes: {
            title: {
                display: true,
                text: 'Time (s)',
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

const TimeFreqAnalysisChart = ({pitches,duration,scaleName,droneName}) => {
    let pitchData = {
        datasets: [
            {
                label: `${scaleName} Scale`,
                data: [].concat.apply([],pitches.map((pitchList,i) => {
                    return pitchList.map(pitch => {
                        return ({
                            x: i*duration/SLICE,
                            y: pitch.ratio.toFixed(2),
                            r: pitch.refAmplitude !== 0 ? 3 : 0,
                        })
                    })
                })),
                borderColor: 'rgba(143,143,171)',
                backgroundColor: 'rgba(143,143,171,0.2)',
            },
            {
                label: `${droneName} Drone`,
                data: [].concat.apply([],pitches.map((pitchList,i) => {
                    return pitchList.map(pitch => {
                        return ({
                            x: i*duration/SLICE,
                            y: pitch.ratio.toFixed(2),
                            r: Math.floor(pitch.amplitude/20),
                        })
                    })
                })),
                backgroundColor: 'rgba(249,140,164,0.8)',
            },
        ],
    }
    return (
        <ChartContainer>
            <p><strong>Drone and Scale Pitches over time</strong></p>
            <Bubble options={chartOptions} data={pitchData} />
        </ChartContainer>
    )
}

export default TimeFreqAnalysisChart