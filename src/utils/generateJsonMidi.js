const OCTAVE = 1200
const SEMITONE = 100
const MICROTONE = 20
const C3 = 48
const MIDIPITCHCENTRE = 8192
const MIDIPITCHRANGE = 8192
const QUARTERNOTE = 480
const WHOLENOTE = 4*QUARTERNOTE

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
    Q: 3,
}

const trackStateConstants = {
    PITCH: 0,
    TIMING: 1,
}

const strokeStateConstants = {
    STROKE: 0,
    CONTINUE: 1,
}

const tokenize = str => str.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/(\n|\t)/g,' ').split(' ').map(s => s.trim()).filter(s => s.length)

const baseOffset = (noteStr) => {
    let baseStr = noteStr.substring(0,3)
    let value = Object.entries(baseRatio).map((note,index) => (baseStr.includes(note[0]) ? index : -1)).filter(x => x !== -1)
    return (value.length ? value[0] : -1)
}

const isNote = (token) => (baseOffset(token) !== -1)

const isQ = (token) => (token.substring(0,3).includes('Q'))

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

const getFineTune = (note) => {
    let swaraNumber = baseOffset(note) + octaveOffset(note)
    while(swaraNumber < 0)
        swaraNumber += 12
    swaraNumber = swaraNumber % 12
    let ratio = Object.entries(baseRatio)[swaraNumber][1]
    let centRatio = ratioToCents(ratio)
    let fineTune = (SEMITONE*swaraNumber % OCTAVE) - centRatio
    return fineTune
}

const basicPitchBend = (centre,cents,duration,direction) => {
    let messages = []
    for(let i=1; (i-1)*MICROTONE < cents; i++) {
        let pitchBendCents = direction*(i*MICROTONE > cents ? cents : i*MICROTONE)
        let pitchBend = Math.round(centre + pitchBendCents*MIDIPITCHRANGE/OCTAVE)
        let deltaTime = Math.round(duration*MICROTONE/cents)
        if(i*deltaTime > duration)
            deltaTime = duration - (i-1)*deltaTime
        messages.push({ "pitchBend": pitchBend, "channel": 0, "delta": deltaTime.toFixed(0) })
    }
    return messages
}

const isGamaka = (note) => note.includes("(G)")

const getStrokeState = (note) => (note.includes("^") ? strokeStateConstants.CONTINUE : strokeStateConstants.STROKE)

const getNoteNumber = (note,key) => (baseOffset(note) + octaveOffset(note) + key)

const getInterval = (note1, note2) => {
    let swara1 = baseOffset(note1) + octaveOffset(note1)
    let swara2 = baseOffset(note2) + octaveOffset(note2)
    return SEMITONE*(swara1 - swara2) + getFineTune(note1) - getFineTune(note2)
}

const getGamakaMessages = (startingCentre,start,end,number,duration) => {
    let messages = []
    let basicDuration = duration/number
    let basicCents = Math.abs(start - end)
    let direction = start < end ? 1 : -1

    for(let i=0; i<number; i++) {
        let basicCentre = !(i % 2) ? startingCentre : startingCentre + direction*basicCents*MIDIPITCHRANGE/OCTAVE
        let basicDirection = !(i % 2) ? direction : (-1)*direction
        messages.push(...basicPitchBend(basicCentre,basicCents,basicDuration,basicDirection))
    }
    return messages
}

