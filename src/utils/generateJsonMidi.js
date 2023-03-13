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

const getFineTune = (note,noteOffsets) => {
    let swaraNumber = baseOffset(note) + octaveOffset(note)
    while(swaraNumber < 0)
        swaraNumber += 12
    swaraNumber = swaraNumber % 12
    let ratio = Object.entries(baseRatio)[swaraNumber][1]
    let centRatio = ratioToCents(ratio)
    let fineTune = (SEMITONE*swaraNumber % OCTAVE) - centRatio + noteOffsets[swaraNumber]
    return fineTune
}

const basicPitchBend = (channel,centre,cents,duration,direction) => {
    let messages = []

    messages.push({ "pitchBend": centre, "channel": channel, "delta": Math.floor(duration/8) })

    let i=0
    for(i=1; i*MICROTONE < cents; i++) {
        let pitchBendCents = direction*i*MICROTONE
        let pitchBend = Math.round(centre + pitchBendCents*MIDIPITCHRANGE/OCTAVE)
        let deltaTime = Math.floor((duration*MICROTONE/cents)*(3/4))
        messages.push({ "pitchBend": pitchBend, "channel": channel, "delta": deltaTime })
    }

    let pitchBendCents = direction*cents
    let pitchBend = Math.round(centre + pitchBendCents*MIDIPITCHRANGE/OCTAVE)
    let deltaTime = duration - (i-1)*Math.floor((duration*MICROTONE/cents)*(3/4)) - 2*Math.floor(duration/8)
    messages.push({ "pitchBend": pitchBend, "channel": channel, "delta": deltaTime })

    messages.push({ "pitchBend": pitchBend, "channel": channel, "delta": Math.floor(duration/8) })

    return messages
}

const isGamaka = (note) => note.includes("(G)")

const getStrokeState = (note) => (note.includes("^") ? strokeStateConstants.CONTINUE : strokeStateConstants.STROKE)

const getNoteNumber = (note,key) => (baseOffset(note) + octaveOffset(note) + key)

const getInterval = (note1, note2, noteOffsets) => {
    let swara1 = baseOffset(note1) + octaveOffset(note1)
    let swara2 = baseOffset(note2) + octaveOffset(note2)
    return SEMITONE*(swara1 - swara2) + getFineTune(note1,noteOffsets) - getFineTune(note2,noteOffsets)
}

const getGamakaMessages = (channel,startingCentre,start,end,number,duration) => {
    let messages = []
    let basicDuration = Math.floor(duration/number)
    let basicCents = Math.abs(start - end)
    if(basicCents === 0)
        return [{ "pitchBend": startingCentre, "channel": channel, "delta": duration }]
    let direction = start < end ? 1 : -1
    let floorNumber = Math.floor(number)

    for(let i=0; i<floorNumber; i++) {
        let basicCentre = !(i % 2) ? startingCentre : startingCentre + direction*basicCents*MIDIPITCHRANGE/OCTAVE
        let basicDirection = !(i % 2) ? direction : (-1)*direction
        messages.push(...basicPitchBend(channel,basicCentre,basicCents,basicDuration,basicDirection))
    }

    if(number > floorNumber) {
        let basicCentre = !(floorNumber % 2) ? startingCentre : startingCentre + direction*basicCents*MIDIPITCHRANGE/OCTAVE
        let basicDirection = !(floorNumber % 2) ? direction : (-1)*direction
        messages.push(...basicPitchBend(channel,basicCentre,basicCents*(number-floorNumber),duration - floorNumber*basicDuration,basicDirection))
    }

    return messages
}

