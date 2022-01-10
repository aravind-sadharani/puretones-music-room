const OCTAVE = 1200
const FIFTH = 1200*Math.log2(3/2)
const FOURTH = 1200*Math.log2(4/3)
const THIRD = 1200*Math.log2(5/4)
const EPSILON = 1e-12

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
    Ni: 243/128
}

const noteNumber = {
    Sa: 11,
    re: 0,
    Re: 1,
    ga: 2,
    Ga: 3,
    ma: 4,
    Ma: 5,
    Pa: 6,
    dha: 7,
    Dha: 8,
    ni: 9,
    Ni: 10
}

const splitbyline = str => str.split('\n').filter(s => s.length)

const tokenize = str => str.replace(/(\n|\t)/g,' ').split(' ').map(s => s.trim()).filter(s => s.length)

const baseNote = note => note.replace(/('|")/g,'')

const getIndex = note => {
    let ratio = baseRatio[`${baseNote(note)}`]
    if(note.includes("'"))
        return ratio/2
    else if(note.includes('"'))
        return ratio*2
    else
        return ratio
}

const toRREF = matrix => {
    let rows = matrix.length
    let columns = matrix[0].length

    let pivot = 0
    for(let r = 0; r < rows; r++) {
        if(pivot >= columns-1)
            break
        let i = r
        while(matrix[i][pivot] === 0) {
            i++
            if(i === rows) {
                i = r
                pivot += 1
                if(pivot === columns-1)
                    break
            }
        }
        let tempRow = matrix[i]
        matrix[i] = matrix[r]
        matrix[r] = tempRow    
        if(matrix[r][pivot] !== 0) {
            let normFactor = matrix[r][pivot]
            matrix[r] = matrix[r].map(element => element/normFactor)
        }
        for(let j = 0; j < rows; j++) {
            if(j !== r) {
                let normFactor = matrix[j][pivot]
                matrix[j] = matrix[j].map((element,index) => {
                    let newElement = element - normFactor*matrix[r][index]
                    newElement = Math.abs(newElement) < EPSILON ? 0 : newElement
                    return newElement
                })
            }
        }
        pivot += 1
    }

    return matrix
}

const isColumnZero = (matrix,column) => {
    if(column < 0 || column >= matrix[0].length - 1)
        return false
    
    let answer = true
    for(let r = 0; r < matrix.length; r++)
        if(matrix[r][column] !== 0)
            answer = false

    return answer
}

const isNoteSolved = (matrix,note) => {
    if(note === 11)
        return true
    
    for(let r = 0; r < matrix.length; r++) {
        if(matrix[r][note] === 1) {
            for(let c = 0; c < matrix[r].length-1; c++) {
                if(c !== note && matrix[r][c] !== 0)
                    return false
            }
            return true
        }
    }
}

const solveNote = (matrix,note) => {
    if(note[1] === 11)
        return ['Sa',Number(0).toFixed(2)]
    
    for(let r = 0; r < matrix.length; r++) {
        if(matrix[r][note[1]] === 1) {
            let offset = matrix[r][matrix[r].length-1] - 1200*Math.log2(baseRatio[note[0]])
            offset = Math.abs(offset) < EPSILON ? 0 : offset
            return [note[0],offset.toFixed(2)]
        }
    }
}

const noteToSettings = note => {
    return `${Number(note[1]).toFixed(0)} /musicscale/Common_Parameters/12_Note_Scale/${note[0]}/Cent
${(100*(Number(note[1])-Number(note[1]).toFixed(0))).toFixed(0)} /musicscale/Common_Parameters/12_Note_Scale/${note[0]}/0.01_Cent`
}

const buildScale = (constraints) => {
    let scaleRules = splitbyline(constraints).map(rule => {
        let ruleArray = new Array(12).fill(0)
        let state = {
            sign: '+',
            side: 'LHS'
        }
        const updateRules = (note,sign) => {
            if(baseNote(note) !== 'Sa')
                ruleArray[noteNumber[`${baseNote(note)}`]] += sign
            if(note.includes('"'))
                ruleArray[11] -= OCTAVE*sign
            if(note.includes("'"))
                ruleArray[11] += OCTAVE*sign
        }    
        let tokens = tokenize(rule)
        tokens.forEach(token => {
            if(token === '+') {
                state.sign = '+'
            } else if(token === '-') {
                state.sign = '-'
            } else if(token === '=') {
                state.side = 'RHS'
            } else if(token[0] === 'I') {
                let interval = token.replace(/(\(|\)|I)/g,'')
                let sign = state.side === 'LHS' ? -1 : 1
                if(interval === 'P')
                    ruleArray[11] += FIFTH*sign
                else if(interval === 'm')
                    ruleArray[11] += FOURTH*sign
                else if(interval === 'G')
                    ruleArray[11] += THIRD*sign
            } else {
                let notes = token.replace(/(\(|\))/g,'').split(',')
                if(notes.length !== 2) {
                    console.log('Syntax Error')
                    return ruleArray
                }
                let sign = getIndex(notes[0]) > getIndex(notes[1]) ? 1 : -1
                if( (state.sign === '-' && state.side === 'LHS') || (state.sign === '+' && state.side === 'RHS') )
                    sign *= -1
                updateRules(notes[0],sign)
                updateRules(notes[1],(-1)*sign)
            }
        })
        return ruleArray
    })

    if(scaleRules.length === 0)
        return `Please specify some constraints to build the scale.\n`
    
    scaleRules = toRREF(scaleRules)
    
    let scaleNotes = Object.entries(noteNumber).filter(note => !isColumnZero(scaleRules,note[1]))

    let unSolvedNotes = scaleNotes.filter(note => !isNoteSolved(scaleRules,note[1]))

    let solvedNotes = scaleNotes.filter(note => isNoteSolved(scaleRules,note[1])).map(note => solveNote(scaleRules,note))

    let result = {
        scaleNotes: scaleNotes,
        unSolvedNotes: unSolvedNotes,
        solvedNotes: solvedNotes,
        settings: solvedNotes.map(note => noteToSettings(note)).join('\n')
    }

    return result
}

export default buildScale