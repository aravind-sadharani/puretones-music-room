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
const SEVENTH = toCents(7/4)
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

const tokenize = str => str.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/(\n|\t)/g,' ').split(' ').map(s => s.trim()).filter(s => s.length)

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
        return ['Sa',Number(0)]
    
    for(let r = 0; r < matrix.length; r++) {
        if(matrix[r][note[1]] === 1) {
            let offset = matrix[r][matrix[r].length-1] - toCents(baseRatio[note[0]])
            offset = Math.abs(offset) < EPSILON ? 0 : offset
            return [note[0],offset]
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
    let transposedNoteOffset = (toCents((baseRatio[note[0]]/baseRatio[ref[0]])/baseRatio[transposedNoteName]) + Number(note[1]) - Number(ref[1]) + OCTAVE/2) % OCTAVE - OCTAVE/2
    transposedNoteOffset = Math.abs(transposedNoteOffset) < EPSILON ? 0 : transposedNoteOffset
    return [transposedNoteName, transposedNoteOffset]
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
            if(baseNote(note) !== 'Sa' && baseNote(note) !== 'SA')
                ruleArray[noteNumber[`${baseNote(note)}`]] += sign
            if(note.includes('"') || baseNote(note) === 'SA')
                ruleArray[11] -= OCTAVE*sign
            if(note.includes('"') && baseNote(note) === 'SA')
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
                if(baseRatio[transposeRef] === undefined) {
                    badRules.push(token)
                    return ruleArray
                }
            } else if(token[0] === 'I') {
                let interval = token.replace(/(\(|\)|I)/g,'')
                let sign = state.side === 'LHS' ? (-1)**(state.sign === '+') : -((-1)**(state.sign === '+'))
                if(interval === 'P')
                    ruleArray[11] += FIFTH*sign
                else if(interval === 'm')
                    ruleArray[11] += FOURTH*sign
                else if(interval === 'G')
                    ruleArray[11] += THIRD*sign
                else if(interval === 'n')
                    ruleArray[11] += SEVENTH*sign
                else {
                    badRules.push(token)
                    return ruleArray
                }
            } else if(token[0] === 'S') {
                let note = token.replace(/(\(|\)|S)/g,'')
                let sign = state.side === 'LHS' ? (-1)**(state.sign === '+') : -((-1)**(state.sign === '+'))
                if(baseRatio[note] === undefined) {
                    badRules.push(token)
                    return ruleArray
                }
                ruleArray[11] += toCents(baseRatio[note])*sign
            } else if(token[0] === 'D') {
                let note = token.replace(/(\(|\))/g,'').replace('D','')
                if(baseRatio[note] === undefined) {
                    badRules.push(token)
                    return ruleArray
                }
                deletedNotes.push(note)
            } else {
                let notes = token.replace(/(\(|\))/g,'').split(',')
                if(notes.length > 2 || (notes.length === 2 && (baseRatio[baseNote(notes[0])] === undefined || baseRatio[baseNote(notes[1])] === undefined)) || (notes.length === 1 && (baseRatio[baseNote(notes[0])] === undefined || notes[0] === 'Sa'))) {
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

    if(transposeRef !== 'Sa' && unSolvedNotes.length === 0) {
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

    let message = unSolvedNotes.length > 0 ? `Scale: ${scaleNotes.map(note => note[0]).join(',')}\n\tThe following notes cannot be solved with the given rules:\n\t${unSolvedNotes.map(note => note[0]).join(',')}\n\tPlease add some more rules and retry.\n` : `Scale: ${scaleNotes.map(note => note[0]).join(',')}\n\nScale tuning relative to Venkatamakhin-Ramamatya system\n${solvedNotes.map(note => `${note[0]}\t${' '.repeat(7-note[1].toFixed(2).length)}${note[1].toFixed(2)} ¢`).join('\n')}\n\nSymmetric intervals in the Scale\n${findSymmetry(solvedNotes)}`

    let result = {
        status: (unSolvedNotes.length === 0),
        message: message,
        scale: solvedNotes
    }


    return result
}

const noteOffsets = {'Sa': 0, 're': 1, 'Re': 2, 'ga': 3, 'Ga': 4, 'ma': 5, 'Ma': 6, 'Pa': 7, 'dha': 8, 'Dha': 9, 'ni': 10, 'Ni': 11, 'SA': 12, 'Sa"': 12, 're"': 13, 'Re"': 14, 'ga"': 15, 'Ga"': 16, 'ma"': 17, 'Ma"': 18, 'Pa"': 19, 'dha"': 20, 'Dha"': 21, 'ni"': 22, 'Ni"': 23, 'SA"': 24}

const noteNames = ['Sa', 're', 'Re', 'ga', 'Ga', 'ma', 'Ma', 'Pa', 'dha', 'Dha', 'ni', 'Ni', 'Sa"', 're"', 'Re"', 'ga"', 'Ga"', 'ma"', 'Ma"', 'Pa"', 'dha"', 'Dha"', 'ni"', 'Ni"', 'SA"']

const chordClasses = [
    {name: 'Maj', harmony: 4, fifth: 7},
    {name: 'Min', harmony: 3, fifth: 7},
    {name: 'Sus2', harmony: 2, fifth: 7},
    {name: 'Sus4', harmony: 5, fifth: 7},
    {name: 'Dim', harmony: 3, fifth: 6},
    {name: 'Aug', harmony: 4, fifth: 8},
]

const findChordNote = (note,scale,interval) => {
    let intervalNote = noteNames[(noteOffsets[`${note}`]+interval)]
    return scale.includes(noteNames[(noteOffsets[`${note}`]+interval) % 12]) ? intervalNote : 'fade'
}

const findChord = (note,scale,chordClass) => {
    let root = note
    let harmony = findChordNote(note,scale,chordClass.harmony)
    let fifth = findChordNote(note,scale,chordClass.fifth)
    if(harmony === 'fade' || fifth === 'fade')
        return {name: 'fade'}
    return {name: `${note}-${chordClass.name}`, root: root, harmony: harmony, fifth: fifth}
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
    let chordspec = chordClasses.map((chordClass) => {
        let scaleNotesList = scale.map(note => note[0]).join(',')
        return scale.map(note => findChord(note[0],scaleNotesList,chordClass))
    })
    return {
        settings: settings,
        notespec: notespec,
        chordspec: chordspec
    }
}

const findSymmetry = (scale) => {
    let centScale = scale.map(note => [note[0], toCents(baseRatio[note[0]]) + Number(note[1])])
    let scaleIntervals = centScale.map((note,index) => {
        let first = note[0]
        let second = centScale[(index+1)%scale.length][0]
        let gap = centScale[(index+1)%scale.length][1] - note[1]
        if(index+1 >= scale.length) {
            second = `${second}"`
            gap += OCTAVE
        }
        return {
            first: first,
            second: second,
            gap: gap
        }
    })
    let symmetry = centScale.map((_,refIndex) => {
        return scaleIntervals.map((interval,index) => {
            let ratio = (centScale[refIndex][1] - centScale[index][1] + OCTAVE) % OCTAVE
            if(index === refIndex || ratio > FIFTH + EPSILON)
                return {}
            let matchingFirstNote = centScale.findIndex(note => Math.abs((centScale[index][1] + ratio + EPSILON) %OCTAVE - note[1]) < 1.1*EPSILON)
            let matchingSecondNote = centScale.findIndex(note => Math.abs((centScale[index][1] + ratio + interval.gap + EPSILON) %OCTAVE - note[1]) < 1.1*EPSILON)
            if(matchingFirstNote === -1 || matchingSecondNote === -1)
                return {}
            else
                return {
                    ...interval,
                    third: centScale[matchingFirstNote][0],
                    fourth: `${centScale[matchingSecondNote][0]}${matchingSecondNote < matchingFirstNote ? '"' : ''}`,
                    symmetry: ratio
                }
        }).filter(interval => Object.keys(interval).length !== 0)
    }).filter(list => list.length !== 0)
    let symmetryReadable = symmetry.map(list => list.map(element => `(${element.first},${element.second})${' '.repeat(6-element.first.length-element.second.length)}= (${element.third},${element.fourth})${' '.repeat(6-element.third.length-element.fourth.length)}\t${centsReadable(element.gap)}\t  ${centsReadable(element.symmetry)}`).join('\n')).join('\n')

    return `Equal Intervals\t    \tInterval Size\t  Symmetry\n${symmetryReadable}`
}

const centsReadable = (cents) => {
    if(Math.abs(cents-FIFTH) < EPSILON)
        return 'Pancham'
    if(Math.abs(cents-FOURTH) < EPSILON)
        return 'Madhyam'
    if(Math.abs(cents-THIRD) < EPSILON)
        return 'Ga (5/4)'
    if(Math.abs(cents-SEVENTH) < EPSILON)
        return 'ni (7/4)'
    if(Math.abs(cents - toCents(6/5)) < EPSILON)
        return 'ga (6/5)'
    if(Math.abs(cents - toCents(81/64)) < EPSILON)
        return 'Ga (81/64)'
    if(Math.abs(cents - toCents(32/27)) < EPSILON)
        return 'ga (32/27)'
    if(Math.abs(cents - toCents(9/8)) < EPSILON)
        return 'Re (9/8)'
    if(Math.abs(cents - toCents(10/9)) < EPSILON)
        return 'Re (10/9)'
    if(Math.abs(cents - toCents(16/15)) < EPSILON)
        return 're (16/15)'
    if(Math.abs(cents - toCents(256/243)) < EPSILON)
        return 're (256/243)'
    if(Math.abs(cents - toCents(75/64)) < EPSILON)
        return 'ga (75/64)'
    if(Math.abs(cents - toCents(256/225)) < EPSILON)
        return 'Re (256/225)'

    return cents.toFixed(2)
}

export { buildScale, prepareKeyboard }