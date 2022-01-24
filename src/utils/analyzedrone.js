const MAXHARMONICS = 64
const OCTAVE = 1200
const EPSILON = 0.001
const DELTACENTS = 4

const GCD = (a,b) => {
    let first = Math.abs(a) > Math.abs(b) ? Math.abs(a) : Math.abs(b)
    let second = Math.abs(a) > Math.abs(b) ? Math.abs(b) : Math.abs(a)
    if(second === 0)
        return first
    return GCD(second,first % second)
}

const isAudible = ratio => (ratio > 1/4 - EPSILON) && (ratio < 64 + EPSILON)

const toCents = ratio => {
    let baseCents = OCTAVE*Math.log2(ratio)
    while(baseCents < 0)
        baseCents += OCTAVE
    return baseCents % OCTAVE
}

const stringRatios = [2,243/128,16/9,27/16,128/81,3/2,729/512,4/3,81/64,32/27,9/8,256/243,1]
const stringNames = ['SA','Ni','ni','Dha','dha','Pa','Ma','ma','Ga','ga','Re','re','Sa']

const analyzeDrone = (stringConfig) => {
    let status = true
    let message = `Drone Analysis with three strings tuned as ${stringNames[Number(stringConfig[0].value)]}, ${stringNames[Number(stringConfig[1].value)]} and ${stringNames[Number(stringConfig[2].value)]}\n\n`

    let strings = [0,1,2].map(i => stringRatios[Number(stringConfig[i].value)]*(2**((Number(stringConfig[i].finetune) + Number(stringConfig[i].ultrafinetune)/100)/1200)))
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
            if(GCD(i,j) !== 1)
                continue
            
            stringPairs.forEach(pair => {
                let ratio = Math.abs(i*pair[0]-j*pair[1])/2
                addRatio(ratio)
            })
        }
    }

    relevantTones.sort((tone1, tone2) => tone2.count - tone1.count)
    let relevantTonesPrintable = relevantTones.map(tone => `Ratio = ${(2**(tone.ratio/1200)).toFixed(5)} (${tone.ratio.toFixed(2)} ¢)\t\t Count = ${tone.count}`).join('\n')
    message = message.concat(relevantTonesPrintable)

    let maxCount = relevantTones[0].count
    let scaleConfig = stringRatios
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