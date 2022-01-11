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

const transposeOffset = (note, ref) => {
    let transposedNoteNumber = (noteNumber[note[0]] - noteNumber[ref[0]] + noteNumber['Sa']) % 12
    let transposedNoteName = Object.entries(noteNumber).filter(testNote => testNote[1] === transposedNoteNumber)[0][0]
    let transposedNoteOffset = 1200*Math.log2((baseRatio[note[0]]/baseRatio[ref[0]])/baseRatio[transposedNoteName]) % 1200 + Number(note[1]) - Number(ref[1])
    transposedNoteOffset = Math.abs(transposedNoteOffset) < EPSILON ? 0 : transposedNoteOffset
    return [transposedNoteName, transposedNoteOffset.toFixed(2)]
}

const transposeNumber = (note, ref) => {
    let transposedNoteNumber = (noteNumber[note[0]] - noteNumber[ref[0]] + noteNumber['Sa']) % 12
    return Object.entries(noteNumber).filter(testNote => testNote[1] === transposedNoteNumber)[0]
}

const compareNotes = (note1, note2) => noteRank(note1) - noteRank(note2)

const noteRank = note => note[0] === 'Sa' ? -1 : noteNumber[note[0]]

const buildScale = (constraints) => {
    let transposeRef = 'Sa'
    let deletedNotes = []
    let badRules = []
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
            } else if(token[0] === 'T') {
                transposeRef = token.replace(/(\(|\)|T)/g,'')
            } else if(token[0] === 'I') {
                let interval = token.replace(/(\(|\)|I)/g,'')
                let sign = state.side === 'LHS' ? -1 : 1
                if(interval === 'P')
                    ruleArray[11] += FIFTH*sign
                else if(interval === 'm')
                    ruleArray[11] += FOURTH*sign
                else if(interval === 'G')
                    ruleArray[11] += THIRD*sign
            } else if(token[0] === 'S') {
                let note = token.replace(/(\(|\)|S)/g,'')
                let sign = state.side === 'LHS' ? -1 : 1
                if(baseRatio[note] === undefined) {
                    badRules.push(token)
                    return ruleArray
                }
                ruleArray[11] += 1200*Math.log2(baseRatio[note])*sign
            } else if(token[0] === 'D') {
                let note = token.replace(/(\(|\)|S)/g,'')
                deletedNotes.push(note)
            } else {
                let notes = token.replace(/(\(|\))/g,'').split(',')
                if(notes.length > 2 || (notes.length === 1 && notes[0] === 'Sa')) {
                    badRules.push(token)
                    return ruleArray
                }
                if(notes.length === 1)
                    notes.push('Sa')
                let sign = getIndex(notes[0]) > getIndex(notes[1]) ? 1 : -1
                if( (state.sign === '-' && state.side === 'LHS') || (state.sign === '+' && state.side === 'RHS') )
                    sign *= -1
                updateRules(notes[0],sign)
                updateRules(notes[1],(-1)*sign)
            }
        })
        return ruleArray
    })

    if(badRules.length > 0)
        return {
            status: false,
            message: `The rules included the following invalid parameters.\n${badRules.join('\n')}\nPlease specify rules with valid parameters.\n`,
            scale: []
        }

    if(scaleRules.length === 0)
        return {
            status: false,
            message: `Please specify some rules to build the scale.\n`,
            scale: []
        }
    
    scaleRules = toRREF(scaleRules)
    let allDeletedNotes = deletedNotes.join(',')
    
    let scaleNotes = Object.entries(noteNumber).filter(note => !isColumnZero(scaleRules,note[1])).filter(note => !allDeletedNotes.includes(note[0]))

    let unSolvedNotes = scaleNotes.filter(note => !isNoteSolved(scaleRules,note[1]))

    let solvedNotes = scaleNotes.filter(note => isNoteSolved(scaleRules,note[1])).map(note => solveNote(scaleRules,note))

    if(transposeRef !== 'Sa') {
        if(noteNumber[transposeRef] === undefined) {
            return {
                status: false,
                message: `The name ${transposeRef} is not a valid note name.\nPlease specify a valid note to transpose.\n`,
                scale: []
            }
        }
        let refList = solvedNotes.filter(note => note[0] === transposeRef)
        if(refList.length === 0) {
            return {
                status: false,
                message: `The note ${transposeRef} is not in the original scale: ${scaleNotes.map(note => note[0]).join(',')}\nPlease specify a valid note to transpose.\n`,
                scale: []
            }
        }
        let ref = refList[0]
        scaleNotes = scaleNotes.map(note => transposeNumber(note,ref)).sort(compareNotes)
        solvedNotes = solvedNotes.map(note => transposeOffset(note,ref)).sort(compareNotes)
        unSolvedNotes = unSolvedNotes.map(note => transposeNumber(note,ref)).sort(compareNotes)
    }

    let message = unSolvedNotes.length > 0 ? `Scale: ${scaleNotes.map(note => note[0]).join(',')}\nThe following notes cannot be solved with the given rules:\n${unSolvedNotes.map(note => note[0]).join(',')}\nPlease add some more rules and retry.\n` : `Scale: ${scaleNotes.map(note => note[0]).join(',')}\n${solvedNotes.map(note => `${note[0]}: ${note[1]} ¢`).join('\n')}`

    let result = {
        status: (unSolvedNotes.length === 0),
        message: message,
        scale: solvedNotes
    }

    return result
}

const prepareKeyboard = (scale) => {
    let settings = scale.map(note => noteToSettings(note)).join('\n')
    let scaleNotesList = scale.map(note => note[0]).join(',')
    const noteLabel = note => scaleNotesList.includes(note) ? note : 'fade'
    let notespec = [
        {white: "Sa", black: `${noteLabel('re')}`},
        {white: `${noteLabel('Re')}`, black: `${noteLabel('ga')}`},
        {white: `${noteLabel('Ga')}`},
        {white: `${noteLabel('ma')}`, black: `${noteLabel('Ma')}`},
        {white: `${noteLabel('Pa')}`, black: `${noteLabel('dha')}`},
        {white: `${noteLabel('Dha')}`, black: `${noteLabel('ni')}`},
        {white: `${noteLabel('Ni')}`},
        {white: "SA"}
    ]
    return {
        settings: settings,
        notespec: notespec
    }
}

export { buildScale, prepareKeyboard }