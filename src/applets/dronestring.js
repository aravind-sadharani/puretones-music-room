import * as React from "react"
import Selector from "components/selector"
import Slider from "components/slider"
import ShowHideControls from "components/showhidecontrols"
import Toggle from "components/toggle"
import DroneStringTimbre from "applets/dronestringtimbre"

const DroneString = ({title,stringState,basePath,onParamUpdate}) => {
    let stringSelectParams = {
      key: "Note",
      default: stringState[`${basePath}/Select_Note`],
      options: [
        {
          value: "0",
          text: "SA"
        },
        {
          value: "1",
          text: "Ni"
        },
        {
          value: "2",
          text: "ni"
        },
        {
          value: "3",
          text: "Dha"
        },
        {
          value: "4",
          text: "dha"
        },
        {
          value: "5",
          text: "Pa"
        },
        {
          value: "6",
          text: "Ma"
        },
        {
          value: "7",
          text: "ma"
        },
        {
          value: "8",
          text: "Ga"
        },
        {
          value: "9",
          text: "ga"
        },
        {
          value: "10",
          text: "Re"
        },
        {
          value: "11",
          text: "re"
        },
        {
          value: "12",
          text: "Sa"
        }
      ]
    }
    let fineTuneParams = {
        key: "Fine Tune",
        init: stringState[`${basePath}/Fine_Tune`],
        max: 100,
        min: -100,
        step: 1
    }
    let ultraFineTuneParams = {
        key: "Ultrafine Tune",
        init: stringState[`${basePath}/Ultrafine_Tune`],
        max: 100,
        min: -100,
        step: 1
    }
    let varianceParams = {
        key: "Variance",
        init: stringState[`${basePath}/Variance`],
        max: 10,
        min: 0,
        step: 0.1
    }
    let gainParams = {
        key: "Gain",
        init: stringState[`${basePath}/Gain`],
        max: 20,
        min: -20,
        step: 0.1
    }
    let timbreState = {}
    Object.entries(stringState).filter(item => item[0].includes(`${basePath}/Octave`)).forEach(item => timbreState[`${item[0]}`] = item[1])
    const [timbreVisibility, setTimbreVisibility] = React.useState(false)
    const toggleTimbreVisibility = () => setTimbreVisibility(!timbreVisibility)
    return (
        <>
            <p><strong>{`${title} Parameters`}</strong></p>
            <Toggle title="Loop" status={stringState[`${basePath}/Play_String/Loop`]} path={`${basePath}/Play_String/Loop`} onParamUpdate={(value,path) => onParamUpdate(value,path)}/>
            <Selector params={stringSelectParams} path={`${basePath}/Select_Note`} onParamUpdate={(value,path) => onParamUpdate(value,path)}></Selector>
            <Slider params={fineTuneParams} path={`${basePath}/Fine_Tune`} onParamUpdate={(value,path) => onParamUpdate(value,path)}></Slider>
            <Slider params={ultraFineTuneParams} path={`${basePath}/Ultrafine_Tune`} onParamUpdate={(value,path) => onParamUpdate(value,path)}></Slider>
            <Slider params={varianceParams} path={`${basePath}/Variance`} onParamUpdate={(value,path) => onParamUpdate(value,path)}></Slider>
            <Slider params={gainParams} path={`${basePath}/Gain`} onParamUpdate={(value,path) => onParamUpdate(value,path)}></Slider>
            <ShowHideControls title="Timbre" visibility={timbreVisibility} onShowHide={toggleTimbreVisibility}>
              <DroneStringTimbre title={title} timbreState={timbreState} basePath={basePath} onParamUpdate={(value,path) => onParamUpdate(value,path)}/>
            </ShowHideControls>
        </>
    )
}

export default DroneString