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
import SaveRestore from 'components/saverestore'

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

const TimeFreqAnalysisChart = ({pitches,duration,scaleName,droneName,onComplete}) => {
    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            yAxes: {
                title: {
                    display: true,
                    text: 'Sa      re       Re     ga      Ga     ma      Ma    Pa    dha     Dha     ni        Ni     SA',
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
                    text: 'Time (s)       ',
                    font: {
                        size: 15,
                    }
                },
                min: 0,
                max: duration,
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
        animation: {
            onComplete: onComplete,
        }
    }
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
                borderColor: 'rgb(92, 92, 133)',
                backgroundColor: 'rgb(92, 92, 133, 0.2)',
            },
            {
                label: `${droneName} Drone`,
                data: [].concat.apply([],pitches.map((pitchList,i) => {
                    return pitchList.map(pitch => {
                        return ({
                            x: i*duration/SLICE,
                            y: pitch.ratio.toFixed(2),
                            r: Math.floor(pitch.amplitude/15),
                        })
                    })
                })),
                backgroundColor: 'rgb(237, 44, 89, 0.3)',
            },
        ],
    }

    const chartRef = React.useRef(null)
    const saveChart = () => chartRef.current.toBase64Image()

    return (
        <ChartContainer>
            <p><strong>Drone and Scale Pitches over time</strong></p>
            <CanvasContainer>
                <Bubble ref={chartRef} options={chartOptions} data={pitchData} />
            </CanvasContainer>
            <p></p>
            <center>
                <SaveRestore extn='png' save={saveChart} savetitle='Save Chart' />
            </center>
            <p></p>
        </ChartContainer>
    )
}

export default TimeFreqAnalysisChart