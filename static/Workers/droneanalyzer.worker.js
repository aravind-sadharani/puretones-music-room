const SLICE = 100
const MAXHARMONICS = 64
const OCTAVE = 1200
const EPSILON = 0.001
const FREQ = 87.31
const noteRatios = [2,243/128,16/9,27/16,128/81,3/2,729/512,4/3,81/64,32/27,9/8,256/243,1]
const noteNames = ['SA','Ni','ni','Dha','dha','Pa','Ma','ma','Ga','ga','Re','re','Sa']
const stringNames = ['1st_String', '2nd_String', '3rd_String', '4th_String', '5th_String', '6th_String']
const octaveGainConstants = [0.04, 0.04, 0.03, 0.04, 0.01, 0.003]
const stringDelay = [0,0.3,0.6,0.5,0.8,0.1]

const analyzeDroneOnce = (droneState,scaleState,resolution,noiseFloor,time) => {
    let strings = stringNames.map(name => {
        let basePath = `/FaustDSP/PureTones_v1.0/0x00/${name}`
        let baseNote = Number(droneState[`${basePath}/Select_Note`])
        let baseRatio = noteRatios[baseNote]
        let centOffset = Number(droneState[`${basePath}/Fine_Tune`])
        let subCentOffset = Number(droneState[`${basePath}/Ultrafine_Tune`])
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

    const getTimeGain = (stringPath,pitch,harmonic,time) => {
        if(time < 0)
            return 1

        let period = droneState[`/FaustDSP/PureTones_v1.0/0x00/Period`]
        let stringIndex = Number(stringPath.replace('/FaustDSP/PureTones_v1.0/0x00/','')[0]) - 1

        if(stringIndex < 3)
            period -= 0.2
        else
            period += 0.2
        
        let adjustedTime = (time + stringDelay[stringIndex]*period) % period
        let stringOn = 1

        if(harmonic > 16)
            stringOn = adjustedTime < 0.6*period ? 1 : 0
        else if(harmonic > 4)
            stringOn = adjustedTime < 0.8*period ? 1 : 0

        let variance = droneState[`${stringPath}/Variance`]
        let stringBeat = Math.cos(2*Math.PI*pitch*FREQ*harmonic*variance*time/10000)

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
        
    return relevantTones
}

onmessage = (e) => {
    const {droneState,scaleState,resolution,noiseFloor,mode,duration} = e.data

    if(mode === 0) {
        postMessage({
            status: true,
            pitches: analyzeDroneOnce(droneState,scaleState,resolution,noiseFloor,-1),
        })
    } else {
        let pitchData = []

        for(let time=0; time<duration; time+=duration/SLICE) {
            pitchData.push(analyzeDroneOnce(droneState,scaleState,resolution,noiseFloor,time))
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