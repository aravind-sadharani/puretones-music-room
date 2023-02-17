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
    SA: 2,
}

const songState = {
    PITCH: 0,
    TIMING: 1,
}

const OCTAVE = 1200
const SEMITONE = 100
const MICROTONE = 20
const C3 = 48
const MIDIPITCHCENTRE = 8192
const MIDIPITCHRANGE = 8192

const QUARTERNOTE = 480
const WHOLENOTE = 4*QUARTERNOTE

const tokenize = str => str.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/(\n|\t)/g,' ').split(' ').map(s => s.trim()).filter(s => s.length)

const baseOffset = (noteStr) => {
    let baseStr = noteStr.substring(0,3)
    let value = Object.entries(baseRatio).map((note,index) => (baseStr.includes(note[0]) ? index : -1)).filter(x => x !== -1)
    return (value.length ? value[0] : -1)
}

const isNote = (token) => (baseOffset(token) !== -1)

const octaveOffset = (noteStr) => {
    let octStr = noteStr.substring(2,4)
    if(octStr.includes('"'))
        return 12
    if(octStr.includes("'"))
        return -12
    return 0
}

const jatiValue = (timeStr) => {
    let jatiStr = timeStr[0]
    if(jatiStr === '.')
        return 1/2
    if(jatiStr === ';')
        return 1/4
    if(jatiStr === ',')
        return 1/8
    return 1
}

const repeatValue = (timeStr) => {
    let parsedTimeStr = jatiValue(timeStr) === 1 ? timeStr : timeStr.substring(1,timeStr.length)
    if(parsedTimeStr === "")
        return 1
    let intTimeStr = parseInt(parsedTimeStr)
    return (isNaN(intTimeStr) ? 1 : intTimeStr)
}

const getNoteLength = (timeStr) => WHOLENOTE*jatiValue(timeStr)*repeatValue(timeStr)

const ratioToCents = (ratio) => OCTAVE*Math.log2(ratio)

const getFineTune = (noteNumber) => {
    let ratio = Object.entries(baseRatio)[noteNumber % 12][1]
    let centRatio = ratioToCents(ratio)
    let fineTune = (SEMITONE*noteNumber % OCTAVE) - centRatio
    let midiFineTune = MIDIPITCHCENTRE + fineTune*MIDIPITCHRANGE/OCTAVE
    return Math.round(midiFineTune)
}

const basicPitchBend = (centre,cents,time,direction) => {
    let messages = []
    for(let i=1; (i-1)*MICROTONE < cents; i++) {
        let pitchBendCents = direction*(i*MICROTONE > cents ? cents : i*MICROTONE)
        let pitchBend = Math.round(centre + pitchBendCents*MIDIPITCHRANGE/OCTAVE)
        let deltaTime = Math.round(time/(Math.round(cents/MICROTONE)))
        if(i*deltaTime > time)
            deltaTime = time - (i-1)*deltaTime
        messages.push({ "pitchBend": pitchBend, "channel": 0, "delta": deltaTime.toFixed(0) })
    }
    return messages
}

const getGamakaMessages = (centre,start,end,number,time) => {
    console.log(centre,start,end,number,time)
    let messages = []

    let basicTime = time/number
    let basicCents = Math.abs(start - end)
    let direction = start < end ? 1 : -1
    let startingCentre = centre
    if(start !== 0) {
        let startingDirection = start < 0 ? -1 : 1
        startingCentre = centre + startingDirection*basicCents*MIDIPITCHRANGE/OCTAVE
        messages.push({ "pitchBend": startingCentre, "channel": 0, "delta": 0 })
    }
    for(let i=0; i<number; i++) {
        let basicCentre = !(i % 2) ? startingCentre : startingCentre + direction*basicCents*MIDIPITCHRANGE/OCTAVE
        let basicDirection = !(i % 2) ? direction : (-1)*direction
        messages.push(...basicPitchBend(basicCentre,basicCents,basicTime,basicDirection))
    }
    return messages
}

