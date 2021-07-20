import * as React from "react"
import Selector from "../components/selector"
import Slider from "../components/slider"
import ShowHideControls from "../components/showhidecontrols"
import DroneStringTimbre from "./dronestringtimbre"
import Toggle from "../components/toggle"

const DroneString = ({title,stringState,basePath,onParamUpdate}) => {
    let stringSelectParams = {
      key: "Note",
      default: Number(stringState[`${basePath}/Select_Note`]),
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
    let fineTuneParams = {
        key: "Fine Tune",
        init: Number(stringState[`${basePath}/Fine_Tune`]),
        max: 100,
        min: -100,
        step: 1
    }
    let ultraFineTuneParams = {
        key: "Ultrafine Tune",
        init: Number(stringState[`${basePath}/Ultrafine_Tune`]),
        max: 100,
        min: -100,
        step: 1
    }
    let varianceParams = {
        key: "Variance",
        init: Number(stringState[`${basePath}/Variance`]),
        max: 10,
        min: 0,
        step: 0.1
    }
    let gainParams = {
        key: "Gain",
        init: Number(stringState[`${basePath}/Gain`]),
        max: 20,
        min: -20,
        step: 0.1
    }
    let timbreState = {}
    Object.entries(stringState).filter(item => item[0].includes(`${basePath}/Octave`)).forEach(item => timbreState[`${item[0]}`] = item[1])
    return (
        <>
            <p><strong>{`${title} Parameters`}</strong></p>
            <br />
            <Toggle title="Loop" status={stringState[`${basePath}/Play_String/Loop`]} path={`${basePath}/Play_String/Loop`} onParamUpdate={(value,path) => onParamUpdate(value,path)}/>
            <Selector params={stringSelectParams} path={`${basePath}/Select_Note`} onParamUpdate={(value,path) => onParamUpdate(value,path)}></Selector>
            <Slider params={fineTuneParams} path={`${basePath}/Fine_Tune`} onParamUpdate={(value,path) => onParamUpdate(value,path)}></Slider>
            <Slider params={ultraFineTuneParams} path={`${basePath}/Ultrafine_Tune`} onParamUpdate={(value,path) => onParamUpdate(value,path)}></Slider>
            <Slider params={varianceParams} path={`${basePath}/Variance`} onParamUpdate={(value,path) => onParamUpdate(value,path)}></Slider>
            <Slider params={gainParams} path={`${basePath}/Gain`} onParamUpdate={(value,path) => onParamUpdate(value,path)}></Slider>
            <ShowHideControls title="Timbre">
              <DroneStringTimbre title={title} timbreState={timbreState} basePath={basePath} onParamUpdate={(value,path) => onParamUpdate(value,path)}/>
            </ShowHideControls>
        </>
    )
}

export default DroneString