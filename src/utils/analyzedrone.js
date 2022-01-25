const MAXHARMONICS = 64
const OCTAVE = 1200
const EPSILON = 0.001
const DELTACENTS = 6

const isAudible = ratio => (ratio > 1/4 - EPSILON) && (ratio < 64 + EPSILON)

const toCents = ratio => {
    let baseCents = OCTAVE*Math.log2(ratio)
    while(baseCents < 0)
        baseCents += OCTAVE
    return baseCents % OCTAVE
}

const noteRatios = [2,243/128,16/9,27/16,128/81,3/2,729/512,4/3,81/64,32/27,9/8,256/243,1]
const noteNames = ['SA','Ni','ni','Dha','dha','Pa','Ma','ma','Ga','ga','Re','re','Sa']
const stringNames = ['1st_String', '2nd_String', '3rd_String', '4th_String', '5th_String', '6th_String']

const analyzeDrone = (droneState,scaleState) => {
    let stringConfig = stringNames.map(name => {
        let basePath = `/FaustDSP/PureTones_v1.0/0x00/${name}`
        return ({
            value: Number(droneState[`${basePath}/Select_Note`]),
            finetune: Number(droneState[`${basePath}/Fine_Tune`]),
            ultrafinetune: Number(droneState[`${basePath}/Ultrafine_Tune`]),
        })
    })

    let status = true
    let message = `Drone Analysis with ${stringConfig.length} strings tuned as ${stringConfig.map(s => noteNames[s.value]).join(', ')}\n\n`

    let strings = stringConfig.map(s => noteRatios[Number(s.value)]*(2**((Number(s.finetune) + Number(s.ultrafinetune)/100)/1200)))
    let stringPairs = []
    strings.forEach((string,index) => {
        for(let pairIndex = index+1; pairIndex < strings.length; pairIndex++) {
            stringPairs.push([string,strings[pairIndex]])
        }
    })

    let relevantTones = []
    const addRatio = ratio => {
        if(ratio === 0 || !isAudible(ratio))
            return
                                
        let existingRatio = relevantTones.find(tone => (Math.abs(tone.ratio - toCents(ratio)) < DELTACENTS))
        if( existingRatio !== undefined) {
            existingRatio.ratio = (existingRatio.ratio*existingRatio.count + toCents(ratio))/(existingRatio.count + 1)
            existingRatio.count += 1
            return
        }
                
        relevantTones.push({
            ratio: toCents(ratio),
            count: 1,
            stdCount: 0,
        })
    }

    for(let i = 1; i <= MAXHARMONICS; i++) {
        strings.forEach(string => {
            let ratio = i*string
            addRatio(ratio)
        })
        for(let j = 1; j<= MAXHARMONICS; j++) {
            stringPairs.forEach(pair => {
                let ratio = Math.abs(i*pair[0]-j*pair[1])/2
                addRatio(ratio)
            })
        }
    }

    relevantTones.sort((tone1, tone2) => tone2.count - tone1.count)
    let relevantTonesPrintableHeader = '\tRatio\t\t\tCents    \t\tCount\n'
    let relevantTonesPrintable = relevantTones.map(tone => `\t${(2**(tone.ratio/1200)).toFixed(5)}\t\t\t${' '.repeat(7-tone.ratio.toFixed(2).length)}${tone.ratio.toFixed(2)} ¢\t\t${' '.repeat(5-tone.count.toFixed(0).length)}${tone.count}`).join('\n')
    message = `${message}${relevantTonesPrintableHeader}${relevantTonesPrintable}`

    let maxCount = relevantTones[0].count
    let scaleConfig = noteNames.map((note,index) =>{
        let basePath = `/FaustDSP/Common_Parameters/12_Note_Scale`
        return noteRatios[index]*(2**((Number(scaleState[`${basePath}/${note}/Cent`])+Number(scaleState[`${basePath}/${note}/0.01_Cent`])/100)/1200))
    })
    scaleConfig.forEach(ratio => {
        let existingRatio = relevantTones.find(tone => (Math.abs(tone.ratio - toCents(ratio)) < DELTACENTS))
        if(existingRatio !== undefined)
            existingRatio.stdCount = Math.floor(maxCount/2)
        else
            relevantTones.push({
                ratio: toCents(ratio),
                count: 0,
                stdCount: Math.floor(maxCount/2),
            })
    })
    relevantTones.sort((tone1, tone2) => tone1.ratio - tone2.ratio)
    
    return {
        status: status,
        message: message,
        pitches: relevantTones,
    }
}

export {analyzeDrone}