import * as React from 'react'
import styled from 'styled-components'
import Button from 'components/button'
import SaveRestore from 'components/saverestore'
import Slider from 'components/slider'
import Selector from "components/selector"
import Toggle from 'components/toggle'
import TabNav from "components/tabs"
import ProgressBar from 'components/progressbar'
import {dspStateFromSettings} from 'utils/dspsettingsinterpreter'
import dronePRT from 'data/default.prt'
import scalePKB from 'data/default.pkb'
import DroneAnalysisTable from 'applets/droneanalysistable'
import DroneAnalysisChart from 'applets/droneanalysischart'
import TimeFreqAnalysisChart from 'applets/timefreqanalysischart'
import { CommonSettingsEnv } from 'services/commonsettings'

const droneStringNames = ['1st_String', '2nd_String', '3rd_String', '4th_String', '5th_String', '6th_String']
const droneTabs = ['String 1', 'String 2', 'String 3', 'String 4', 'String 5', 'String 6']
const scaleTabs = ['Sa', 're', 'Re', 'ga', 'Ga', 'ma', 'Ma', 'Pa', 'dha', 'Dha', 'ni', 'Ni', 'SA']

const DroneAnalyzerContainer = styled.div`
    padding: 12px 12px 0 12px;
    margin: 0 0 1em 0;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
`

