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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const ChartContainer = styled.div`
    padding: 12px 12px 0 12px;
    margin: 0 0 1em 0;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
    canvas {
        max-height: 600px;
        margin-bottom: 1em;
    }
`

const chartOptions = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    responsive: true,
    scales: {
        yAxes: {
            title: {
                display: true,
                text: 'Sa     re       Re      ga      Ga     ma      Ma     Pa     dha     Dha     ni        Ni     SA',
                font: {
                    size: 15,
                }
            }
        },
        xAxes: {
            title: {
                display: true,
                text: 'Signal-to-Noise Ratio (dB)',
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

const DroneAnalysisChart = ({pitches,scaleName,droneName}) => {
    let pitchList = [...pitches]
    pitchList.sort((tone1, tone2) => tone2.ratio - tone1.ratio)
    let pitchData = {
        labels: pitchList.map(pitch => (2**(pitch.ratio/1200)).toFixed(5)),
        datasets: [
            {
                label: `${scaleName} Scale`,
                data: pitchList.map((pitch) => pitch.refAmplitude),
                backgroundColor: '#5c5c85',
                barThickness: 1,
            },
            {
                label: `${droneName} Drone`,
                data: pitchList.map((pitch) => pitch.amplitude),
                backgroundColor: '#f98ca4',
                barThickness: 1,
            },
        ],
    }
    return (
        <ChartContainer>
            <p><strong>Analysis Results</strong></p>
            <Bar options={chartOptions} data={pitchData} />
        </ChartContainer>
    )
}

export default DroneAnalysisChart