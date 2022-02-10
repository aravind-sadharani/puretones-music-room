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
import SaveRestore from 'components/saverestore'

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
`

const CanvasContainer = styled.div`
    position: relative;
    padding: 12px;
    height: 624px;
    width: 100%;
    border-radius: 5px;
    background-color: ${({theme}) => theme.light.chartBackground};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.chartBackground};`}
`

const DroneAnalysisChart = ({pitches,scaleName,droneName}) => {
    const chartOptions = {
        indexAxis: 'y',
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            yAxes: {
                title: {
                    display: true,
                    text: 'Sa     re        Re     ga       Ga    ma       Ma    Pa     dha     Dha     ni        Ni     SA',
                    font: {
                        size: 15,
                    }
                },
                min: -20,
                max: 1220,
                ticks : {
                    display: false,
                },
                grid: {
                    display: false,
                }
            },
            xAxes: {
                title: {
                    display: true,
                    text: 'Signal-to-Noise Ratio (dB)   ',
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
        animation: false,
    }
    let pitchList = [...pitches]
    pitchList.sort((tone1, tone2) => tone2.ratio - tone1.ratio)
    let pitchData = {
        labels: pitchList.map(pitch => pitch.ratio.toFixed(2)),
        datasets: [
            {
                label: `${scaleName} Scale`,
                data: pitchList.map((pitch) => pitch.refAmplitude),
                backgroundColor: 'rgb(92, 92, 133)',
                barThickness: 1,
            },
            {
                label: `${droneName} Drone`,
                data: pitchList.map((pitch) => pitch.amplitude),
                backgroundColor: 'rgb(237, 44, 89, 0.3)',
                barThickness: 1,
            },
        ],
    }

    const chartRef = React.useRef(null)
    const saveChart = () => chartRef.current.toBase64Image()

    return (
        <ChartContainer>
            <p><strong>Overall Levels of Drone and Scale Pitches</strong></p>
            <CanvasContainer>
                <Bar ref={chartRef} options={chartOptions} data={pitchData} />
            </CanvasContainer>
            <p></p>
            <center>
                <SaveRestore extn='png' save={saveChart} savetitle='Save Chart' />
            </center>
            <p></p>
        </ChartContainer>
    )
}

export default DroneAnalysisChart