const generateJsonMidiTrack = (composition,metadata,noteOffsets) => {
    let trackMetadata = metadata || {
        "trackName": 'Clean Guitar',
        "programNumber": 27,
        "channel": 0,
        "octave": 0,
        "key": 0,
        "offset": 0,
        "tempo": 120
    }
    let tokens = tokenize(composition)
    let key = C3 + trackMetadata.key + 12*trackMetadata.octave
    let channel = trackMetadata.channel

    let track = [
        { "trackName": `${trackMetadata.trackName}`, "delta": 0 },
        { "programChange": { "programNumber": `${trackMetadata.programNumber}` }, "channel": channel, "delta": 0 },
        { "setTempo": { "microsecondsPerQuarter": Math.round(500000*120/trackMetadata.tempo) }, "channel": channel, "delta": 0 },
        { "controlChange": { "type": 100, "value": 0 }, "channel": channel, "delta": 0 },
        { "controlChange": { "type": 101, "value": 0 }, "channel": channel, "delta": 0 },
        { "controlChange": { "type": 6, "value": 12 }, "channel": channel, "delta": 0 },
        { "controlChange": { "type": 38, "value": 0 }, "channel": channel, "delta": 0 },
        { "controlChange": { "type": 100, "value": 127 }, "channel": channel, "delta": 0 },
        { "controlChange": { "type": 101, "value": 127 }, "channel": channel, "delta": 0 },
        { "controlChange": { "type": 100, "value": 1 }, "channel": channel, "delta": 0 },
        { "controlChange": { "type": 101, "value": 0 }, "channel": channel, "delta": 0 },
        { "controlChange": { "type": 6, "value": Math.floor(64+64*trackMetadata.offset/100) }, "channel": channel, "delta": 0 },
        { "controlChange": { "type": 38, "value": 0 }, "channel": channel, "delta": 0 },
        { "controlChange": { "type": 100, "value": 127 }, "channel": channel, "delta": 0 },
        { "controlChange": { "type": 101, "value": 127 }, "channel": channel, "delta": 0 }
    ]

    let trackState = trackStateConstants.PITCH
    let strokeState = strokeStateConstants.STROKE
    let currentNote = ''
    let currentPitchBend = MIDIPITCHCENTRE
    let currentGamakaDuration = 0

    tokens.forEach((token,index) => {
        if(trackState === trackStateConstants.TIMING) {
            let delta = isNote(token) ? WHOLENOTE : getNoteLength(token)
            delta -= currentGamakaDuration
            if(isQ(currentNote)) {
                currentNote = ''
                currentPitchBend = MIDIPITCHCENTRE
                track.push({ "pitchBend": currentPitchBend, "channel": channel, "delta": delta })
            } else if(strokeState === strokeStateConstants.STROKE) {
                track.push({ "noteOff": { "noteNumber": getNoteNumber(currentNote,key) }, "channel": channel, "delta": delta - WHOLENOTE/32})
                currentNote = ''
                track.push({ "pitchBend": MIDIPITCHCENTRE, "channel": channel, "delta": WHOLENOTE/32 })
                currentPitchBend = MIDIPITCHCENTRE
            } else {
                track.push({ "pitchBend": currentPitchBend, "channel": channel, "delta": delta })
            }
            trackState = trackStateConstants.PITCH
        }
        if(isNote(token)) {
            if(isQ(token)) {
                if(strokeState === strokeStateConstants.CONTINUE && !isQ(currentNote)) {
                    track.push({ "noteOff": { "noteNumber": getNoteNumber(currentNote,key) }, "channel": channel, "delta": 0})
                    strokeState = strokeStateConstants.STROKE
                }
                currentNote = token
                currentPitchBend = MIDIPITCHCENTRE
            } else if(isGamaka(token)) {
                let paramsMatch = /\(G\)\(.*\)/
                let params = token.match(paramsMatch)
                params = `${params[0].replace("(G)","").replace("(","").replace(")","")}`
                let paramList = params.split(',')
                let start = isNote(paramList[0]) ? getInterval(paramList[0],token,noteOffsets) : Number(paramList[0])
                let end = isNote(paramList[1]) ? getInterval(paramList[1],token,noteOffsets) : Number(paramList[1])
                let number = Number(paramList[3])*2

                let timing = index+1 >= tokens.length || isNote(tokens[index+1]) ? '1' : tokens[index+1]
                let rate = 2**(Number(paramList[2])/10)
                let gamakaDuration = QUARTERNOTE*number/rate
                let noteDuration = getNoteLength(timing)
                currentGamakaDuration = gamakaDuration < noteDuration ? gamakaDuration : noteDuration

                let startingPitchBendOffset = Math.round(start*MIDIPITCHRANGE/OCTAVE)

                if(strokeState === strokeStateConstants.STROKE) {
                    currentNote = token
                    currentGamakaDuration -= WHOLENOTE/32
                    currentPitchBend = Math.round(MIDIPITCHCENTRE + getFineTune(currentNote,noteOffsets)*MIDIPITCHRANGE/OCTAVE)
                    track.push({ "pitchBend": currentPitchBend+startingPitchBendOffset, "channel": channel, "delta": 0 })
                    track.push({ "noteOn": { "noteNumber": getNoteNumber(currentNote,key), "velocity": 127 }, "channel": channel, "delta": 0})
                } else {
                    currentPitchBend = MIDIPITCHCENTRE + Math.round(getInterval(token,currentNote,noteOffsets)*MIDIPITCHRANGE/OCTAVE)
                    track.push({ "pitchBend": currentPitchBend+startingPitchBendOffset, "channel": channel, "delta": 0 })
                }

                track.push(...getGamakaMessages(channel,currentPitchBend+startingPitchBendOffset,start,end,number,currentGamakaDuration))
                track.push({ "pitchBend": currentPitchBend, "channel": channel, "delta": 1 })
                currentGamakaDuration += 1
            } else {
                currentGamakaDuration = 0
                if(strokeState === strokeStateConstants.STROKE) {
                    currentNote = token
                    currentPitchBend = Math.round(MIDIPITCHCENTRE + getFineTune(currentNote,noteOffsets)*MIDIPITCHRANGE/OCTAVE)
                    track.push({ "pitchBend": currentPitchBend, "channel": channel, "delta": 0 })
                    track.push({ "noteOn": { "noteNumber": getNoteNumber(currentNote,key), "velocity": 127 }, "channel": channel, "delta": 0})
                } else {
                    currentPitchBend += Math.round(getInterval(token,currentNote,noteOffsets)*MIDIPITCHRANGE/OCTAVE)
                    track.push({ "pitchBend": currentPitchBend, "channel": channel, "delta": 0 })
                }
            }
            trackState = trackStateConstants.TIMING
            strokeState = getStrokeState(token)    
        }
    })
    if(trackState === trackStateConstants.TIMING || strokeState === strokeStateConstants.CONTINUE){
        let delta = WHOLENOTE - currentGamakaDuration
        delta = trackState === trackStateConstants.TIMING ? delta : 0
        track.push({ "noteOff": { "noteNumber": getNoteNumber(currentNote,key) }, "channel": channel, "delta": delta})
        currentNote = ''
        track.push({ "pitchBend": MIDIPITCHCENTRE, "channel": channel, "delta": 0 })
        currentPitchBend = MIDIPITCHCENTRE
    }

    track.push({ "endOfTrack": true, "delta": 0 })

    return track
}

