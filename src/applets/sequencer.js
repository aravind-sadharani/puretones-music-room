import * as React from "react"
import TabNav from "components/tabs"
import SessionControls from "applets/sessioncontrols"
import SequencerVoice from "applets/sequencervoice"
import Slider from "components/slider"
import MIDIExport from "applets/midiexport"
import generateDSP from "utils/generatedsp"
import sequencerPSQ from 'data/default.psq'

const Sequencer = ({sequencerState,sequencerName,scaleState,onVoiceParamUpdate,reset,save,restore,tempo,updateTempo}) => {
    let safeSequencerState = {...JSON.parse(sequencerPSQ),...sequencerState}
    const generate = () => generateDSP(safeSequencerState,scaleState)
    let sequencerSettings = {}
    sequencerSettings['/FaustDSP/Motif/Pitch'] = scaleState['/FaustDSP/Common_Parameters/Pitch']
    sequencerSettings['/FaustDSP/Motif/Fine_Tune'] = scaleState['/FaustDSP/Common_Parameters/Fine_Tune']
    sequencerSettings['/FaustDSP/Motif/Motif_Tempo'] = Math.log2(240/tempo)
    let indices = [0, 1, 2, 3, 4, 5, 6]
    indices.forEach((i) => {
        if(safeSequencerState[i]['enabled']) {
            sequencerSettings[`/FaustDSP/Motif/_voice_${i+1}/Pan`] = Number(safeSequencerState[i]['pan'])/100 || 0.5
            sequencerSettings[`/FaustDSP/Motif/_voice_${i+1}/Gain`] = Number(safeSequencerState[i]['gain']) || -9    
        }
    })
    const tempoParams = {
        key: "Tempo (BPM)",
        init: Number(tempo),
        max: 240,
        min: 60,
        step: 1
    }
    const voiceTabs = ['Voice 1', 'Voice 2', 'Voice 3', 'Voice 4', 'Voice 5', 'Voice 6', 'Voice 7']
    const voicePages = voiceTabs.map((v,i) => {
        return <SequencerVoice index={i} title={v} sequencerVoiceState={safeSequencerState[i]} onVoiceParamUpdate={onVoiceParamUpdate} />
    })
    return (
        <>
            <p><strong>Sequencer Controls {sequencerName}</strong></p>
            <SessionControls appname='sequencer' settings={sequencerSettings} reset={reset} generate={generate} save={save} restore={restore}/>
            <p><strong>Sequencer Parameters</strong></p>
            <Slider params={tempoParams} path='/FaustDSP/Motif/Motif_Tempo' onParamUpdate={updateTempo}></Slider>
            <TabNav tablist={voiceTabs} pagelist={voicePages} />
            <MIDIExport sequencerState={sequencerState} sequencerSettings={sequencerSettings} scaleState={scaleState} sequencerName={sequencerName} />
        </>
    )
}

export default Sequencer