import * as React from "react"

const initialState = {
    faustReady: false,
    audioContextReady: false,
    dronePlaying: false,
    scalePlaying: false, 
    sequencerPlaying: false
}

const apps = ['drone', 'scale', 'sequencer']

const AudioEnv = React.createContext(initialState)

const dspNames = {
    drone: 'puretones',
    scale: 'musicscale',
    sequencer: 'FaustDSP'
}

const AudioEnvProvider = ({children}) => {
    const applySettings = (appname,node,settings) => {
        let dspName = dspNames[`${appname}`]
        Object.entries(settings).forEach(s => node.setParamValue(s[0].replace(/FaustDSP/g,`${dspName}`),s[1]))
    }
    const handleMIDIMessage = (node,data) => {
        const cmd = data[0] >> 4
        const channel = data[0] & 0xf
        const data1 = Number(data[1])
        const data2 = data[2]
        if (channel === 9) return undefined
        if (cmd === 8 || (cmd === 9 && data2 === 0)) return node.keyOff(channel, data1, data2)
        if (cmd === 9) return node.keyOn(channel, data1, data2)
        if (cmd === 11) return node.ctrlChange(channel, data1, data2)
        if (cmd === 14) return node.pitchWheel(channel, (data2 * 128.0 + data1))
    }
    const playDSP = (audioCtx,faust,DSPCode,faustArgs,action) => {
        const startDSPNode = (node) => {
            apps.forEach((otherapp) => {
                if(otherapp !== action.appname && state[`${otherapp}Playing`])
                    window[`${otherapp}node`].connect(audioCtx.destination)
            })
            window[`${action.appname}node`] = node
            node.connect(audioCtx.destination)
            if(action.settings)
                applySettings(action.appname,node,action.settings)
            action.onJobComplete('Play')
        }
        const unableToStartDSPNode = (reason) => {
            console.log(reason)
            action.onJobComplete('Error')
        }
        apps.forEach((otherapp) => {
        if(otherapp !== action.appname && state[`${otherapp}Playing`])
            window[`${otherapp}node`].disconnect(audioCtx.destination)
        })
        if(action.appname === 'drone') {
            let puretones = window.puretones
            puretones.createDSP(audioCtx,faustArgs.buffersize).then(startDSPNode,unableToStartDSPNode)
        } else if(action.appname === 'scale'){
            let musicscale = window.musicscalePoly
            musicscale.createDSP(audioCtx,faustArgs.buffersize,faustArgs.voices).then(startDSPNode,unableToStartDSPNode)
        } else {
            faust.getNode(DSPCode, faustArgs).then(startDSPNode,unableToStartDSPNode)
        }
    }
    const [state, dispatch] = React.useReducer((state,action) => {
        let audioCtx
        switch(action.type) {
            case 'Init':
                if(!state.audioContextReady && !window.audioCtx) {
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
                    if(audioCtx.state === "suspended")
                        audioCtx.resume()
                    window.audioCtx = audioCtx
                    state.audioContextReady = true
                }
                return state
            case 'Play':
                if(!state[`${action.appname}Playing`]) {
                    audioCtx = window.audioCtx
                    let DSPCode = action.code
                    let faustArgs = { audioCtx, useWorklet: false, buffersize: 1024, args: {"-I": "libraries/"} }
                    if(action.appname === 'scale') {
                        faustArgs['voices'] = 16
                    }
                    if(!state.faustReady && action.appname === 'sequencer') {
                        let faust = new window.Faust2WebAudio.Faust({debug: false, wasmLocation: "/Faustlib/libfaust-wasm.wasm", dataLocation: "/Faustlib/libfaust-wasm.data"})
                        faust.ready.then(() => {
                            window.faust = faust
                            state.faustReady = true    
                            playDSP(audioCtx,faust,DSPCode,faustArgs,action)
                        }, reason => {
                            console.log(reason)
                        })
                    } else {
                        let faust = window.faust
                        let node = window[`${action.appname}node`]
                        if(node) {
                            node.connect(audioCtx.destination)
                            if(action.settings)
                                applySettings(action.appname,node,action.settings)
                            action.onJobComplete('Play')
                        } else {
                            playDSP(audioCtx,faust,DSPCode,faustArgs,action)
                        }
                    }
                    state[`${action.appname}Playing`] = true
                }
                return state
            case 'Stop':
                if(state[`${action.appname}Playing`]) {
                    audioCtx = window.audioCtx
                    let node = window[`${action.appname}node`]
                    if(node) {
                        try{
                            node.disconnect(audioCtx.destination)
                        } catch(err) {
                            console.log(err,node,action)
                        }
                        if(action.onJobComplete)
                            action.onJobComplete('Stop')
                        node.destroy()
                        delete window[`${action.appname}node`]
                    }
                    state[`${action.appname}Playing`] = false
                }
                return state
            case 'Configure':
                if(state[`${action.appname}Playing`]) {
                    let node = window[`${action.appname}node`]
                    applySettings(action.appname,node,action.settings)
                }
                return state
            case 'MIDI':
                if(state['scalePlaying'] && action.appname === 'scale')
                    handleMIDIMessage(window['scalenode'],action.message)
//                    window['scalenode'].midiMessage(action.message)
                return state
            default:
                return state
        }
    }, initialState)

    return (
        <AudioEnv.Provider value={{state, dispatch}}>
            {children}
        </AudioEnv.Provider>
    )
}

export {AudioEnv, AudioEnvProvider}