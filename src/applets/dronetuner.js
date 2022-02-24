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
import { CommonSettingsEnv } from 'services/commonsettings'
import AnalyzeLocal from "services/analyzelocal"
import { tuneDrone } from 'utils/dronetuner.worker'
import createWorker from 'utils/createworker'
import TuningHints from 'applets/tuninghints'

const droneStringNames = ['1st_String', '2nd_String', '3rd_String', '4th_String', '5th_String', '6th_String']
const droneTabs = ['String 1', 'String 2', 'String 3', 'String 4', 'String 5', 'String 6']
const scaleTabs = ['Sa', 're', 'Re', 'ga', 'Ga', 'ma', 'Ma', 'Pa', 'dha', 'Dha', 'ni', 'Ni', 'SA']

const DroneTunerContainer = styled.div`
    padding: 12px 12px 0 12px;
    margin: 0 0 1em 0;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
`

const DroneTuner = () => {
    const [commonSettings,setCommonSettings] = React.useState(React.useContext(CommonSettingsEnv).commonSettings)
    let defaultDroneState = dspStateFromSettings('drone', dronePRT)
    let defaultScaleState = dspStateFromSettings('scale', scalePKB)
    const [drone,setDrone] = React.useState({state: defaultDroneState, name: 'Standard'})
    const [scale,setScale] = React.useState({state: defaultScaleState, name: 'Standard'})
    const [analysisData,setAnalysisData] = React.useState({status: false, scaleTuning:[]})
    const [title,setTitle] = React.useState('Analyze')
    const [progress,setProgress] = React.useState(100)
    const [resolution,setResolution] = React.useState(4)
    const [noiseFloor,setNoiseFloor] = React.useState(-80)
    const [duration,setDuration] = React.useState(16)
    const [activeDroneStrings,setActiveDroneStrings] = React.useState(droneStringNames.filter(string => 
        (Number(defaultDroneState[`/FaustDSP/PureTones_v1.0/0x00/${string}/Play_String/Loop`]) === 1)
    ))
    const [activeScaleNotes,setActiveScaleNotes] = React.useState(scaleTabs)
    const [analyzeLocal, toggleAnalyzeLocal] = React.useState(false)
    const [autoAnalyze, setAutoAnalyze] = React.useState(false)

    const updateAnalysis = (state) => {
        if(autoAnalyze)
            analyze(state)
        else
            setAnalysisData({status: false, scaleTuning:[]})
    }

    const restoreDrone = (dronesnapshot,dronefilename) => {
        let droneState = dspStateFromSettings('drone',dronesnapshot)
        setDrone({state: droneState, name: dronefilename.toString().replace('.prt','')})
        setActiveDroneStrings(droneStringNames.filter(string => 
            (Number(droneState[`/FaustDSP/PureTones_v1.0/0x00/${string}/Play_String/Loop`]) === 1)
        ))
        updateAnalysis({droneState: droneState})
    }

    const resetDrone = () => {
        setDrone({state: defaultDroneState, name: 'Standard'})
        setActiveDroneStrings(droneStringNames.filter(string => 
            (Number(defaultDroneState[`/FaustDSP/PureTones_v1.0/0x00/${string}/Play_String/Loop`]) === 1)
        ))
        updateAnalysis({droneState: defaultDroneState})
    }

    const restoreScale = (scalesnapshot,scalefilename) => {
        let scaleState = dspStateFromSettings('scale',scalesnapshot)
        setScale({state: scaleState, name: scalefilename.toString().replace('.pkb','')})
        setActiveScaleNotes(scaleTabs)
        updateAnalysis({scaleState: scaleState})
    }

    const resetScale = () => {
        setScale({state: defaultScaleState, name: 'Standard'})
        setActiveScaleNotes(scaleTabs)
        updateAnalysis({scaleState: defaultScaleState})
    }

    const analyze = (state) => {
        let analysisMessage
        if(state) {
            analysisMessage = {
                commonSettings: state.commonSettings || commonSettings,
                droneState: state.droneState || drone.state,
                activeDroneStrings: state.droneStrings || activeDroneStrings,
                scaleState: state.scaleState || scale.state,
                activeScaleNotes: state.scaleNotes || activeScaleNotes,
                resolution: state.newResolution || resolution,
                noiseFloor: state.newNoiseFloor || noiseFloor,
                duration: state.newDuration || duration
            }
        } else {
            analysisMessage = {
                commonSettings: commonSettings,
                droneState: drone.state,
                activeDroneStrings: activeDroneStrings,
                scaleState: scale.state,
                activeScaleNotes: activeScaleNotes,
                resolution: resolution,
                noiseFloor: noiseFloor,
                duration: duration
            }
        }

        setTitle(`Analyzing...`)
        setProgress(0)
        
        const Worker = createWorker(tuneDrone)
        Worker.postMessage(analysisMessage)

        Worker.onerror = (err) => console.error(err)

        Worker.onmessage = (e) => {
            if(e.data.status) {
                setAnalysisData(e.data)
                Worker.terminate()
                setTitle('Analyze')
                setProgress(100)
            } else {
                setProgress(e.data.progress)
            }
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
        key: 'Duration (s)',
        init: duration,
        max: 60,
        min: 1,
        step: 1,
    }

    const updateParams = (value,path) => {
        switch(path) {
            case 'Resolution':
                setResolution(Number(value))
                updateAnalysis({newResolution: Number(value)})
                break
            case 'NoiseFloor':
                setNoiseFloor(Number(value))
                updateAnalysis({newNoiseFloor: Number(value)})
                break
            case 'Duration':
                setDuration(Number(value))
                updateAnalysis({newDuration: Number(value)})
                break
            default:
                if(path.includes('String')) {
                    let droneStrings
                    if(activeDroneStrings.indexOf(path) === -1 && Number(value) === 1) {
                        droneStrings = [...activeDroneStrings,path]
                    } else if(activeDroneStrings.indexOf(path) !== -1 && Number(value) === 0) {
                        droneStrings = [...activeDroneStrings].filter(name => name !== path)
                    }
                    setActiveDroneStrings(droneStrings)
                    updateAnalysis({droneStrings: droneStrings})
                } else {
                    let scaleNotes
                    if(activeScaleNotes.indexOf(path) === -1 && Number(value) === 1) {
                        scaleNotes = [...activeScaleNotes,path]
                    } else if(activeScaleNotes.indexOf(path) !== -1 && Number(value) === 0) {
                        scaleNotes = [...activeScaleNotes].filter(name => name !== path)
                    } else {
                        console.error(`Drone Analyzer: Incorrect path ${path} and value ${value} for updating parameters`)
                        break
                    }
                    setActiveScaleNotes(scaleNotes)
                    updateAnalysis({scaleNotes: scaleNotes})
                }
        }
    }

    const updateStates = (appname,value,path) => {
        let newStates = {}
        newStates[`${path}`] = value
        switch(appname) {
            case 'drone':
                let newDroneName = (drone.name.includes('(modified)') || drone.name === 'Modified') ? drone.name : drone.name === 'Standard' ? 'Modified' : `${drone.name} (modified)`
                setDrone({state: {...drone.state,...newStates}, name: newDroneName})
                updateAnalysis({droneState: {...drone.state,...newStates}})
                break
            case 'scale':
                let newScaleName = (scale.name.includes('(modified)') || scale.name === 'Modified') ? scale.name : scale.name === 'Standard' ? 'Modified' : `${scale.name} (modified)`
                setScale({state: {...scale.state,...newStates}, name: newScaleName})
                updateAnalysis({scaleState: {...scale.state,...newStates}})
                break
            default:
                console.error(`Drone Analyzer: Update Parameters: Incorrect appname ${appname}!`)
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
                <Selector params={stringSelectParams} path={`${basePath}/Select_Note`} onParamUpdate={(value,path) => updateStates('drone',value,path)}></Selector>
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
            <Slider params={durationParams} path='Duration' onParamUpdate={updateParams} />
            <Toggle title='Use Drone and Scale settings from App' status={analyzeLocal} path='analyze_local' onParamUpdate={handleAnalyzeLocalToggle} />
            <Toggle title='Auto-update Chart' status={autoAnalyze} path='auto_analyze' onParamUpdate={handleAutoAnalyzeToggle} />
            {analyzeLocal && <AnalyzeLocal handleLocalStorageChanges={handleLocalStorageChanges} />}
        </>
    )

    const handleAutoAnalyzeToggle = () => {
        if(!autoAnalyze)
            analyze()
        
        setAutoAnalyze(!autoAnalyze)
    }

    const readLocal = (key) => JSON.parse(window.localStorage.getItem(key))
    
    const handleAnalyzeLocalToggle = () => {
        if(!analyzeLocal) {
            const droneName = readLocal('dronename')
            const droneLocalState = readLocal('drone')
            setDrone({state: droneLocalState, name: droneName})
            setActiveDroneStrings(droneStringNames.filter(string => 
                (Number(droneLocalState[`/FaustDSP/PureTones_v1.0/0x00/${string}/Play_String/Loop`]) === 1)
            ))
            const scaleName = readLocal('scalename')
            const scaleLocalState = readLocal('scale')
            setScale({state: scaleLocalState, name: scaleName})
            updateAnalysis({droneState: droneLocalState, scaleState: scaleLocalState})
        }
        
        toggleAnalyzeLocal(!analyzeLocal)
    }

    const handleLocalStorageChanges = (e) => {
        const {key,newValue} = e
        switch(key) {
            case 'dronename':
                setDrone({...drone, name: JSON.parse(newValue)})
                break
            case 'drone':
                const droneLocalState = JSON.parse(newValue)
                setDrone({...drone, state: droneLocalState})
                setActiveDroneStrings(droneStringNames.filter(string => 
                    (Number(droneLocalState[`/FaustDSP/PureTones_v1.0/0x00/${string}/Play_String/Loop`]) === 1)
                ))
                updateAnalysis({droneState: droneLocalState})
                break
            case 'scalename':
                setScale({...scale, name: JSON.parse(newValue)})
                break
            case 'scale':
                const scaleLocalState = JSON.parse(newValue)
                setScale({...scale, state: scaleLocalState})
                updateAnalysis({scaleState: scaleLocalState})
                break
            case 'commonsettings':
                const commonLocalSettings = JSON.parse(newValue)
                setCommonSettings({...commonSettings,...commonLocalSettings})
                updateAnalysis({commonSettings: commonLocalSettings})
                break
            default:
        }
    }

    const DroneTunerDocs = () => {
        const Doc1 = analyzeLocal ? () => `The drone and scale states would be taken from the settings in the App. Set up the analysis parameters above. ` : () => `Set up the analysis parameters and configure the drone and scale states using the tabs above. `
        const Doc2 = autoAnalyze ? () => `The chart will automatically update on changing any settings.` : () => (<>Press <code>Analyze</code> when ready. The results will appear in the chart below.</>)
        return (
            <p>
                <Doc1 />
                <Doc2 />
            </p>
        )
    }

    return (
        <>
            <TabNav tablist={['Common','Drone','Scale']} pagelist={[commonConfigPage(), droneConfigPage(), scaleConfigPage()]} />
            <DroneTunerContainer>
                <p><strong>Drone Tuner</strong></p>
                <DroneTunerDocs />
                <center>
                    {title === 'Analyze' && !autoAnalyze && <Button onClick={() => analyze()}>{title}</Button>}
                </center>
                <p></p>
                <ProgressBar progress={progress} />
            </DroneTunerContainer>
            {analysisData.status && <TuningHints tuning={analysisData.scaleTuning} scaleNotes={activeScaleNotes} droneStrings={activeDroneStrings} />}
        </>
    )
}

export default DroneTuner