const generateJsonMidi = (composition) => {
    let tokens = tokenize(composition)
    let key = C3

    let track = [
        { "trackName": "Clean Guitar", "delta": 0 },
        { "programChange": { "programNumber": 27 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 100, "value": 0 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 101, "value": 0 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 6, "value": 12 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 38, "value": 0 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 100, "value": 127 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 101, "value": 127 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 100, "value": 1 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 101, "value": 0 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 6, "value": 64 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 38, "value": 0 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 100, "value": 127 }, "channel": 0, "delta": 0 },
        { "controlChange": { "type": 101, "value": 127 }, "channel": 0, "delta": 0 }
    ]

    let trackState = trackStateConstants.PITCH
    let strokeState = strokeStateConstants.STROKE
    let currentNote = ''
    let currentPitchBend = MIDIPITCHCENTRE

    tokens.forEach((token,index) => {
        if(trackState === trackStateConstants.TIMING) {
            let delta = isNote(token) ? WHOLENOTE : getNoteLength(token)
            delta = isGamaka(currentNote) ? delta/2 : delta
            if(isQ(currentNote)) {
                currentNote = ''
                currentPitchBend = MIDIPITCHCENTRE
                track.push({ "pitchBend": currentPitchBend, "channel": 0, "delta": delta })
            } else if(strokeState === strokeStateConstants.STROKE) {
                track.push({ "noteOff": { "noteNumber": getNoteNumber(currentNote,key) }, "channel": 0, "delta": delta})
                currentNote = ''
                track.push({ "pitchBend": MIDIPITCHCENTRE, "channel": 0, "delta": 0 })
                currentPitchBend = MIDIPITCHCENTRE
            } else {
                track.push({ "pitchBend": currentPitchBend, "channel": 0, "delta": delta })
            }
            trackState = trackStateConstants.PITCH
        }
        if(isNote(token)) {
            if(isQ(token)) {
                if(strokeState === strokeStateConstants.CONTINUE && !isQ(currentNote)) {
                    track.push({ "noteOff": { "noteNumber": getNoteNumber(currentNote,key) }, "channel": 0, "delta": 0})
                    strokeState = strokeStateConstants.STROKE
                }
                currentNote = token
                currentPitchBend = MIDIPITCHCENTRE
            } else if(isGamaka(token)) {
                let timing = index+1 >= tokens.length || isNote(tokens[index+1]) ? '1' : tokens[index+1]
                let duration = getNoteLength(timing)/2

                let paramsMatch = /\(G\)\(.*\)/
                let params = token.match(paramsMatch)
                params = `${params[0].replace("(G)","").replace("(","").replace(")","")}`
                let paramList = params.split(',')
                let start = isNote(paramList[0]) ? getInterval(paramList[0],token) : Number(paramList[0])
                let end = isNote(paramList[1]) ? getInterval(paramList[1],token) : Number(paramList[1])
                let number = Number(paramList[3])*2

                let startingPitchBendOffset = 0
                let basicCents = Math.abs(start-end)
                if(start !== 0) {
                    let startingDirection = start < 0 ? -1 : 1
                    startingPitchBendOffset = Math.round(startingDirection*basicCents*MIDIPITCHRANGE/OCTAVE)
                }

                if(strokeState === strokeStateConstants.STROKE) {
                    currentNote = token
                    currentPitchBend = Math.round(MIDIPITCHCENTRE + getFineTune(currentNote)*MIDIPITCHRANGE/OCTAVE)
                    track.push({ "pitchBend": currentPitchBend+startingPitchBendOffset, "channel": 0, "delta": 0 })
                    track.push({ "noteOn": { "noteNumber": getNoteNumber(currentNote,key), "velocity": 127 }, "channel": 0, "delta": 0})
                } else {
                    currentPitchBend = MIDIPITCHCENTRE + Math.round(getInterval(token,currentNote)*MIDIPITCHRANGE/OCTAVE)
                    track.push({ "pitchBend": currentPitchBend+startingPitchBendOffset, "channel": 0, "delta": 0 })
                }

                track.push(...getGamakaMessages(currentPitchBend+startingPitchBendOffset,start,end,number,duration))
            } else {
                if(strokeState === strokeStateConstants.STROKE) {
                    currentNote = token
                    currentPitchBend = Math.round(MIDIPITCHCENTRE + getFineTune(currentNote)*MIDIPITCHRANGE/OCTAVE)
                    track.push({ "pitchBend": currentPitchBend, "channel": 0, "delta": 0 })
                    track.push({ "noteOn": { "noteNumber": getNoteNumber(currentNote,key), "velocity": 127 }, "channel": 0, "delta": 0})
                } else {
                    currentPitchBend += Math.round(getInterval(token,currentNote)*MIDIPITCHRANGE/OCTAVE)
                    track.push({ "pitchBend": currentPitchBend, "channel": 0, "delta": 0 })
                }
            }
            trackState = trackStateConstants.TIMING
            strokeState = getStrokeState(token)    
        }
    })
    if(trackState === trackStateConstants.TIMING || strokeState === strokeStateConstants.CONTINUE){
        let delta = isGamaka(tokens[tokens.length-1]) ? WHOLENOTE/2 : WHOLENOTE
        delta = trackState === trackStateConstants.TIMING ? delta : 0
        track.push({ "noteOff": { "noteNumber": getNoteNumber(currentNote,key) }, "channel": 0, "delta": delta})
        currentNote = ''
        track.push({ "pitchBend": MIDIPITCHCENTRE, "channel": 0, "delta": 0 })
        currentPitchBend = MIDIPITCHCENTRE
    }

    track.push({ "endOfTrack": true, "delta": 0 })

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