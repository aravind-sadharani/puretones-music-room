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
                    faust.ready.then(() => {
                        faust.getNode(composition, { audioCtx, useWorklet: false, bufferSize: 16384, args: { "-I": "libraries/"} }).then(node => {
                          window.node = node
                          node.connect(audioCtx.destination)
                        }, reason => {
                          console.log(composition)
                          console.log(reason)
                        })
                      }, reason => {
                        console.log(reason)
                    })
                    window.faust = faust
                    state.faustReady = true
                } else {
                    let faust = window.faust
                    let audioCtx = window.audioCtx
                    faust.getNode(composition, { audioCtx, useWorklet: false, bufferSize: 16384, args: { "-I": "libraries/"} }).then(node => {
                        window.node = node
                        node.connect(audioCtx.destination)
                    }, reason => {
                        console.log(composition)
                        console.log(reason)
                    })
                }
                return state
            case 'Stop':
                let audioCtx = window.audioCtx
                let node = window.node
                if(node) {
                    node.disconnect(audioCtx.destination)
                    node.destroy()
                }
                return state
            case 'Configure':
                console.log(action.code)
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