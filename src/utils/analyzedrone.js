const MAXHARMONICS = 64
const OCTAVE = 1200
const EPSILON = 0.001
const noteRatios = [2,243/128,16/9,27/16,128/81,3/2,729/512,4/3,81/64,32/27,9/8,256/243,1]
const noteNames = ['SA','Ni','ni','Dha','dha','Pa','Ma','ma','Ga','ga','Re','re','Sa']
const stringNames = ['1st_String', '2nd_String', '3rd_String', '4th_String', '5th_String', '6th_String']
const octaveGainConstants = [0.04, 0.04, 0.03, 0.04, 0.01, 0.003]

const analyzeDrone = (droneState,scaleState,resolution,noiseFloor) => {
    let stringConfig = stringNames.map(name => {
        let basePath = `/FaustDSP/PureTones_v1.0/0x00/${name}`
        return ({
            value: Number(droneState[`${basePath}/Select_Note`]),
            finetune: Number(droneState[`${basePath}/Fine_Tune`]),
            ultrafinetune: Number(droneState[`${basePath}/Ultrafine_Tune`]),
        })
    })

    let strings = stringConfig.map((s,i) => ({
        pitch: noteRatios[Number(s.value)]*(2**((Number(s.finetune) + Number(s.ultrafinetune)/100)/1200)),
        basepath: `/FaustDSP/PureTones_v1.0/0x00/${stringNames[i]}`,
    }))

    let stringPairs = []
    strings.forEach((string,index) => {
        for(let pairIndex = index+1; pairIndex < strings.length; pairIndex++) {
            stringPairs.push([string,strings[pairIndex]])
        }
    })

    let relevantTones = []
    for(let i=0;i<Math.ceil(OCTAVE/resolution);i++) {
        relevantTones[i] = {
            ratio: i*resolution,
            amplitude: 0,
            refAmplitude: 0,
        }
    }

    const isAudible = ratio => (ratio > 1/4 - EPSILON) && (ratio < 64 + EPSILON)

    const toCents = ratio => {
        let baseCents = OCTAVE*Math.log2(ratio)
        while(baseCents < 0)
            baseCents += OCTAVE
        return baseCents % OCTAVE
    }

    const todB = amp => {
        if(amp === 0)
            return 0
        let ampdB = 20*Math.log10(amp) - noiseFloor
        if(ampdB < 0)
            return 0
        return ampdB
    }

    const addRatio = (ratio,amplitude) => {
        if(ratio === 0 || !isAudible(ratio))
            return
        
        let centRatio = toCents(ratio)
        let index = Math.floor(((centRatio + resolution/2) % OCTAVE)/resolution)
        relevantTones[index].amplitude += amplitude
    }

    const getAmplitude = (stringpath,harmonic) => {
        let stringdBGain = Number(droneState[`${stringpath}/Gain`])
        let stringRatio = noteRatios[Number(droneState[`${stringpath}/Select_Note`])]
        let stringGain = (10**(stringdBGain/20))/stringRatio

        let octave = harmonic === 1 ? 1 : Math.floor(Math.log2(harmonic-1)) + 1
        let octaveGain = Number(droneState[`${stringpath}/Octave_${octave}`])*octaveGainConstants[octave-1]

        let octaveOffset = harmonic - 2**(octave-1) - 1
        let octaveDecay = harmonic === 1 ? 1 : (harmonic === 2 ? 1.42 : (0.5)**(octaveOffset))

        return stringGain*octaveGain*octaveDecay
    }

    for(let i = 1; i <= MAXHARMONICS; i++) {
        strings.forEach(string => {
            let ratio = i*string.pitch
            let amplitude = getAmplitude(string.basepath,i)
            addRatio(ratio, amplitude)
        })
        for(let j = 1; j<= MAXHARMONICS; j++) {
            stringPairs.forEach(pair => {
                let ratio = Math.abs(i*pair[0].pitch-j*pair[1].pitch)
                let amplitude = getAmplitude(pair[0].basepath,i)*getAmplitude(pair[1].basepath,j)
                addRatio(ratio, amplitude)
                ratio = i*pair[0].pitch+j*pair[1].pitch
                amplitude = getAmplitude(pair[0].basepath,i)*getAmplitude(pair[1].basepath,j)
                addRatio(ratio, amplitude)
            })
        }
    } 

    relevantTones = relevantTones.map(tone => ({
        ratio: tone.ratio,
        amplitude: todB(tone.amplitude),
        refAmplitude: 0,
    })).sort((tone1, tone2) => tone2.amplitude - tone1.amplitude)

    let status = true
    let message = `Drone Analysis with ${stringConfig.length} strings tuned as\n  ${stringConfig.map((s,i) => `${noteNames[s.value]} (${Number(s.finetune) + Number(s.ultrafinetune)/100})${(i+1) % 3 === 0 ? '\n  ' : ', '}`).join('')}\n`

    let relevantTonesPrintableHeader = '  Ratio\t\tCents    \tSNR (in dB)\n'
    let relevantTonesPrintable = relevantTones.filter(tone => tone.amplitude > 0).map(tone => `  ${(2**(tone.ratio/1200)).toFixed(5)}\t${' '.repeat(7-tone.ratio.toFixed(2).length)}${tone.ratio.toFixed(2)} ¢\t${' '.repeat(6-tone.amplitude.toFixed(2).length)}${tone.amplitude.toFixed(2)} dB`).join('\n')

    message = `${message}${relevantTonesPrintableHeader}${relevantTonesPrintable}`

    let maxAmplitude = relevantTones[0].amplitude
    relevantTones.sort((tone1, tone2) => tone1.ratio - tone2.ratio)

    let scaleConfig = noteNames.map((note,index) =>{
        let basePath = `/FaustDSP/Common_Parameters/12_Note_Scale`
        let centOffset = scaleState[`${basePath}/${note}/Cent`]
        centOffset = centOffset === undefined ? 0 : Number(centOffset)
        let subCentOffset = scaleState[`${basePath}/${note}/0.01_Cent`]
        subCentOffset = subCentOffset === undefined ? 0 : Number(subCentOffset)
        return noteRatios[index]*(2**((centOffset + subCentOffset/100)/1200))
    })
    scaleConfig.forEach((ratio,index) => {
        let scaleRatio
        if(noteNames[index] === 'SA' || noteNames[index] === 'Sa') {
            scaleRatio = OCTAVE*Math.log2(ratio)
            if(scaleRatio < -resolution/2 || scaleRatio > Math.ceil(OCTAVE/resolution)*resolution - resolution/2) {
                relevantTones.push({
                    ratio: scaleRatio,
                    amplitude: 0,
                    refAmplitude: maxAmplitude - 12,
                })
                return
            }
        } else
            scaleRatio = toCents(ratio)

        let scaleIndex = Math.floor((scaleRatio + resolution/2)/resolution)
        relevantTones[scaleIndex].refAmplitude = maxAmplitude - 12
    })
    
    relevantTones.sort((tone1, tone2) => tone2.ratio - tone1.ratio)
    
    return {
        status: status,
        message: message,
        pitches: relevantTones,
    }
}

export {analyzeDrone}