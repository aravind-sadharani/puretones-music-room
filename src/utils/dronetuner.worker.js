const tuneDrone = ({data}) => {

    const SLICE = 100
    const MAXHARMONICS = 64
    const OCTAVE = 1200
    const EPSILON = 0.001
    const AFREQ = 55
    const TOLERANCE = 16
    const noteRatios = [2,243/128,16/9,27/16,128/81,3/2,729/512,4/3,81/64,32/27,9/8,256/243,1]
    const ratioFromName = {'SA': 2, 'Ni': 243/128, 'ni': 16/9, 'Dha': 27/16, 'dha': 128/81, 'Pa': 3/2, 'Ma': 729/512, 'ma': 4/3, 'Ga': 81/64, 'ga': 32/27, 'Re': 9/8, 're': 256/243, 'Sa': 1}
    const octaveGainConstants = [0.04, 0.04, 0.03, 0.04, 0.01, 0.003]
    const stringDelay = [0,0.3,0.6,0.5,0.8,0.1]

    const isAudible = ratio => (ratio > 1/4 - EPSILON) && (ratio < 64 + EPSILON)

    const toCents = ratio => {
        let baseCents = OCTAVE*Math.log2(ratio)
        while(baseCents < 0)
            baseCents += OCTAVE
        return baseCents % OCTAVE
    }

    const todB = (amp,noise) => {
        if(amp <= 0)
            return 0
        let ampdB = 20*Math.log10(amp) - noise
        if(ampdB < 0)
            return 0
        return ampdB
    }

    const getFreq = (settings) => {
        let pitchNumber = Number(settings['pitch'])
        let offSet = Number(settings['offSet'])

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
            ADSRLevel = Math.max((ADSRTimeFactors[2] - (time - ADSRTimeFactors[0] - ADSRTimeFactors[1])*ADSRTimeFactors[2]/ADSRTimeFactors[3]),0)
        }

        return ADSRLevel
    }

    const getTimeGain = (droneState,frequency,stringPath,pitch,harmonic,time) => {
        let period = Number(droneState[`/FaustDSP/PureTones_v1.0/0x00/Period`])
        let stringIndex = Number(stringPath.replace('/FaustDSP/PureTones_v1.0/0x00/','')[0]) - 1

        if(stringIndex < 3)
            period -= 0.2
        else
            period += 0.2
        
        let adjustedTime = (time + stringDelay[stringIndex]*period) % period

        let stringOn = getADSRLevel(harmonic,adjustedTime,period)

        let variance = Number(droneState[`${stringPath}/Variance`])
        let stringBeat = Math.cos(2*Math.PI*pitch*frequency*harmonic*variance*time/10000)

        return stringOn*stringBeat
    }

    const getAmplitude = (droneState,frequency,stringpath,pitch,harmonic,time) => {
        let timeGain = getTimeGain(droneState,frequency,stringpath,pitch,harmonic,time)

        let stringdBGain = Number(droneState[`${stringpath}/Gain`])
        let stringRatio = noteRatios[Number(droneState[`${stringpath}/Select_Note`])]
        let stringGain = (10**(stringdBGain/20))/stringRatio

        let octave = harmonic === 1 ? 1 : Math.floor(Math.log2(harmonic-1)) + 1
        let octaveGain = Number(droneState[`${stringpath}/Octave_${octave}`])*octaveGainConstants[octave-1]

        let octaveOffset = harmonic - 2**(octave-1) - 1
        let octaveDecay = harmonic === 1 ? 1 : (harmonic === 2 ? 1.42 : (0.5)**(octaveOffset))

        return timeGain*stringGain*octaveGain*octaveDecay
    }

    const addRatio = (ratio,slope,amplitude,stringIndex,resolution,scaleRatio,tuningList) => {
        if(!isAudible(ratio))
            return
        
        let centScaleRatio = toCents(scaleRatio)
        let scaleMin = -resolution/Math.abs(slope)
        let scaleMax = resolution/Math.abs(slope)

        let centRatio = toCents(ratio)
        let ratioMin = (centRatio - Math.abs(slope)*TOLERANCE - centScaleRatio)/Math.abs(slope)
        let ratioMax = (centRatio + Math.abs(slope)*TOLERANCE - centScaleRatio)/Math.abs(slope)

        if(scaleMin <= ratioMax && scaleMax >= ratioMin) {
            let min = Math.max(scaleMin,ratioMin)
            let max = Math.min(scaleMax,ratioMax)
            let found = tuningList[stringIndex].find(tuning => (tuning.min <= max) && (tuning.max >= min))
            if(found) {
                if(min !== scaleMin || max !== scaleMax)
                    found.amplitude += amplitude
                found.max = Math.min(found.max,max)
                found.min = Math.max(found.min,min)
            } else {
                tuningList[stringIndex].push({
                    amplitude: amplitude,
                    max: max,
                    min: min
                })
            }
        }
    }

    const addCurrentAmplitude = (ratio,amplitude,resolution,scaleRatio) => (
        isAudible(ratio) && (Math.abs(toCents(scaleRatio) - toCents(ratio)) < resolution) ? amplitude : 0
    )

    const findTunings = (droneState,frequency,strings,resolution,scaleRatio,time) => {
        let amplitudesStringHarmonics = []
        strings.forEach(string => {
            let amplitudesHarmonics = []
            for(let i = 1; i <= MAXHARMONICS; i++) {
                amplitudesHarmonics.push(getAmplitude(droneState,frequency,string.basepath,string.pitch,i,time))
            }
            amplitudesStringHarmonics.push(amplitudesHarmonics)
        })

        let droneTunings = strings.map( _ => [] )
        let currentAmplitude = 0

        strings.forEach((string,index) => {
            for(let i = 1; i <= MAXHARMONICS; i++) {
                let ratio = i*string.pitch
                let slope = 1
                let stringAmplitude = amplitudesStringHarmonics[index][i-1]
                addRatio(ratio, slope, stringAmplitude, index, resolution, scaleRatio, droneTunings)
                currentAmplitude += addCurrentAmplitude(ratio, stringAmplitude, resolution, scaleRatio)
                for(let pairIndex = index+1; pairIndex < strings.length; pairIndex++) {
                    let pair = strings[pairIndex]
                    for(let j = 1; j<= MAXHARMONICS; j++) {
                        let pairAmplitude = stringAmplitude*amplitudesStringHarmonics[pairIndex][j-1]
                        let ratio = Math.abs(i*string.pitch-j*pair.pitch)
                        let sign = Math.sign(i*string.pitch-j*pair.pitch)
                        let slope = sign*i*string.pitch/ratio
                        addRatio(ratio, slope, pairAmplitude, index, resolution, scaleRatio, droneTunings)
                        slope = -sign*j*pair.pitch/ratio
                        addRatio(ratio, slope, pairAmplitude, pairIndex, resolution, scaleRatio, droneTunings)
                        currentAmplitude += addCurrentAmplitude(ratio, stringAmplitude, resolution, scaleRatio)
                        ratio = i*string.pitch+j*pair.pitch
                        slope = i*string.pitch/ratio
                        addRatio(ratio, slope, pairAmplitude, index, resolution, scaleRatio, droneTunings)
                        slope = j*pair.pitch/ratio
                        addRatio(ratio, slope, pairAmplitude, pairIndex, resolution, scaleRatio, droneTunings)
                        currentAmplitude += addCurrentAmplitude(ratio, pairAmplitude, resolution, scaleRatio)
                    }
                }
            }
        })

        return ({tunings: droneTunings, currentAmplitude: currentAmplitude})
    }

    const {
        commonSettings,
        droneState,
        activeDroneStrings,
        scaleState,
        activeScaleNotes,
        resolution,
        noiseFloor,
        duration
    } = data

    let frequency = getFreq(commonSettings)

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

    let scaleConfig = activeScaleNotes.map(note =>{
        let basePath = `/FaustDSP/Common_Parameters/12_Note_Scale`
        let centOffset = scaleState[`${basePath}/${note}/Cent`]
        centOffset = centOffset === undefined ? 0 : Number(centOffset)
        let subCentOffset = scaleState[`${basePath}/${note}/0.01_Cent`]
        subCentOffset = subCentOffset === undefined ? 0 : Number(subCentOffset)
        return ratioFromName[`${note}`]*(2**((centOffset + subCentOffset/100)/1200))
    })

    let scaleTuning = scaleConfig.map((ratio,scaleIndex) => {
        let tuningData = []
        for(let i=0; i<=SLICE; i++) {
            let time = i*duration/SLICE
            let progress = (scaleIndex*100+i*100/SLICE)/scaleConfig.length
            tuningData.push(findTunings(droneState,frequency,strings,resolution,ratio,time))
            postMessage({
                status: false,
                progress: Math.min(progress,99).toFixed(0),
            })
        }
        let stringTuning = strings.map((_,stringIndex) => {
            let tuning = {}
            let currentAmplitude = 0
            for(let i=0; i<= SLICE; i++) {
                let droneTunings = tuningData[i].tunings[stringIndex]
                droneTunings.sort((tuning1, tuning2) => tuning2.amplitude - tuning1.amplitude)
                if(tuning.amplitude === undefined || tuning.amplitude < droneTunings[0].amplitude) {
                    tuning = droneTunings[0]
                    currentAmplitude = tuningData[i].currentAmplitude
                }
            }
            return ({
                min: tuning.min,
                max: tuning.max,
                amplitude: todB(tuning.amplitude + currentAmplitude,noiseFloor),
                currentAmplitude: todB(currentAmplitude,noiseFloor)
            })
        })
        return stringTuning
    })

    postMessage({
        status: true,
        scaleTuning: scaleTuning,
    })
}

export {tuneDrone}