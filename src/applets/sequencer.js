import * as React from "react"
import TabNav from "components/tabs"
import SessionControls from "applets/sessioncontrols"
import SequencerVoice from "applets/sequencervoice"
import Slider from "components/slider"
import generateDSP from "utils/generatedsp"

const Sequencer = ({sequencerState,sequencerName,scaleState,onVoiceParamUpdate,reset,save,restore,tempo,updateTempo}) => {
    const generate = () => generateDSP(sequencerState,scaleState)
    let sequencerSettings = {}
    sequencerSettings['/FaustDSP/Motif/Pitch'] = scaleState['/FaustDSP/Common_Parameters/Pitch']
    sequencerSettings['/FaustDSP/Motif/Fine_Tune'] = scaleState['/FaustDSP/Common_Parameters/Fine_Tune']
    sequencerSettings['/FaustDSP/Motif/Motif_Tempo'] = Math.log2(240/tempo)
    Object.entries(sequencerState).forEach((state) => {
        sequencerSettings[`/FaustDSP/Motif/${state[1]['voiceName']}/Pan`] = Number(state[1]['pan'])/100 || 0.5
        sequencerSettings[`/FaustDSP/Motif/${state[1]['voiceName']}/Gain`] = Number(state[1]['gain']) || -9
    })
    const tempoParams = {
        key: "Tempo (BPM)",
        init: Number(tempo),
        max: 240,
        min: 60,
        step: 1
    }
    const voiceTabs = ['Voice 1', 'Voice 2', 'Voice 3']
    const voicePages = voiceTabs.map((v,i) => {
        return <SequencerVoice index={i} title={v} sequencerVoiceState={sequencerState[i]} onVoiceParamUpdate={onVoiceParamUpdate} />
    })
    return (
        <>
            <p><strong>Sequencer Controls {sequencerName}</strong></p>
            <SessionControls appname='sequencer' settings={sequencerSettings} reset={reset} generate={generate} save={save} restore={restore}/>
            <p><strong>Sequencer Parameters</strong></p>
            <Slider params={tempoParams} path='/FaustDSP/Motif/Motif_Tempo' onParamUpdate={updateTempo}></Slider>
            <TabNav tablist={voiceTabs} pagelist={voicePages} />
        </>
    )
}

export default Sequencer