const DroneAnalyzer = () => {
    const {commonSettings} = React.useContext(CommonSettingsEnv)
    let defaultDroneState = dspStateFromSettings('drone', dronePRT)
    let defaultScaleState = dspStateFromSettings('scale', scalePKB)
    const [drone,setDrone] = React.useState({state: defaultDroneState, name: 'Standard'})
    const [scale,setScale] = React.useState({state: defaultScaleState, name: 'Standard'})
    const [droneAnalysis,setDroneAnalysis] = React.useState({status: false, pitches:[]})
    const [timeFreqAnalysis,setTimeFreqAnalysis] = React.useState({status: false, pitches:[]})
    const [title,setTitle] = React.useState('Analyze')
    const [progress,setProgress] = React.useState('100%')
    const [resolution,setResolution] = React.useState(4)
    const [noiseFloor,setNoiseFloor] = React.useState(-80)
    const [duration,setDuration] = React.useState(16)
    const [mode,setMode] = React.useState(0)
    const [activeDroneStrings,setActiveDroneStrings] = React.useState(droneStringNames.filter(string => 
        (Number(defaultDroneState[`/FaustDSP/PureTones_v1.0/0x00/${string}/Play_String/Loop`]) === 1)
    ))
    const [activeScaleNotes,setActiveScaleNotes] = React.useState(scaleTabs)

    const resetAnalysis = () => {
        setDroneAnalysis({status: false, pitches:[]})
        setTimeFreqAnalysis({status: false, pitches:[]})
        setTitle('Analyze')
    }

    const restoreDrone = (dronesnapshot,dronefilename) => {
        let droneState = dspStateFromSettings('drone',dronesnapshot)
        setDrone({state: droneState, name: dronefilename.replace('.prt','')})
        setActiveDroneStrings(droneStringNames.filter(string => 
            (Number(droneState[`/FaustDSP/PureTones_v1.0/0x00/${string}/Play_String/Loop`]) === 1)
        ))
        resetAnalysis()
    }

    const resetDrone = () => {
        setDrone({state: defaultDroneState, name: 'Standard'})
        setActiveDroneStrings(droneStringNames.filter(string => 
            (Number(defaultDroneState[`/FaustDSP/PureTones_v1.0/0x00/${string}/Play_String/Loop`]) === 1)
        ))
        resetAnalysis()
    }

    const restoreScale = (scalesnapshot,scalefilename) => {
        let scaleState = dspStateFromSettings('scale',scalesnapshot)
        setScale({state: scaleState, name: scalefilename.replace('.pkb','')})
        setActiveScaleNotes(scaleTabs)
        resetAnalysis()
    }

    const resetScale = () => {
        setScale({state: defaultScaleState, name: 'Standard'})
        setActiveScaleNotes(scaleTabs)
        resetAnalysis()
    }

    const analyze = () => {
        if(title !== 'Analyze')
            return

        setTitle(`Analyzing...`)
        setProgress('0%')
        
        const Worker = new window.Worker('/Workers/droneanalyzer.worker.js')
        Worker.postMessage({
            commonSettings: commonSettings,
            droneState: drone.state,
            activeDroneStrings: activeDroneStrings,
            scaleState: scale.state,
            activeScaleNotes: activeScaleNotes,
            resolution: resolution,
            noiseFloor: noiseFloor,
            mode: mode,
            duration: duration
        })

        Worker.onerror = (err) => console.error(err)

        Worker.onmessage = (e) => {
            if(!e.data.status) {
                setProgress(`${e.data.progress}%`)
            } else {
                if(mode === 0)
                    setDroneAnalysis(e.data)
                else
                    setTimeFreqAnalysis(e.data)
                Worker.terminate()
                setTitle('Plotting...')
                setProgress('99%')
            }
        }
    }

    const chartCompleted = () => {
        if(title === 'Plotting...') {
            setTitle('Completed')
            setProgress('100%')    
        }
    }

    const resolutionParams = {
        key: 'Resolution (¢)',
        init: resolution,
        max: 20,
        min: 1,
        step: 1,
    }

    const noiseFloorParams = {
        key: 'Noise floor (dB)',
        init: noiseFloor,
        max: -60,
        min: -100,
        step: 1,
    }

    const durationParams = {
        key: 'Duration for Time Frequency Analysis (s)',
        init: duration,
        max: 60,
        min: 1,
        step: 1,
    }

    const updateParams = (value,path) => {
        switch(path) {
            case 'Resolution':
                setResolution(Number(value))
                break
            case 'NoiseFloor':
                setNoiseFloor(Number(value))
                break
            case 'Duration':
                setDuration(Number(value))
                break
            case 'Mode':
                setMode(Number(value))
                break
            default:
                if(path.includes('String')) {
                    if(activeDroneStrings.indexOf(path) === -1 && Number(value) === 1) {
                        setActiveDroneStrings([...activeDroneStrings,path])
                    } else if(activeDroneStrings.indexOf(path) !== -1 && Number(value) === 0) {
                        setActiveDroneStrings([...activeDroneStrings].filter(name => name !== path))
                    }
                } else {
                    if(activeScaleNotes.indexOf(path) === -1 && Number(value) === 1) {
                        setActiveScaleNotes([...activeScaleNotes,path])
                    } else if(activeScaleNotes.indexOf(path) !== -1 && Number(value) === 0) {
                        setActiveScaleNotes([...activeScaleNotes].filter(name => name !== path))
                    } else
                        console.error(`Drone Analyzer: Incorrect path ${path} and value ${value} for updating parameters`)
                }
        }
        resetAnalysis()
    }

    const updateStates = (appname,value,path) => {
        resetAnalysis()
        let newStates = {}
        newStates[`${path}`] = value
        switch(appname) {
            case 'drone':
                let newDroneName = (drone.name.includes('(modified)') || drone.name === 'Modified') ? drone.name : drone.name === 'Standard' ? 'Modified' : `${drone.name} (modified)`
                setDrone({state: {...drone.state,...newStates}, name: newDroneName})
                break
            case 'scale':
                let newScaleName = (scale.name.includes('(modified)') || scale.name === 'Modified') ? scale.name : scale.name === 'Standard' ? 'Modified' : `${scale.name} (modified)`
                setScale({state: {...scale.state,...newStates}, name: newScaleName})
                break
            default:
                console.log(`Update Parameters: Incorrect appname ${appname}!`)
        }
    }

    const dronePages = droneStringNames.filter(string => 
        (Number(drone.state[`/FaustDSP/PureTones_v1.0/0x00/${string}/Play_String/Loop`]) === 1)
    ).map(string => {
        let basePath = `/FaustDSP/PureTones_v1.0/0x00/${string}`
        let stringSelectParams = {
            key: "Note",
            default: drone.state[`${basePath}/Select_Note`],
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
            init: drone.state[`${basePath}/Fine_Tune`],
            max: 100,
            min: -100,
            step: 1
        }
        let ultrafineTuneParams = {
            key: "Ultrafine Tune",
            init: drone.state[`${basePath}/Ultrafine_Tune`],
            max: 100,
            min: -100,
            step: 1
        }
        return (
            <>
                <Toggle title='Include in Analysis' status={activeDroneStrings.indexOf(string) === -1 ? '0' : '1'} path={string} onParamUpdate={updateParams} />
                <Selector params={stringSelectParams} path={`${basePath}/Select_Note`} onParamUpdate={(value,path) => updateStates(value,path)}></Selector>
                <Slider params={fineTuneParams} path={`${basePath}/Fine_Tune`} onParamUpdate={(value,path) => updateStates('drone',value,path)}></Slider>
                <Slider params={ultrafineTuneParams} path={`${basePath}/Ultrafine_Tune`} onParamUpdate={(value,path) => updateStates('drone',value,path)}></Slider>
            </>
        )
    })

    const scalePages = scaleTabs.map(note => {
        let basePath = `/FaustDSP/Common_Parameters/12_Note_Scale/${note}`
        let fineTuneParams = {
            key: "Fine Tune",
            init: scale.state[`${basePath}/Cent`],
            max: 100,
            min: -100,
            step: 1
        }
        let ultrafineTuneParams = {
            key: "Ultrafine Tune",
            init: scale.state[`${basePath}/0.01_Cent`],
            max: 100,
            min: -100,
            step: 1
        }
        return (
            <>
                <Toggle title='Include in Analysis' status={activeScaleNotes.indexOf(note) === -1 ? '0' : '1'} path={note} onParamUpdate={updateParams} />
                <Slider params={fineTuneParams} path={`${basePath}/Cent`} onParamUpdate={(value,path) => updateStates('scale',value,path)}></Slider>
                <Slider params={ultrafineTuneParams} path={`${basePath}/0.01_Cent`} onParamUpdate={(value,path) => updateStates('scale',value,path)}></Slider>
            </>
        )
    })

    const droneConfigPage = () => (
        <>
            <p>Upload a drone tuning{`${drone.name !== 'Standard' ? ', reset it' : ''}`} or keep using <strong>{drone.name}</strong> drone.</p>
            <center>
                <Button onClick={resetDrone}>Reset Drone</Button>
                <SaveRestore extn='prt' restore={restoreDrone} restoretitle='Load Drone' />
            </center>
            <p></p>
            <p>You can adjust some of the drone parameters below, and choose which strings to include in the analysis.</p>
            <TabNav tablist={droneTabs} pagelist={dronePages} />
        </>
    )

    const scaleConfigPage = () => (
        <>
            <p>Upload a scale tuning{`${scale.name !== 'Standard' ? ', reset it' : ''}`} or keep using <strong>{scale.name}</strong> scale</p>
            <center>
                <Button onClick={resetScale}>Reset Scale</Button>
                <SaveRestore extn='pkb' restore={restoreScale} restoretitle='Load Scale' />
            </center>
            <p></p>
            <p>You can adjust the scale parameters below, and choose which notes to include in the analysis.</p>
            <TabNav tablist={scaleTabs} pagelist={scalePages} />
        </>
    )

    const commonConfigPage = () => (
        <>
            <p><strong>Analysis Parameters</strong></p>
            <Slider params={resolutionParams} path='Resolution' onParamUpdate={updateParams} />
            <Slider params={noiseFloorParams} path='NoiseFloor' onParamUpdate={updateParams} />
            <Toggle title='Enable Time Frequency Analysis' status={mode} path='Mode' onParamUpdate={updateParams} />
            {mode === 1 && <Slider params={durationParams} path='Duration' onParamUpdate={updateParams} />}
        </>
    )

    return (
        <>
            <TabNav tablist={['Common','Drone','Scale']} pagelist={[commonConfigPage(), droneConfigPage(),scaleConfigPage()]} />
            <DroneAnalyzerContainer>
                <p><strong>Drone Analyzer</strong></p>
                <p>Set up the analysis parameters and configure the drone and scale states using the tabs above. Press <code>Analyze</code> when ready.</p>
                <center>
                    <Button onClick={() => analyze()}>{title}</Button>
                </center>
                <p></p>
                <ProgressBar title='Analysis in Progress' progress={progress} />
                {(title === 'Completed') && <p>Scroll down to view the results.</p>}
            </DroneAnalyzerContainer>
            {timeFreqAnalysis.status && <TimeFreqAnalysisChart pitches={timeFreqAnalysis.pitches} duration={duration} droneName={drone.name} scaleName={scale.name} onComplete={chartCompleted} />}
            {droneAnalysis.status && <DroneAnalysisChart pitches={droneAnalysis.pitches} droneName={drone.name} scaleName={scale.name} onComplete={chartCompleted} />}
            {droneAnalysis.status && <DroneAnalysisTable pitches={droneAnalysis.pitches} droneState={drone.state} />}
        </>
    )
}

export default DroneAnalyzer