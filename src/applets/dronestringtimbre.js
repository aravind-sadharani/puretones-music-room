import * as React from "react"
import Slider from "../components/slider"

const timbreSliderList = ['Octave 1', 'Octave 2', 'Octave 3', 'Octave 4', 'Octave 5', 'Octave 6']

const TimbreSliderElements = ({title}) => (
    timbreSliderList.map((s) => {
        let timbreSliderParams = {
            init: 5,
            max: 10,
            min: 0,
            step: 0.1
        }
        timbreSliderParams.key = s
        return (
            <Slider key={`${title}_timbre_${s}`} params={timbreSliderParams}></Slider>
        )
    })
)

const DroneStringTimbre = ({title}) => (
    <>
        <br />
        <TimbreSliderElements title={title}/>
    </>
)

export default DroneStringTimbre