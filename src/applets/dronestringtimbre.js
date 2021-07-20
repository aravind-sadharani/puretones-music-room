import * as React from "react"
import Slider from "../components/slider"

const timbreSliderList = ['Octave 1', 'Octave 2', 'Octave 3', 'Octave 4', 'Octave 5', 'Octave 6']

const TimbreSliderElements = ({timbreState,basePath,onParamUpdate}) => (
    timbreSliderList.map((s) => {
        let lastPath = s.replace(' ','_')
        let timbreSliderParams = {
            init: Number(timbreState[`${basePath}/${lastPath}`]),
            max: 10,
            min: 0,
            step: 0.1
        }
        timbreSliderParams.key = s
        return (
            <Slider key={`${lastPath}_timbre_${s}`} params={timbreSliderParams} path={`${basePath}/${lastPath}`} onParamUpdate={(value,path) => onParamUpdate(value,path)}></Slider>
        )
    })
)

const DroneStringTimbre = ({title,timbreState,basePath,onParamUpdate}) => (
    <>
        <p><strong>{`${title} Timbre`}</strong></p>
        <br />
        <TimbreSliderElements timbreState={timbreState} basePath={basePath} onParamUpdate={(value,path) => onParamUpdate(value,path)}/>
    </>
)

export default DroneStringTimbre