const SLICE = 100
const MAXHARMONICS = 64
const OCTAVE = 1200
const EPSILON = 0.001
const AFREQ = 55
const noteRatios = [2,243/128,16/9,27/16,128/81,3/2,729/512,4/3,81/64,32/27,9/8,256/243,1]
const ratioFromName = {'SA': 2, 'Ni': 243/128, 'ni': 16/9, 'Dha': 27/16, 'dha': 128/81, 'Pa': 3/2, 'Ma': 729/512, 'ma': 4/3, 'Ga': 81/64, 'ga': 32/27, 'Re': 9/8, 're': 256/243, 'Sa': 1}
const octaveGainConstants = [0.04, 0.04, 0.03, 0.04, 0.01, 0.003]
const stringDelay = [0,0.3,0.6,0.5,0.8,0.1]

const analyzeDroneOnce = (commonSettings,droneState,activeDroneStrings,scaleState,activeScaleNotes,resolution,noiseFloor,time) => {
    let strings = activeDroneStrings.map(name => {
        let basePath = `/FaustDSP/PureTones_v1.0/0x00/${name}`
        let baseNote = Number(droneState[`${basePath}/Select_Note`])
        let baseRatio = noteRatios[baseNote]
        let centOffset = droneState[`${basePath}/Fine_Tune`]
        centOffset = centOffset === undefined ? 0 : Number(centOffset)
        let subCentOffset = droneState[`${basePath}/Ultrafine_Tune`]
        subCentOffset = subCentOffset === undefined ? 0 : Number(subCentOffset)
        let pitch = baseRatio*(2**((centOffset + subCentOffset/100)/1200))
        return {
            pitch: pitch,
            basepath: basePath,
        }
    }).filter(string => (Number(droneState[`${string.basepath}/Play_String/Loop`]) === 1))

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

    const getFreq = () => {
        let pitchNumber = Number(commonSettings['pitch'])
        let offSet = Number(commonSettings['offSet'])

        return AFREQ*(2**(pitchNumber/12))*(2**(offSet/OCTAVE))
    }

    const getADSRLevel = (harmonic,time,period) => {
        let ADSRTimeFactors = []
        if(harmonic > 16) {
            ADSRTimeFactors = [0.1*period,0.3*period,0.2,0.3*period]
        } else if(harmonic > 4) {
            ADSRTimeFactors = [0.2*period,0.4*period,0.4,0.4*period]
        } else {
            ADSRTimeFactors = [0.1*period,0.5*period,0.6,0.5*period]
        }

        let ADSRLevel
        if(time < ADSRTimeFactors[0]) {
            ADSRLevel = time/ADSRTimeFactors[0]
        } else if(time < ADSRTimeFactors[0]+ADSRTimeFactors[1]) {
            ADSRLevel = (1 - (time - ADSRTimeFactors[0])*(1 - ADSRTimeFactors[2])/ADSRTimeFactors[1])
        } else {
            ADSRLevel = (ADSRTimeFactors[2] - (time - ADSRTimeFactors[0] - ADSRTimeFactors[1])*ADSRTimeFactors[2]/ADSRTimeFactors[3])
        }

        return ADSRLevel
    }

    const getTimeGain = (stringPath,pitch,harmonic,time) => {
        if(time < 0)
            return 1

        let period = Number(droneState[`/FaustDSP/PureTones_v1.0/0x00/Period`])
        let stringIndex = Number(stringPath.replace('/FaustDSP/PureTones_v1.0/0x00/','')[0]) - 1

        if(stringIndex < 3)
            period -= 0.2
        else
            period += 0.2
        
        let adjustedTime = (time + stringDelay[stringIndex]*period) % period

        let stringOn = getADSRLevel(harmonic,adjustedTime,period)

        let variance = Number(droneState[`${stringPath}/Variance`])
        let stringBeat = Math.cos(2*Math.PI*pitch*(getFreq())*harmonic*variance*time/10000)

        return stringOn*stringBeat
    }

    const getAmplitude = (stringpath,pitch,harmonic,time) => {
        let timeGain = getTimeGain(stringpath,pitch,harmonic,time)

        let stringdBGain = Number(droneState[`${stringpath}/Gain`])
        let stringRatio = noteRatios[Number(droneState[`${stringpath}/Select_Note`])]
        let stringGain = (10**(stringdBGain/20))/stringRatio

        let octave = harmonic === 1 ? 1 : Math.floor(Math.log2(harmonic-1)) + 1
        let octaveGain = Number(droneState[`${stringpath}/Octave_${octave}`])*octaveGainConstants[octave-1]

        let octaveOffset = harmonic - 2**(octave-1) - 1
        let octaveDecay = harmonic === 1 ? 1 : (harmonic === 2 ? 1.42 : (0.5)**(octaveOffset))

        return timeGain*stringGain*octaveGain*octaveDecay
    }

    for(let i = 1; i <= MAXHARMONICS; i++) {
        strings.forEach(string => {
            let ratio = i*string.pitch
            let amplitude = getAmplitude(string.basepath,string.pitch,i,time)
            addRatio(ratio, amplitude)
        })
        for(let j = 1; j<= MAXHARMONICS; j++) {
            stringPairs.forEach(pair => {
                let ratio = Math.abs(i*pair[0].pitch-j*pair[1].pitch)
                let amplitude = getAmplitude(pair[0].basepath,pair[0].pitch,i,time)*getAmplitude(pair[1].basepath,pair[1].pitch,j,time)
                addRatio(ratio, amplitude)
                ratio = i*pair[0].pitch+j*pair[1].pitch
                amplitude = getAmplitude(pair[0].basepath,pair[0].pitch,i,time)*getAmplitude(pair[1].basepath,pair[1].pitch,j,time)
                addRatio(ratio, amplitude)
            })
        }
    } 

    relevantTones = relevantTones.map(tone => ({
        ratio: tone.ratio,
        amplitude: todB(tone.amplitude),
        refAmplitude: 0,
    }))

    let maxAmplitude = relevantTones[0].amplitude
    relevantTones.forEach(tone => {
        if(maxAmplitude < tone.amplitude)
            maxAmplitude = tone.amplitude
    })

    let scaleConfig = activeScaleNotes.map(note =>{
        let basePath = `/FaustDSP/Common_Parameters/12_Note_Scale`
        let centOffset = scaleState[`${basePath}/${note}/Cent`]
        centOffset = centOffset === undefined ? 0 : Number(centOffset)
        let subCentOffset = scaleState[`${basePath}/${note}/0.01_Cent`]
        subCentOffset = subCentOffset === undefined ? 0 : Number(subCentOffset)
        return ratioFromName[`${note}`]*(2**((centOffset + subCentOffset/100)/1200))
    })
    scaleConfig.forEach((ratio,index) => {
        let scaleRatio
        if(activeScaleNotes[index] === 'SA' || activeScaleNotes[index] === 'Sa') {
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
        
    return relevantTones
}

onmessage = (e) => {
    const {commonSettings,droneState,activeDroneStrings,scaleState,activeScaleNotes,resolution,noiseFloor,mode,duration} = e.data

    if(mode === 0) {
        postMessage({
            status: true,
            pitches: analyzeDroneOnce(commonSettings,droneState,activeDroneStrings,scaleState,activeScaleNotes,resolution,noiseFloor,-1),
        })
    } else {
        let pitchData = []

        for(let time=0; time<duration; time+=duration/SLICE) {
            pitchData.push(analyzeDroneOnce(commonSettings,droneState,activeDroneStrings,scaleState,activeScaleNotes,resolution,noiseFloor,time))
            postMessage({
                status: false,
                progress: Math.floor(time*SLICE/duration),
            })
        }
        postMessage({
            status: true,
            pitches: pitchData,
        })
    }
}