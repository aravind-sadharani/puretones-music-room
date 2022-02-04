import * as React from 'react'
import styled from 'styled-components'
import Button from 'components/button'
import SaveRestore from 'components/saverestore'
import Slider from 'components/slider'
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
        setTitle('Completed')
        setProgress('100%')
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

    const droneTabs = droneStringNames.filter(string => 
        (Number(drone.state[`/FaustDSP/PureTones_v1.0/0x00/${string}/Play_String/Loop`]) === 1)
    ).map(string => `String ${string[0]} (${scaleTabs[12 - Number(drone.state[`/FaustDSP/PureTones_v1.0/0x00/${string}/Select_Note`])]})`)

    const dronePages = droneStringNames.filter(string => 
        (Number(drone.state[`/FaustDSP/PureTones_v1.0/0x00/${string}/Play_String/Loop`]) === 1)
    ).map(string => (
        <Toggle title='Include in Analysis' status={activeDroneStrings.indexOf(string) === -1 ? '0' : '1'} path={string} onParamUpdate={updateParams} />
    ))

    const scalePages = scaleTabs.map(note => (
        <Toggle title='Include in Analysis' status={activeScaleNotes.indexOf(note) === -1 ? '0' : '1'} path={note} onParamUpdate={updateParams} />
    ))

    return (
        <>
            <DroneAnalyzerContainer>
                <p><strong>Drone Analyzer</strong></p>
                <DroneAnalyzerContainer>
                    <p><strong>Configure Drone</strong></p>
                    <p>Upload a drone tuning or keep using <strong>{drone.name}</strong> drone</p>
                    <center>
                        <Button onClick={resetDrone}>Reset Drone</Button>
                        <SaveRestore extn='prt' restore={restoreDrone} restoretitle='Load Drone' />
                    </center>
                    <p></p>
                    <TabNav tablist={droneTabs} pagelist={dronePages} />
                </DroneAnalyzerContainer>
                <DroneAnalyzerContainer>
                    <p><strong>Configure Scale</strong></p>
                    <p>Upload a scale tuning or keep using <strong>{scale.name}</strong> scale</p>
                    <center>
                        <Button onClick={resetScale}>Reset Scale</Button>
                        <SaveRestore extn='pkb' restore={restoreScale} restoretitle='Load Scale' />
                    </center>
                    <p></p>
                    <TabNav tablist={scaleTabs} pagelist={scalePages} />
                </DroneAnalyzerContainer>
                <p><strong>Analysis Parameters</strong></p>
                <Slider params={resolutionParams} path='Resolution' onParamUpdate={updateParams} />
                <Slider params={noiseFloorParams} path='NoiseFloor' onParamUpdate={updateParams} />
                <Toggle title='Enable Time Frequency Analysis' status={mode} path='Mode' onParamUpdate={updateParams} />
                {mode === 1 && <Slider params={durationParams} path='Duration' onParamUpdate={updateParams} />}
                <center>
                    <Button onClick={() => analyze()}>{title}</Button>
                </center>
                <p></p>
                <ProgressBar title='Analysis in Progress' progress={progress} />
            </DroneAnalyzerContainer>
            {timeFreqAnalysis.status && <TimeFreqAnalysisChart pitches={timeFreqAnalysis.pitches} duration={duration} droneName={drone.name} scaleName={scale.name} onComplete={chartCompleted} />}
            {droneAnalysis.status && <DroneAnalysisChart pitches={droneAnalysis.pitches} droneName={drone.name} scaleName={scale.name} onComplete={chartCompleted} />}
            {droneAnalysis.status && <DroneAnalysisTable pitches={droneAnalysis.pitches} droneState={drone.state} />}
        </>
    )
}

export default DroneAnalyzer