const generateJsonMidi = (composition) => {
    let songJSON = {
        "division": QUARTERNOTE,
        "format": 1,
        "tracks": [
            generateJsonMidiTrack(composition)
        ]
    }

    return songJSON
}

const toneName = ["String_1", "String_2", "Bow", "Reed"]

const programNumber = [27, 25, 40, 71]

const psq2JsonMidi = (psqString) => {
    let sequencerState = JSON.parse(psqString)
    let tracks = [0, 1, 2, 3, 4, 5, 6].map((i) => sequencerState[i]).filter((sequencerVoiceState) => sequencerVoiceState['enabled']).map((sequencerVoiceState,index) => {
        let metadata = {
            "trackName": `${sequencerVoiceState['voiceName']}_${toneName[sequencerVoiceState['tone']]}_`,
            "programNumber": programNumber[sequencerVoiceState['tone']],
            "channel": index,
            "octave": sequencerVoiceState['octave'],
            "key": 0,
            "offset": 0,
            "tempo": 120
        }
        return generateJsonMidiTrack(sequencerVoiceState['composition'],metadata)
    })

    let songJSON = {
        "division": QUARTERNOTE,
        "format": 1,
        "tracks": tracks
    }

    return songJSON
}

const sequencer2MIDI = (sequencerState,sequencerSettings,scaleState) => {
    let noteOffsets = Object.entries(baseRatio).map(note => {
        let cent = Number.parseInt(scaleState[`/FaustDSP/Common_Parameters/12_Note_Scale/${note[0]}/Cent`])
        if(isNaN(cent))
            cent = 0
        let subCent = Number.parseInt(scaleState[`/FaustDSP/Common_Parameters/12_Note_Scale/${note[0]}/0.01_Cent`])
        if(isNaN(subCent))
            subCent = 0
        return cent+0.01*subCent
    })
    let tracks = [0, 1, 2, 3, 4, 5, 6].map((i) => sequencerState[i]).filter((sequencerVoiceState) => sequencerVoiceState['enabled']).map((sequencerVoiceState,index) => {
        let metadata = {
            "trackName": `${sequencerVoiceState['voiceName']}_${toneName[sequencerVoiceState['tone']]}_`,
            "programNumber": programNumber[sequencerVoiceState['tone']],
            "channel": index,
            "octave": sequencerVoiceState['octave'],
            "key": sequencerSettings['/FaustDSP/Motif/Pitch'] - 3,
            "offset": sequencerSettings['/FaustDSP/Motif/Fine_Tune'],
            "tempo": 240/(2**(sequencerSettings['/FaustDSP/Motif/Motif_Tempo']))
        }
        return generateJsonMidiTrack(sequencerVoiceState['composition'],metadata,noteOffsets)
    })

    let songJSON = {
        "division": QUARTERNOTE,
        "format": 1,
        "tracks": tracks
    }

    return songJSON
}

export {generateJsonMidi, psq2JsonMidi, sequencer2MIDI}