import * as React from 'react'
import styled from 'styled-components'
import Button from 'components/button'
import SaveRestore from 'components/saverestore'
import Slider from 'components/slider'
import Toggle from 'components/toggle'
import {analyzeDrone} from 'utils/analyzedrone'
import {dspStateFromSettings} from 'utils/dspsettingsinterpreter'
import dronePRT from 'data/default.prt'
import scalePKB from 'data/default.pkb'
import DroneAnalysisTable from 'applets/droneanalysistable'
import DroneAnalysisChart from 'applets/droneanalysischart'
import TimeFreqAnalysisChart from 'applets/timefreqanalysischart'

const SLICE = 100

const DroneAnalyzerContainer = styled.div`
    padding: 12px 12px 0 12px;
    margin: 0 0 1em 0;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
`

const DroneAnalyzer = () => {
    let defaultDroneState = dspStateFromSettings('drone', dronePRT)
    let defaultScaleState = dspStateFromSettings('scale', scalePKB)
    const [drone,setDrone] = React.useState({state: defaultDroneState, name: 'Standard'})
    const [scale,setScale] = React.useState({state: defaultScaleState, name: 'Standard'})
    const [droneAnalysis,setDroneAnalysis] = React.useState({status: false, pitches:[]})
    const [timeFreqAnalysis,setTimeFreqAnalysis] = React.useState({status: false, pitches:[]})
    const [title,setTitle] = React.useState('Analyze')

    const resetAnalysis = () => {
        setDroneAnalysis({status: false, pitches:[]})
        setTimeFreqAnalysis({status: false, pitches:[]})
        setTitle('Analyze')
    }

    const restoreDrone = (dronesnapshot,dronefilename) => {
        let droneState = dspStateFromSettings('drone',dronesnapshot)
        setDrone({state: droneState, name: dronefilename.replace('.prt','')})
        resetAnalysis()
    }

    const resetDrone = () => {
        setDrone({state: defaultDroneState, name: 'Standard'})
        resetAnalysis()
    }

    const restoreScale = (scalesnapshot,scalefilename) => {
        let scaleState = dspStateFromSettings('scale',scalesnapshot)
        setScale({state: scaleState, name: scalefilename.replace('.pkb','')})
        resetAnalysis()
    }

    const resetScale = () => {
        setScale({state: defaultScaleState, name: 'Standard'})
        resetAnalysis()
    }

    const analyze = () => {
        if(title === 'Completed')
            return

        setTitle('Analyzing...')        
    }

    const [resolution,setResolution] = React.useState(10)
    const [noiseFloor,setNoiseFloor] = React.useState(-80)
    const [duration,setDuration] = React.useState(30)
    const [mode,setMode] = React.useState(0)

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
                console.error('Drone Analyzer: Incorrect path for updating parameters')
        }
        resetAnalysis()
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

    React.useEffect(() => {
        if(title === 'Analyzing...') {
            if(mode === 0) {
                setDroneAnalysis({
                    status: true,
                    pitches: analyzeDrone(drone.state,scale.state,resolution,noiseFloor,-1),
                })
            } else {
                let pitchData = []
                for(let time=0; time<duration; time+=duration/SLICE) {
                    pitchData.push(analyzeDrone(drone.state,scale.state,resolution,noiseFloor,time))
                }
                setTimeFreqAnalysis({
                    status: true,
                    pitches: pitchData,
                })
            }
            setTitle('Completed')
        }
    },[title,duration,resolution,noiseFloor,mode,drone,scale])


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
                </DroneAnalyzerContainer>
                <DroneAnalyzerContainer>
                    <p><strong>Configure Scale</strong></p>
                    <p>Upload a scale tuning or keep using <strong>{scale.name}</strong> scale</p>
                    <center>
                        <Button onClick={resetScale}>Reset Scale</Button>
                        <SaveRestore extn='pkb' restore={restoreScale} restoretitle='Load Scale' />
                    </center>
                    <p></p>
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
            </DroneAnalyzerContainer>
            {timeFreqAnalysis.status && <TimeFreqAnalysisChart pitches={timeFreqAnalysis.pitches} duration={duration} droneName={drone.name} scaleName={scale.name} />}
            {droneAnalysis.status && <DroneAnalysisChart pitches={droneAnalysis.pitches} droneName={drone.name} scaleName={scale.name} />}
            {droneAnalysis.status && <DroneAnalysisTable pitches={droneAnalysis.pitches} droneState={drone.state} />}
        </>
    )
}

export default DroneAnalyzer