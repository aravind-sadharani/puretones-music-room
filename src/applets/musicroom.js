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
    const defaultSequencerState = [
        {
            voiceName: '_voice_1',
            enabled: true,
            octave: 0,
            tone: 0,
            editorExpanded: true,
            composition: 'Sa 2'
        },
        {
            voiceName: '_voice_2',
            enabled: false,
            octave: 0,
            tone: 0,
            editorExpanded: false,
            composition: ''
        },
        {
            voiceName: '_voice_3',
            enabled: false,
            octave: 0,
            tone: 0,
            editorExpanded: false,
            composition: ''
        }
    ]
    const [sequencerLocalState, setSequencerLocalState] = useLocalStore('sequencer', defaultSequencerState)
    const [droneLocalState, setDroneLocalState] = useLocalStore('drone', defaultDroneState)
    droneLocalState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency'] = commonSettings['pitch']
    droneLocalState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune'] = commonSettings['offSet']
    const [scaleLocalState, setScaleLocalState] = useLocalStore('scale', defaultScaleState)
    scaleLocalState['/FaustDSP/Common_Parameters/Pitch'] = commonSettings['pitch']
    scaleLocalState['/FaustDSP/Common_Parameters/Fine_Tune'] = commonSettings['offSet']
    const updateParameter = (appname, value, path) => {
        let updateParams = {}
        updateParams[`${path}`] = value
        dispatch({type: 'Configure', appname: appname, settings: updateParams})
        switch(appname) {
            case 'drone':
                setDroneLocalState(updateParams)
                break
            case 'scale':
                setScaleLocalState(updateParams)
                break
            default:
                console.log(`Update Parameters: Incorrect appname ${appname}!`)
        }
    }
    const updateVoiceParameters = (index, value, path) => {
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
                setDroneLocalState(defaultDroneState)
                break
            case 'scale':
                dispatch({type: 'Configure', appname: appname, settings: defaultScaleState})
                setScaleLocalState(defaultScaleState)
                break
            case 'sequencer':
                setSequencerLocalState(defaultSequencerState)
                break
            default:
                console.log(`Reset: Incorrect appname ${appname}!`)
        }
    }
    const saveSnapshot = (appname) => {
        switch(appname) {
            case 'drone':
                return dspSettingsFromState(appname,droneLocalState)
            case 'scale':
                return dspSettingsFromState(appname,scaleLocalState)
            case 'sequencer':
                return JSON.stringify(sequencerLocalState)
            default:
                console.log(`Save: Incorrect appname ${appname}!`)
                return null
        }
    }
    const restoreSnapshot = (snapshot,appname) => {
        let newDroneState = {}
        let newScaleState = {}
        switch(appname) {
            case 'drone':
                newDroneState = dspStateFromSettings(appname,snapshot)
                newDroneState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency'] = commonSettings['pitch']
                newDroneState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune'] = commonSettings['offSet']
                dispatch({type: 'Configure', appname: appname, settings: newDroneState})
                setDroneLocalState(newDroneState)
                break
            case 'scale':
                newScaleState = dspStateFromSettings(appname,snapshot)
                newScaleState['/FaustDSP/Common_Parameters/Pitch'] = commonSettings['pitch']
                newScaleState['/FaustDSP/Common_Parameters/Fine_Tune'] = commonSettings['offSet']
                dispatch({type: 'Configure', appname: appname, settings: newScaleState})
                setScaleLocalState(newScaleState)
                break
            case 'sequencer':
                setSequencerLocalState(JSON.parse(snapshot))
                break
            default:
                console.log(`Restore: Incorrect appname ${appname}!`)
                return
        }
    }
    let mainNavTabs = ['Drone', 'Scale', 'Sequencer']
    let mainNavPages = [
        <Drone droneDSPCode={droneDSPCode} droneState={droneLocalState} onParamUpdate={(value,path) => updateParameter('drone',value,path)} reset={()=>reset('drone')} save={(()=>saveSnapshot('drone'))} restore={(snapshot) => restoreSnapshot(snapshot,'drone')}/>, 
        <Scale scaleDSPCode={scaleDSPCode} scaleState={scaleLocalState} onParamUpdate={(value,path) => updateParameter('scale',value,path)} onMIDIMessage={sendMIDIMessage} reset={()=>reset('scale')} save={(()=>saveSnapshot('scale'))} restore={(snapshot) => restoreSnapshot(snapshot,'scale')}/>,
        <Sequencer scaleState={scaleLocalState} sequencerState={sequencerLocalState} onVoiceParamUpdate={updateVoiceParameters} reset={()=>reset('sequencer')} save={(()=>saveSnapshot('sequencer'))} restore={(snapshot) => restoreSnapshot(snapshot,'sequencer')}/>
    ]
    return (
        <>
            <CommonPitch />
            <TabNav tablist={mainNavTabs} pagelist={mainNavPages}></TabNav>
        </>
    )
}

export default MusicRoom