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
    const [state, dispatch] = React.useReducer((state,action) => {
        switch(action.type) {
            case 'Play':
                let composition = action.code
                if(!state.audioContextReady) {
                    let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
                    if(audioCtx.state === "suspended")
                        audioCtx.resume()
                    window.audioCtx = audioCtx
                    state.audioContextReady = true
                }
                if(!state.faustReady) {
                    let audioCtx = window.audioCtx
                    let faust = new window.Faust2WebAudio.Faust({debug: false, wasmLocation: "/Faustlib/libfaust-wasm.wasm", dataLocation: "/Faustlib/libfaust-wasm.data"})
                    let faustArgs = { audioCtx, useWorklet: false, buffersize: 16384, args: {"-I": "libraries/"} }
                    if(action.appname === 'Scale') {
                        faustArgs['voices'] = 16
                        faustArgs['buffersize'] = 1024
                    }
                    faust.ready.then(() => {
                        faust.getNode(composition, faustArgs).then(node => {
                          window[`${action.appname}node`] = node
                          node.connect(audioCtx.destination)
                          Object.entries(action.settings).forEach(s => node.setParamValue(s[0],s[1]))
                          action.onJobComplete('Play')
                        }, reason => {
                          console.log(composition)
                          console.log(reason)
                        })
                      }, reason => {
                        console.log(reason)
                    })
                    window.faust = faust
                    state.faustReady = true
                    state[`${action.appname}Playing`] = true
                } else {
                    let faust = window.faust
                    let audioCtx = window.audioCtx
                    let node = window[`${action.appname}node`]
                    let faustArgs = { audioCtx, useWorklet: false, buffersize: 16384, args: {"-I": "libraries/"} }
                    if(action.appname === 'Scale') {
                        faustArgs['voices'] = 16
                        faustArgs['buffersize'] = 1024
                    }
                    if(node) {
                        node.connect(audioCtx.destination)
                        Object.entries(action.settings).forEach(s => node.setParamValue(s[0],s[1]))
                        action.onJobComplete('Play')
                    } else {
                        faust.getNode(composition, faustArgs).then(node => {
                            window[`${action.appname}node`] = node
                            node.connect(audioCtx.destination)
                            Object.entries(action.settings).forEach(s => node.setParamValue(s[0],s[1]))
                            action.onJobComplete('Play')
                        }, reason => {
                            console.log(composition)
                            console.log(reason)
                        })
                    }
                    state[`${action.appname}Playing`] = true
                }
                return state
            case 'Stop':
                let audioCtx = window.audioCtx
                let node = window[`${action.appname}node`]
                if(node) {
                    node.disconnect(audioCtx.destination)
                    action.onJobComplete('Stop')
                }
                state[`${action.appname}Playing`] = false
                return state
            case 'Configure':
                if(state[`${action.appname}Playing`]) {
                    let node = window[`${action.appname}node`]
                    Object.entries(action.settings).forEach(s => node.setParamValue(s[0],s[1]))
                }
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