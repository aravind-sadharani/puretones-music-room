import * as React from "react"
import TabNav from "components/tabs"
import Selector from "components/selector"
import Slider from "components/slider"
import Toggle from 'components/toggle'
import ScaleString from "applets/scalestring"
import SessionControls from "applets/sessioncontrols"
import Keyboard from "applets/keyboard"
import ListenToKeyStrokes from "services/keystroke"

const isBrowser = typeof window !== "undefined"

const Scale = ({scaleDSPCode, scaleState, onParamUpdate, onMIDIMessage, reset, save, restore}) => {
    const scaleTabs = ['Sa', 're', 'Re', 'ga', 'Ga', 'ma', 'Ma', 'Pa', 'dha', 'Dha', 'ni', 'Ni', 'SA']
    let scalePages = scaleTabs.map((s) => {
        let basePath = `/FaustDSP/Common_Parameters/12_Note_Scale/${s}`
        let stringState = {}
        Object.entries(scaleState).filter(item => item[0].includes(`${basePath}`)).forEach(item => stringState[`${item[0]}`] = item[1])
        return <ScaleString title={s} stringState={stringState} basePath={basePath} onParamUpdate={(value,path) => onParamUpdate(value,path)} />
    })
    let octaveList = {
        key: "Octave",
        default: Number(scaleState['/FaustDSP/Common_Parameters/Octave']),
        options: [
            {
                value: 2,
                text: "Highest"
            },
            {
                value: 1,
                text: "High"
            },
            {
                value: 0,
                text: "Medium"
            },
            {
                value: -1,
                text: "Low"
            },
            {
                value: -2,
                text: "Lowest"
            }
        ]
    }
    let initSustainParams = {
        key: "Sustain",
        init: 2,
        max: 3,
        min: 0,
        step: 0.1
    }
    const [sustainParams,setSustain] = React.useState(initSustainParams)
    const updateSustain = (value) => {
        let newParams = sustainParams
        newParams['init'] = Number(value)
        setSustain({...newParams})
    }
    let levelParams = {
        key: "Level",
        init: Number(scaleState['/FaustDSP/Zita_Light/Level']),
        max: 30,
        min: -30,
        step: 0.5
    }
    const [keyState,setKeyState] = React.useState(Array(13).fill(0))
    const keyOn = (keyName) => {
        if(keyState[note2Offset[`${keyName}`]] === 0) {
            let newKeyState = keyState
            newKeyState[note2Offset[`${keyName}`]] = 1
            setKeyState([...newKeyState])
            onMIDIMessage([144,`${key2Midi(keyName)}`,50])
        }
    }
    const keyOff = (keyName) => {
        if(isBrowser) {
            window.setTimeout(() => {
                let newKeyState = keyState
                newKeyState[note2Offset[`${keyName}`]] = 0
                setKeyState([...newKeyState])
            },100)
            window.setTimeout(() => {
                onMIDIMessage([144,`${key2Midi(keyName)}`,0])
            },Number(sustainParams['init'])*2000)
        } else {
            let newKeyState = keyState
            newKeyState[note2Offset[`${keyName}`]] = 0
            setKeyState([...newKeyState])
            onMIDIMessage([144,`${key2Midi(keyName)}`,0])
        }
    }
    const octaveChange = (key) => {
        if(key === 'z')
            onParamUpdate(Math.max(Number(scaleState['/FaustDSP/Common_Parameters/Octave'])-1,-2) ,'/FaustDSP/Common_Parameters/Octave')
        if(key === 'x')
            onParamUpdate(Math.min(Number(scaleState['/FaustDSP/Common_Parameters/Octave'])+1,2) ,'/FaustDSP/Common_Parameters/Octave')
    }
    const note2Offset = {'Sa': 0, 're': 1, 'Re': 2, 'ga': 3, 'Ga': 4, 'ma': 5, 'Ma': 6, 'Pa': 7, 'dha': 8, 'Dha': 9, 'ni': 10, 'Ni': 11, 'SA': 12}
    const key2Midi = (keyName) => (Number(scaleState['/FaustDSP/Common_Parameters/Pitch']) - 3 + note2Offset[`${keyName}`] + 48 + Number(scaleState['/FaustDSP/Common_Parameters/Octave'])*12)
    const [keyStrokes, toggleKeyStrokes] = React.useState(false)
    const handleKeyStroke = (e) => {
        let notes = {a: "Sa", w: "re", s: "Re", e: "ga", d: "Ga", f: "ma", t: "Ma", g: "Pa", y: "dha", h: "Dha", u: "ni", j: "Ni", k: "SA"}
        if(e.target.type !== "text" && e.target.type !== 'textarea') {
            if(e.type === "keydown" && notes[e.key])
                keyOn(notes[e.key])
            if(e.type === "keyup" && notes[e.key])
                keyOff(notes[e.key])
            if(e.type === "keydown" && e.key === 'z')
                octaveChange(e.key)
            if(e.type === "keydown" && e.key === 'x')
                octaveChange(e.key)
        }
    }
    return (
        <>
            <p><strong>Scale Controls</strong></p>
            <SessionControls appname="scale" code={scaleDSPCode} settings={scaleState} reset={reset} save={save} restore={restore}/>
            <p><strong>Keyboard Controls</strong></p>
            <Toggle title='Computer Keyboard' status={keyStrokes} path='computer_keyboard' onParamUpdate={()=>toggleKeyStrokes(!keyStrokes)} />
            <Keyboard keyOn={keyOn} keyOff={keyOff} />
            <p></p>
            {keyStrokes && <ListenToKeyStrokes handleKeyStroke={handleKeyStroke} />}
            <p><strong>Scale Parameters</strong></p>
            <Selector params={octaveList} path="/FaustDSP/Common_Parameters/Octave" onParamUpdate={(value,path) => onParamUpdate(value,path)}></Selector>
            <Slider params={sustainParams} path="sustain" onParamUpdate={(value,path) => updateSustain(value)}></Slider>
            <Slider params={levelParams} path="/FaustDSP/Zita_Light/Level" onParamUpdate={(value,path) => onParamUpdate(value,path)}></Slider>
            <TabNav tablist={scaleTabs} pagelist={scalePages}></TabNav>
        </>
    )
}

export default Scale