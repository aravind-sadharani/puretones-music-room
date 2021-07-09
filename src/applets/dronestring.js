import * as React from "react"
import Selector from "../components/selector"
import Slider from "../components/slider"

let stringSelectParams = {
    key: "Note",
    default: 12,
    options: [
      {
        value: "12",
        text: "Sa"
      },
      {
        value: "11",
        text: "re"
      },
      {
        value: "10",
        text: "Re"
      },
      {
        value: "9",
        text: "ga"
      },
      {
        value: "8",
        text: "Ga"
      },
      {
        value: "7",
        text: "ma"
      },
      {
        value: "6",
        text: "Ma"
      },
      {
        value: "5",
        text: "Pa"
      },
      {
        value: "4",
        text: "dha"
      },
      {
        value: "3",
        text: "Dha"
      },
      {
        value: "2",
        text: "ni"
      },
      {
        value: "1",
        text: "Ni"
      },
      {
        value: "0",
        text: "SA"
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
const varianceParams = {
    key: "Variance",
    init: 5,
    max: 10,
    min: 0,
    step: 0.1
}
const gainParams = {
    key: "Gain",
    init: 0,
    max: 20,
    min: -20,
    step: 0.1
}

const DroneString = ({title,note}) => {
    stringSelectParams.default = note
    return (
        <>
            <p><strong>{`${title} Parameters`}</strong></p>
            <br />
            <Selector params={stringSelectParams}></Selector>
            <Slider params={fineTuneParams}></Slider>
            <Slider params={ultraFineTuneParams}></Slider>
            <Slider params={varianceParams}></Slider>
            <Slider params={gainParams}></Slider>
        </>
    )
}

export default DroneString