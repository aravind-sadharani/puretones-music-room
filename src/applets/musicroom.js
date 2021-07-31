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

const MusicRoom = () => {
    const droneSettings = dronePRT.replace(/puretones/g,'FaustDSP')
    let defaultDroneState = dspStateFromSettings('drone', droneSettings)
    const scaleSettings = scalePKB.replace(/musicscale/g,'FaustDSP')
    let defaultScaleState = dspStateFromSettings('scale', scaleSettings)
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
    const [sequencerState, updateSequencerState] = React.useState({...defaultSequencerState})
    const [droneLocalState, setDroneLocalState] = useLocalStore('drone', defaultDroneState)
    const [droneState, configureDrone] = React.useState(defaultDroneState)
    const [scaleLocalState, setScaleLocalState] = useLocalStore('scale', defaultScaleState)
    const [scaleState, configureScale] = React.useState(defaultScaleState)
    scaleLocalState['/FaustDSP/Common_Parameters/Pitch'] = droneLocalState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency']
    scaleLocalState['/FaustDSP/Common_Parameters/Fine_Tune'] = droneLocalState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune']
    React.useEffect(() => {
        configureDrone({...droneLocalState})
        configureScale({...scaleLocalState})
        updateSequencerState({...sequencerLocalState})
    }, [droneLocalState,scaleLocalState,sequencerLocalState])
    const updateParameter = (appname, value, path) => {
        let updateParams = {}
        updateParams[`${path}`] = value
        dispatch({type: 'Configure', appname: appname, settings: updateParams})
        switch(appname) {
            case 'drone':
                let newDroneState = droneState
                newDroneState[`${path}`] = value
                setDroneLocalState(newDroneState)
                if(path === '/FaustDSP/PureTones_v1.0/0x00/Common_Frequency' || path === '/FaustDSP/PureTones_v1.0/0x00/Fine_Tune') {
                    let scalePath = path.includes('Common_Frequency') ? '/FaustDSP/Common_Parameters/Pitch' : '/FaustDSP/Common_Parameters/Fine_Tune'
                    let newScaleState = scaleState
                    newScaleState[`${scalePath}`] = value
                    setScaleLocalState(newScaleState)
                    let scaleUpdateParams = {}
                    scaleUpdateParams[`${scalePath}`] = value
                    dispatch({type: 'Configure', appname: 'scale', settings: scaleUpdateParams})
                    let sequencerUpdateParams = {}
                    sequencerUpdateParams[`${scalePath}`.replace('Common_Parameters','Motif')] = value
                    dispatch({type: 'Configure', appname: 'sequencer', settings: sequencerUpdateParams})
                }
                break
            case 'scale':
                let newScaleState = scaleState
                newScaleState[`${path}`] = value
                setScaleLocalState(newScaleState)
                break
            default:
                console.log(`Update Parameters: Incorrect appname ${appname}!`)
        }
    }
    const updateVoiceParameters = (index, value, path) => {
        let newSequencerState = sequencerState
        newSequencerState[index][`${path}`] = value
        setSequencerLocalState({...newSequencerState})   
    }
    const sendMIDIMessage = (msg) => {
        dispatch({type: 'MIDI', appname: 'scale', message: msg})
    }
    const reset = (appname) => {
        switch(appname) {
            case 'drone':
                dispatch({type: 'Configure', appname: appname, settings: defaultDroneState})
                setDroneLocalState(defaultDroneState)
                scaleLocalState['/FaustDSP/Common_Parameters/Pitch'] = defaultDroneState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency']
                scaleLocalState['/FaustDSP/Common_Parameters/Fine_Tune'] = defaultDroneState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune']
                setScaleLocalState(scaleLocalState)
                dispatch({type: 'Configure', appname: 'scale', settings: scaleLocalState})
                let sequencerUpdateParams = {}
                sequencerUpdateParams['/FaustDSP/Motif/Pitch'] = defaultDroneState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency']
                sequencerUpdateParams['/FaustDSP/Motif/Fine_Tune'] = defaultDroneState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune']
                dispatch({type: 'Configure', appname: 'sequencer', settings: sequencerUpdateParams})
                break
            case 'scale':
                dispatch({type: 'Configure', appname: appname, settings: defaultScaleState})
                setScaleLocalState(defaultScaleState)
                break
            case 'sequencer':
                setSequencerLocalState({...defaultSequencerState})
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
                dispatch({type: 'Configure', appname: appname, settings: newDroneState})
                setDroneLocalState({...newDroneState})
                newScaleState = scaleLocalState
                newScaleState['/FaustDSP/Common_Parameters/Pitch'] = newDroneState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency']
                newScaleState['/FaustDSP/Common_Parameters/Fine_Tune'] = newDroneState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune']
                dispatch({type: 'Configure', appname: 'scale', settings: newScaleState})
                setScaleLocalState({...newScaleState})
                break
            case 'scale':
                newScaleState = dspStateFromSettings(appname,snapshot)
                newScaleState['/FaustDSP/Common_Parameters/Pitch'] = droneLocalState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency']
                newScaleState['/FaustDSP/Common_Parameters/Fine_Tune'] = droneLocalState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune']
                dispatch({type: 'Configure', appname: appname, settings: newScaleState})
                setScaleLocalState({...newScaleState})
                break
            case 'sequencer':
                setSequencerLocalState({...JSON.parse(snapshot)})
                break
            default:
                console.log(`Restore: Incorrect appname ${appname}!`)
                return
        }
    }
    let mainNavTabs = ['Drone', 'Scale', 'Sequencer']
    let mainNavPages = [
        <Drone droneDSPCode={droneDSPCode} droneState={droneState} onParamUpdate={(value,path) => updateParameter('drone',value,path)} reset={()=>reset('drone')} save={(()=>saveSnapshot('drone'))} restore={(snapshot) => restoreSnapshot(snapshot,'drone')}/>, 
        <Scale scaleDSPCode={scaleDSPCode} scaleState={scaleState} onParamUpdate={(value,path) => updateParameter('scale',value,path)} onMIDIMessage={sendMIDIMessage} reset={()=>reset('scale')} save={(()=>saveSnapshot('scale'))} restore={(snapshot) => restoreSnapshot(snapshot,'scale')}/>,
        <Sequencer scaleState={scaleState} sequencerState={sequencerState} onVoiceParamUpdate={updateVoiceParameters} reset={()=>reset('sequencer')} save={(()=>saveSnapshot('sequencer'))} restore={(snapshot) => restoreSnapshot(snapshot,'sequencer')}/>
    ]
    return (
        <>
            <p><strong>Common Parameters</strong></p>
            <CommonPitch />
            <TabNav tablist={mainNavTabs} pagelist={mainNavPages}></TabNav>
        </>
    )
}

export default MusicRoom