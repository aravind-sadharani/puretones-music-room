import * as React from "react"
import TabNav from "../components/tabs"
import Selector from "../components/selector"
import Slider from "../components/slider"
import Drone from "../applets/drone"
import Scale from "../applets/scale"
import Sequencer from "../applets/sequencer"
import { AudioEnv } from "../services/audioenv"
import { graphql, useStaticQuery } from "gatsby"
import useLocalStore from "../services/localstore"

const MusicRoom = () => {
    const {dronedsp,prt,scaledsp,pkb} = useStaticQuery(
        graphql`
            query DroneDSPQuery {
                dronedsp: file(relativePath: {eq: "puretones.dsp"}) {
                    childPlainText {
                        content
                    }
                },
                prt: file(relativePath: {eq: "default.prt"}) {
                    childPlainText {
                        content
                    }
                },
                scaledsp: file(relativePath: {eq: "musicscale.dsp"}) {
                    childPlainText {
                        content
                    }
                },
                pkb: file(relativePath: {eq: "default.pkb"}) {
                    childPlainText {
                        content
                    }
                }
            }
        `
    )
    const droneDSPCode = dronedsp.childPlainText.content
    const droneSettings = prt.childPlainText.content.replace(/puretones/g,'FaustDSP')
    const scaleDSPCode = scaledsp.childPlainText.content
    const scaleSettings = pkb.childPlainText.content.replace(/musicscale/g,'FaustDSP')
    const {dispatch} = React.useContext(AudioEnv)
    let defaultDroneState = {}
    droneSettings.split('\n').forEach((s) => {
        let [value, path] = s.split(' ')
        if(value && path)
            defaultDroneState[`${path}`] = value
    })
    let defaultScaleState = {}
    scaleSettings.split('\n').forEach((s) => {
        let [value, path] = s.split(' ')
        if(value && path)
            defaultScaleState[`${path}`] = value
    })
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
                return Object.entries(droneLocalState).map(item => `${item[1]} ${item[0]}`).join('\n').replace(/FaustDSP/g,'puretones')
            case 'scale':
                return Object.entries(scaleLocalState).map(item => `${item[1]} ${item[0]}`).join('\n').replace(/FaustDSP/g,'musicscale')
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
                snapshot = snapshot.replace(/puretones/g,'FaustDSP')
                snapshot.split('\n').forEach((s) => {
                    let [value, path] = s.split(' ')
                    if(value && path)
                        newDroneState[`${path.trim()}`] = value.trim()
                })
                dispatch({type: 'Configure', appname: appname, settings: newDroneState})
                setDroneLocalState({...newDroneState})
                newScaleState = scaleLocalState
                newScaleState['/FaustDSP/Common_Parameters/Pitch'] = newDroneState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency']
                newScaleState['/FaustDSP/Common_Parameters/Fine_Tune'] = newDroneState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune']
                dispatch({type: 'Configure', appname: 'scale', settings: newScaleState})
                setScaleLocalState({...newScaleState})
                break
            case 'scale':
                snapshot = snapshot.replace(/musicscale/g,'FaustDSP')
                snapshot.split('\n').forEach((s) => {
                    let [value, path] = s.split(' ')
                    if(value && path)
                        newScaleState[`${path.trim()}`] = value.trim()
                })
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
    const commonFreqParams = {
        key: "Key",
        default: Number(droneState['/FaustDSP/PureTones_v1.0/0x00/Common_Frequency']),
        options: [
            {
                value: "14",
                text: "B"
            },
            {
                value: "13",
                text: "A#"
            },
            {
                value: "12",
                text: "A"
            },
            {
                value: "11",
                text: "G#"
            },
            {
                value: "10",
                text: "G"
            },
            {
                value: "9",
                text: "F#"
            },
            {
                value: "8",
                text: "F"
            },
            {
                value: "7",
                text: "E"
            },
            {
                value: "6",
                text: "D#"
            },
            {
                value: "5",
                text: "D"
            },
            {
                value: "4",
                text: "C#"
            },
            {
                value: "3",
                text: "C"
            }
        ]
    }
    
    let offsetParams = {
        key: "Offset",
        init: Number(droneState['/FaustDSP/PureTones_v1.0/0x00/Fine_Tune']),
        max: 100,
        min: -100,
        step: 1
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
            <br />
            <Selector params={commonFreqParams} path='/FaustDSP/PureTones_v1.0/0x00/Common_Frequency' onParamUpdate={(value,path) => updateParameter('drone',value,path)}></Selector>
            <Slider params={offsetParams} path='/FaustDSP/PureTones_v1.0/0x00/Fine_Tune' onParamUpdate={(value,path) => updateParameter('drone',value,path)} ></Slider>
            <br />
            <TabNav tablist={mainNavTabs} pagelist={mainNavPages}></TabNav>
        </>
    )
}

export default MusicRoom