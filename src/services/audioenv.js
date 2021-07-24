import * as React from "react"

const initialState = {
    faustReady: false,
    audioContextReady: false,
    dronePlaying: false,
    scalePlaying: false, 
    sequencerPlaying: false
}

const AudioEnv = React.createContext(initialState)

const AudioEnvProvider = ({children}) => {
    const playDSP = (audioCtx,faust,DSPCode,faustArgs,action) => {
        faust.getNode(DSPCode, faustArgs).then(node => {
            window[`${action.appname}node`] = node
            node.connect(audioCtx.destination)
            if(action.settings)
                Object.entries(action.settings).forEach(s => node.setParamValue(s[0],s[1]))
            action.onJobComplete('Play')
          }, reason => {
            console.log(reason)
            action.onJobComplete('Error')
          })
    }
    const [state, dispatch] = React.useReducer((state,action) => {
        let audioCtx
        switch(action.type) {
            case 'Play':
                let DSPCode = action.code
                if(!state.audioContextReady) {
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
                    if(audioCtx.state === "suspended")
                        audioCtx.resume()
                    window.audioCtx = audioCtx
                    state.audioContextReady = true
                }
                audioCtx = window.audioCtx
                let faustArgs = { audioCtx, useWorklet: false, buffersize: 16384, args: {"-I": "libraries/"} }
                if(action.appname === 'scale') {
                    faustArgs['voices'] = 16
                    faustArgs['buffersize'] = 1024
                }
                if(!state.faustReady) {
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
                            Object.entries(action.settings).forEach(s => node.setParamValue(s[0],s[1]))
                        action.onJobComplete('Play')
                    } else {
                        playDSP(audioCtx,faust,DSPCode,faustArgs,action)
                    }
                }
                state[`${action.appname}Playing`] = true
                return state
            case 'Stop':
                audioCtx = window.audioCtx
                let node = window[`${action.appname}node`]
                if(node) {
                    node.disconnect(audioCtx.destination)
                    action.onJobComplete('Stop')
                    if(action.appname === 'sequencer') {
                        node.destroy()
                        delete window[`${action.appname}node`]
                    }
                }
                state[`${action.appname}Playing`] = false
                return state
            case 'Configure':
                if(state[`${action.appname}Playing`]) {
                    let node = window[`${action.appname}node`]
                    Object.entries(action.settings).forEach(s => node.setParamValue(s[0],s[1]))
                }
                return state
            case 'MIDI':
                if(state['scalePlaying'] && action.appname === 'scale')
                    window['scalenode'].midiMessage(action.message)
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