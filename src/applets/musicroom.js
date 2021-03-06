import * as React from "react"
import TabNav from "components/tabs"
import Drone from "applets/drone"
import Scale from "applets/scale"
import Sequencer from "applets/sequencer"
import { AudioEnv } from "services/audioenv"
import useLocalStore from "services/localstore"
import { dspSettingsFromState, dspStateFromSettings } from "utils/dspsettingsinterpreter"
import droneDSPCode from 'data/puretones.dsp'
import dronePRT from 'data/default.prt'
import scaleDSPCode from 'data/musicscale.dsp'
import scalePKB from 'data/default.pkb'
import sequencerPSQ from 'data/default.psq'
import CommonPitch from "applets/commonpitch"
import { CommonSettingsEnv } from 'services/commonsettings'

const MusicRoom = () => {
    const {commonSettings} = React.useContext(CommonSettingsEnv)
    let defaultDroneState = dspStateFromSettings('drone', dronePRT)
    defaultDroneState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency'] = commonSettings['pitch']
    defaultDroneState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune'] = commonSettings['offSet']
    let defaultScaleState = dspStateFromSettings('scale', scalePKB)
    defaultScaleState['/FaustDSP/Common_Parameters/Pitch'] = commonSettings['pitch']
    defaultScaleState['/FaustDSP/Common_Parameters/Fine_Tune'] = commonSettings['offSet']
    const {dispatch} = React.useContext(AudioEnv)
    const defaultSequencerState = JSON.parse(sequencerPSQ)
    const [sequencerName, setSequencerName] = useLocalStore('sequencername','')
    const [sequencerLocalState, setSequencerLocalState] = useLocalStore('sequencer', defaultSequencerState)
    const [sequencerLocalTempo, setSequencerLocalTempo] = useLocalStore('sequencertempo', 120)
    const [droneName, setDroneName] = useLocalStore('dronename', 'Standard')
    const [droneLocalState, setDroneLocalState] = useLocalStore('drone', defaultDroneState)
    droneLocalState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency'] = commonSettings['pitch']
    droneLocalState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune'] = commonSettings['offSet']
    const [scaleName, setScaleName] = useLocalStore('scalename', 'Standard')
    const [scaleLocalState, setScaleLocalState] = useLocalStore('scale', defaultScaleState)
    scaleLocalState['/FaustDSP/Common_Parameters/Pitch'] = commonSettings['pitch']
    scaleLocalState['/FaustDSP/Common_Parameters/Fine_Tune'] = commonSettings['offSet']
    const updateParameter = (appname, value, path) => {
        let updateParams = {}
        updateParams[`${path}`] = value
        dispatch({type: 'Configure', appname: appname, settings: updateParams})
        switch(appname) {
            case 'drone':
                let newDroneName = (droneName.includes('(modified)') || droneName === 'Modified') ? droneName : droneName === 'Standard' ? 'Modified' : `${droneName} (modified)`
                setDroneName(newDroneName)
                setDroneLocalState(updateParams)
                break
            case 'scale':
                let newScaleName = (scaleName.includes('(modified)') || scaleName === 'Modified') ? scaleName : scaleName === 'Standard' ? 'Modified' : `${scaleName} (modified)`
                setScaleName(newScaleName)
                setScaleLocalState(updateParams)
                break
            default:
                console.log(`Update Parameters: Incorrect appname ${appname}!`)
        }
    }
    const updateTempo = (value, path) => {
        let updateParams = {}
        updateParams[`${path}`] = Math.log2(240/value)
        dispatch({type: 'Configure', appname: 'sequencer', settings: updateParams})
        if(sequencerName !== '' && sequencerName.includes('loaded')) {
            let newSequencerName = sequencerName.replace('loaded','modified')
            setSequencerName(newSequencerName)
        }
        setSequencerLocalTempo(value)
    }
    const updateVoiceParameters = (index, value, path) => {
        if(path === 'gain') {
            let updateParams = {}
            updateParams[`/FaustDSP/Motif/_voice_${index+1}/Gain`] = value
            dispatch({type: 'Configure', appname: 'sequencer', settings: updateParams})
        } else if (path === 'pan') {
            let updateParams = {}
            updateParams[`/FaustDSP/Motif/_voice_${index+1}/Pan`] = Number(value)/100
            dispatch({type: 'Configure', appname: 'sequencer', settings: updateParams})
        }
        if(sequencerName !== '' && sequencerName.includes('loaded')) {
            let newSequencerName = sequencerName.replace('loaded','modified')
            setSequencerName(newSequencerName)
        }
        let newSequencerState = sequencerLocalState
        newSequencerState[index][`${path}`] = value
        setSequencerLocalState(newSequencerState)   
    }
    const sendMIDIMessage = (msg) => {
        dispatch({type: 'MIDI', appname: 'scale', message: msg})
    }
    const reset = (appname) => {
        switch(appname) {
            case 'drone':
                dispatch({type: 'Configure', appname: appname, settings: defaultDroneState})
                setDroneName('Standard')
                setDroneLocalState(defaultDroneState)
                break
            case 'scale':
                dispatch({type: 'Configure', appname: appname, settings: defaultScaleState})
                setScaleName('Standard')
                setScaleLocalState(defaultScaleState)
                break
            case 'sequencer':
                setSequencerName('')
                setSequencerLocalState(defaultSequencerState)
                setSequencerLocalTempo(120)
                break
            default:
                console.log(`Reset: Incorrect appname ${appname}!`)
        }
    }
    const saveSnapshot = (appname) => {
        switch(appname) {
            case 'drone':
                return `data:text/plain;charset=utf-8,${encodeURIComponent(dspSettingsFromState(appname,droneLocalState))}`
            case 'scale':
                return `data:text/plain;charset=utf-8,${encodeURIComponent(dspSettingsFromState(appname,scaleLocalState))}`
            case 'sequencer':
                return `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(sequencerLocalState))}`
            default:
                console.log(`Save: Incorrect appname ${appname}!`)
                return null
        }
    }
    const restoreSnapshot = (snapshot,appname,filename) => {
        let newDroneState = {}
        let newScaleState = {}
        switch(appname) {
            case 'drone':
                newDroneState = dspStateFromSettings(appname,snapshot)
                newDroneState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency'] = commonSettings['pitch']
                newDroneState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune'] = commonSettings['offSet']
                dispatch({type: 'Configure', appname: appname, settings: newDroneState})
                setDroneName(filename.toString().replace('.prt',''))
                setDroneLocalState(newDroneState)
                break
            case 'scale':
                newScaleState = dspStateFromSettings(appname,snapshot)
                newScaleState['/FaustDSP/Common_Parameters/Pitch'] = commonSettings['pitch']
                newScaleState['/FaustDSP/Common_Parameters/Fine_Tune'] = commonSettings['offSet']
                dispatch({type: 'Configure', appname: appname, settings: newScaleState})
                setScaleName(filename.toString().replace('.pkb',''))
                setScaleLocalState(newScaleState)
                break
            case 'sequencer':
                setSequencerName(`(loaded ${filename.toString().replace('.psq','')})`)
                setSequencerLocalState({...defaultSequencerState,...JSON.parse(snapshot)})
                break
            default:
                console.log(`Restore: Incorrect appname ${appname}!`)
                return
        }
    }
    let mainNavTabs = ['Drone', 'Scale', 'Sequencer']
    let mainNavPages = [
        <Drone droneDSPCode={droneDSPCode} droneState={droneLocalState} onParamUpdate={(value,path) => updateParameter('drone',value,path)} reset={()=>reset('drone')} save={(()=>saveSnapshot('drone'))} restore={(snapshot,filename) => restoreSnapshot(snapshot,'drone',filename)} droneName={droneName} />, 
        <Scale scaleDSPCode={scaleDSPCode} scaleState={scaleLocalState} onParamUpdate={(value,path) => updateParameter('scale',value,path)} onMIDIMessage={sendMIDIMessage} reset={()=>reset('scale')} save={(()=>saveSnapshot('scale'))} restore={(snapshot,filename) => restoreSnapshot(snapshot,'scale',filename)} scaleName={scaleName} />,
        <Sequencer scaleState={scaleLocalState} sequencerName={sequencerName} sequencerState={sequencerLocalState} onVoiceParamUpdate={updateVoiceParameters} reset={()=>reset('sequencer')} save={(()=>saveSnapshot('sequencer'))} restore={(snapshot,filename) => restoreSnapshot(snapshot,'sequencer',filename)} tempo={sequencerLocalTempo} updateTempo={updateTempo}/>
    ]
    return (
        <>
            <CommonPitch />
            <TabNav tablist={mainNavTabs} pagelist={mainNavPages}></TabNav>
        </>
    )
}

export default MusicRoom