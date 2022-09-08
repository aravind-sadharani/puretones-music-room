const OCTAVE = 1200
const toCents = ratio => {
    let baseCents = OCTAVE*Math.log2(ratio)
    while(baseCents < 0)
        baseCents += OCTAVE
    return baseCents % OCTAVE
}
const FIFTH = toCents(3/2)
const FOURTH = toCents(4/3)
const THIRD = toCents(5/4)
const EPSILON = 1e-10

const baseRatio = {
    Sa: 1,
    re: 256/243,
    Re: 9/8,
    ga: 32/27,
    Ga: 81/64,
    ma: 4/3,
    Ma: 729/512,
    Pa: 3/2,
    dha: 128/81,
    Dha: 27/16,
    ni: 16/9,
    Ni: 243/128,
    SA: 2
}

const FIFTHWEIGHT = 100
const FOURTHWEIGHT = 100
const THIRDWEIGHT = 80
const GOODWEIGHT = 50
const DEFAULTWEIGHT = 10

const analyzeScale = (scale) => {
    let centScale = scale.map(note => [note[0], toCents(baseRatio[note[0]]) + Number(note[1])])
    let twoOctaveScale = centScale.concat(centScale.map(note => [`${note[0]}"`,note[1]+OCTAVE])).concat([['SA"',2*OCTAVE]])
    let noteWeights = twoOctaveScale.map(note => {
        let weight = 0
        let fifthCents = note[1] + FIFTH
        let fifthNote = twoOctaveScale.find(candidateNote => Math.abs(candidateNote[1] - fifthCents) < EPSILON)
        if(fifthNote !== undefined) {
            weight += FIFTHWEIGHT
        }
        
        let inversefifthCents = note[1] - FIFTH
        let inversefifthNote = twoOctaveScale.find(candidateNote => Math.abs(candidateNote[1] - inversefifthCents) < EPSILON)
        if(inversefifthNote !== undefined) {
            weight += FIFTHWEIGHT
        }

        let fourthCents = note[1] + FOURTH
        let fourthNote = twoOctaveScale.find(candidateNote => Math.abs(candidateNote[1] - fourthCents) < EPSILON)
        if(fourthNote !== undefined) {
            weight += FOURTHWEIGHT
        }
        
        let inversefourthCents = note[1] - FOURTH
        let inversefourthNote = twoOctaveScale.find(candidateNote => Math.abs(candidateNote[1] - inversefourthCents) < EPSILON)
        if(inversefourthNote !== undefined) {
            weight += FOURTHWEIGHT
        }
    
        let thirdCents = note[1] + THIRD
        let thirdNote = twoOctaveScale.find(candidateNote => Math.abs(candidateNote[1] - thirdCents) < EPSILON)
        if(thirdNote !== undefined) {
            weight += THIRDWEIGHT
        }

        let inversethirdCents = note[1] - THIRD
        let inversethirdNote = twoOctaveScale.find(candidateNote => Math.abs(candidateNote[1] - inversethirdCents) < EPSILON)
        if(inversethirdNote !== undefined) {
            weight += THIRDWEIGHT
        }
        
        return weight
    })
    for(let i=1; i<noteWeights.length; i++) {
        noteWeights[i] += noteWeights[i-1]
    }

    let linkWeights = twoOctaveScale.map(origin => {
        let originLinkWeights = twoOctaveScale.map(destination => {
            let interval = Math.abs(origin[1] - destination[1])
            if(Math.abs(interval - FIFTH) < EPSILON)
                return FIFTHWEIGHT
            if(Math.abs(interval - FOURTH) < EPSILON)
                return FOURTHWEIGHT
            if(Math.abs(interval - THIRD) < EPSILON)
                return THIRDWEIGHT
            if(interval < THIRD)
                return GOODWEIGHT
            return DEFAULTWEIGHT
        })
        return originLinkWeights
    })
    for(let i=0; i<linkWeights.length; i++) {
        for(let j=1; j<linkWeights[i].length; j++) {
            linkWeights[i][j] += linkWeights[i][j-1]
        }
    }

    return {
        noteWeights: noteWeights,
        linkWeights: linkWeights
    }
}

export {analyzeScale}