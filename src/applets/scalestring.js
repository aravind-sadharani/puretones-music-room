import * as React from "react"
import Slider from "../components/slider"

const fineTuneParams = {
    key: "Fine Tune",
    init: 0,
    max: 120,
    min: -120,
    step: 1
}
const ultraFineTuneParams = {
    key: "Ultrafine Tune",
    init: 0,
    max: 100,
    min: -100,
    step: 1
}
const varianceParams = {
    key: "Variance",
    init: 2,
    max: 4,
    min: 0,
    step: 0.1
}

const ScaleString = ({title}) => {
    return (
        <>
            <p><strong>{`${title} Parameters`}</strong></p>
            <br />
            <Slider params={fineTuneParams}></Slider>
            <Slider params={ultraFineTuneParams}></Slider>
            <Slider params={varianceParams}></Slider>
        </>
    )
}

export default ScaleString