import * as React from "react"
import Slider from "../components/slider"

const ScaleString = ({title,stringState,basePath,onParamUpdate}) => {
    const fineTuneParams = {
        key: "Fine Tune",
        init: Number(stringState[`${basePath}/Cent`]),
        max: 120,
        min: -120,
        step: 1
    }
    const ultraFineTuneParams = {
        key: "Ultrafine Tune",
        init: Number(stringState[`${basePath}/0.01_Cent`]),
        max: 100,
        min: -100,
        step: 1
    }    
    return (
        <>
            <p><strong>{`${title} Parameters`}</strong></p>
            <br />
            <Slider params={fineTuneParams} path={`${basePath}/Cent`} onParamUpdate={onParamUpdate}></Slider>
            <Slider params={ultraFineTuneParams} path={`${basePath}/0.01_Cent`} onParamUpdate={onParamUpdate}></Slider>
        </>
    )
}

export default ScaleString