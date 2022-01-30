import * as React from 'react'
import styled from 'styled-components'
import Button from 'components/button'
import SaveRestore from 'components/saverestore'
import Slider from 'components/slider'
import {analyzeDrone} from 'utils/analyzedrone'
import {dspStateFromSettings} from 'utils/dspsettingsinterpreter'
import dronePRT from 'data/default.prt'
import scalePKB from 'data/default.pkb'
import DroneAnalysisTable from 'applets/droneanalysistable'
import DroneAnalysisChart from 'applets/droneanalysischart'

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

    const restoreDrone = (dronesnapshot,dronefilename) => {
        let droneState = dspStateFromSettings('drone',dronesnapshot)
        setDrone({state: droneState, name: dronefilename.replace('.prt','')})
        setDroneAnalysis({status: false, pitches:[]})
    }

    const resetDrone = () => {
        setDrone({state: defaultDroneState, name: 'Standard'})
        setDroneAnalysis({status: false, pitches:[]})
    }

    const restoreScale = (scalesnapshot,scalefilename) => {
        let scaleState = dspStateFromSettings('scale',scalesnapshot)
        setScale({state: scaleState, name: scalefilename.replace('.pkb','')})
        setDroneAnalysis({status: false, pitches:[]})
    }

    const resetScale = () => {
        setScale({state: defaultScaleState, name: 'Standard'})
        setDroneAnalysis({status: false, pitches:[]})
    }

    const analyze = () => {
        let result = analyzeDrone(drone.state,scale.state,resolution,noiseFloor)

        setDroneAnalysis({status: result.status, pitches: result.pitches})
    }

    const [resolution,setResolution] = React.useState(10)
    const [noiseFloor,setNoiseFloor] = React.useState(-80)

    const updateResolution = (value) => setResolution(Number(value))
    const updateNoiseFloor = (value) => setNoiseFloor(Number(value))

    const resolutionParams = {
        key: 'Resolution in ¢',
        init: resolution,
        max: 20,
        min: 1,
        step: 1,
    }

    const noiseFloorParams = {
        key: 'Noise floor in dB',
        init: noiseFloor,
        max: -60,
        min: -100,
        step: 1,
    }

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
                <p>Set the resolution and noise floor and press Analyze to view the results.</p>
                <Slider params={resolutionParams} path='Resolution' onParamUpdate={updateResolution} />
                <Slider params={noiseFloorParams} path='NoiseFloor' onParamUpdate={updateNoiseFloor} />
                <center>
                    <Button onClick={() => analyze()}>Analyze</Button>
                </center>
                <p></p>
            </DroneAnalyzerContainer>
            {droneAnalysis.status && <DroneAnalysisChart pitches={droneAnalysis.pitches} droneName={drone.name} scaleName={scale.name} />}
            {droneAnalysis.status && <DroneAnalysisTable pitches={droneAnalysis.pitches} droneState={drone.state} />}
        </>
    )
}

export default DroneAnalyzer