const isGamaka = (note) => note.includes("(G)")

const intervalCents = (note1, note2) => {
    return SEMITONE*(baseOffset(note1)+octaveOffset(note1) - baseOffset(note2)-octaveOffset(note2))
}

const parseGamaka = (note,timing) => {
    console.log(note,timing)
    let paramsMatch = /\(G\)\(.*\)/
    let params = note.match(paramsMatch)
    params = `${params[0].replace("(G)","").replace("(","").replace(")","")}`
    let paramList = params.split(',')
    let centre = getFineTune(baseOffset(note) + octaveOffset(note))
    let start = isNote(paramList[0]) ? intervalCents(paramList[0],note) : Number(paramList[0])
    let end = isNote(paramList[1]) ? intervalCents(paramList[1],note) : Number(paramList[1])
    let number = Number(paramList[3])*2
    let time = getNoteLength(timing)/2
    return getGamakaMessages(centre,start,end,number,time)
}

const generateJsonMidi = (composition) => {
    let tokens = tokenize(composition)

    let track = [
        { "trackName": "Clean Guitar", "delta": 0 },
        { "programChange": { "programNumber": 27 }, "delta": 0 },
        { "controlChange": { "type": 100, "value": 0 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 101, "value": 0 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 6, "value": 12 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 38, "value": 0 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 100, "value": 127 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 101, "value": 127 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 100, "value": 1 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 101, "value": 0 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 6, "value": 32 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 38, "value": 0 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 100, "value": 127 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 101, "value": 127 }, "channel": 0, "delta": 0 }
    ]

    let state = songState.PITCH
    let currentNoteNumber = C3
    let currentNotePitch = MIDIPITCHCENTRE
    let previousNoteNumber = C3

    tokens.forEach((token,index) => {
        if(isNote(token)) {
            if(state === songState.TIMING) {
                let delta = isGamaka(tokens[index-1]) ? WHOLENOTE/2 : WHOLENOTE
                track.push({ "noteOff": { "noteNumber": previousNoteNumber, "velocity": 127 }, "channel": 0, "delta": delta})
                track.push({ "pitchBend": MIDIPITCHCENTRE, "channel": 0, "delta": 0 })
            }
            currentNoteNumber += baseOffset(token)
            currentNoteNumber += octaveOffset(token)
            currentNotePitch = getFineTune(currentNoteNumber - C3)
            track.push({ "pitchBend": currentNotePitch, "channel": 0, "delta": 0 })
            track.push({ "noteOn": { "noteNumber": currentNoteNumber, "velocity": 127 }, "channel": 0, "delta": 0})
            state = songState.TIMING
            previousNoteNumber = currentNoteNumber
            currentNoteNumber = C3
            if(isGamaka(token)) {
                if(index+1 >= tokens.length || isNote(tokens[index+1])) {
                    track.push(...parseGamaka(token,'1'))
                } else {
                    track.push(...parseGamaka(token,tokens[index+1]))
                }
            }
        } else {
            let delta = isGamaka(tokens[index-1]) ? getNoteLength(token)/2 : getNoteLength(token)
            track.push({ "noteOff": { "noteNumber": previousNoteNumber, "velocity": 127 }, "channel": 0, "delta": delta})
            track.push({ "pitchBend": MIDIPITCHCENTRE, "channel": 0, "delta": 0 })
            state = songState.PITCH
        }
    })
    if(state === songState.TIMING){
        track.push({ "noteOff": { "noteNumber": previousNoteNumber, "velocity": 127 }, "channel": 0, "delta": WHOLENOTE})
        track.push({ "pitchBend": MIDIPITCHCENTRE, "channel": 0, "delta": 0 })
    }

    let songJSON = {
        "division": QUARTERNOTE,
        "format": 1,
        "tracks": [
            track
        ]
    }

    return songJSON
}

export default generateJsonMidi