const dspTemplateTop = `import("stdfaust.lib");

commonPitch = vslider("[0][style:radio{'B':14;'A#':13;'A':12;'G#':11;'G':10;'F#':9;'F':8;'E':7;'D#':6;'D':5;'C#':4;'C':3}]Pitch",3,3,14,1);
fineTune = vslider("Fine_Tune",0,-100,100,1);
cperiod = 2^(vslider("[01]Motif Tempo",1.0,-2,4,0.1) - 3);
delta = vslider("[04]Shake Variance", 10,0,120,1);  	
rate = vslider("[05]Shake Rate",11.5,10,25,0.1);
c2v(d) = 2^(d/1200)-1;
l2l(r) = 2^(r/10);
number = vslider("[06]Shake Number",3.4,1,10,0.1);
phasor(f) = ba.period(ma.SR/f) : *(f/ma.SR);
ramp(x) = ba.time : *(x);
adder(l1,r1,l2,r2,l3,r3) = l1+l2+l3,r1+r2+r3;
`

const dspTemplateBottom = `
concert = hgroup("[00]Motif",(_voice_1notes,_voice_2notes,_voice_3notes : adder), (_voice_4notes,_voice_5notes,_voice_6notes : adder), _voice_7notes : adder) ;
process = concert : dm.zita_light;
`

const dspToneTemplates = [
    `String1Tone(f,r,g) = StringModel(pm.f2l(f*r*(1+variance)),0.63,10*StringPluck,min(0.95,0.5*(r^0.75)),0,60/(r^2)) + StringModel(pm.f2l(f*r*(1-variance)),0.63,10*StringPluck,min(0.95,0.5*(r^0.75)),0,60/(r^2)) : *(StringEnv)
with {
    variance = vslider("[00]Variance",2,0,4,0.1)/10000;
    StringPluck = en.adsr(0.00001,cperiod*0.7,0.9,cperiod*0.3,g);
    StringEnv = en.adsr(0.0001,cperiod*0.6,0.8,cperiod*0.5,g);
    
    StringModel(length,pluckPosition,excitation,brightness,damping,stiffness) = 0.1*pm.endChain(egChain)
    with{
        openStringPick(length,stiffness,pluckPosition,excitation) = strChain
        with{
            dispersionFilters = par(i,2,si.smooth(stiffness)),_;
            maxStringLength = 6;
            nti = length*pluckPosition; // length of the upper portion of the string
            itb = length*(1-pluckPosition); // length of the lower portion of the string
            strChain = pm.chain(
                pm.stringSegment(maxStringLength,nti) :
                pm.in(excitation) :
                pm.out :
                dispersionFilters :
                pm.stringSegment(maxStringLength,itb)
            );
        };
        lengthTuning = 14*pm.speedOfSound/ma.SR;
        stringL = length-lengthTuning;
        egChain = pm.chain(
            pm.lStringRigidTermination :
            openStringPick(stringL,stiffness/1000,pluckPosition,excitation) :
            pm.rTermination(pm.basicBlock,(-1)*pm.bridgeFilter(brightness,damping))
        );
    };
};`,
    `String2Tone(f,r,g) = StringModel(pm.f2l(f*r*(1+variance)),StringPluck) + StringModel(pm.f2l(f*r*(1-variance)),StringPluck) : *(StringEnv)
with {
    variance = vslider("[00]Variance",2,0,4,0.1)/10000;
    StringPluck = en.adsr(0.00001,cperiod*0.7,0.9,cperiod*0.3,g);
    StringEnv = en.adsr(0.0001,cperiod*0.7,0.9,cperiod*0.4,g);
    
    StringModel(length,excitation) = 2*pm.endChain(egChain)
    with{
        brightness = 0.6/((length)^(1/3));
        stiffness = 25*((length)^(1/3));
        pluckPosition = 0.61;
        StringBody(stringL,excitation) = reflectance,transmittance,_
        with{
            c = (0.375*(stringL^(1/4)) - 0.0825);
            transmittance = _ <: *(1-c),1*c*fi.resonbp(pm.l2f(stringL),2,1) :> _;
            reflectance = _;
        };
        StringBridge(brightness) = pm.rTermination(pm.basicBlock,reflectance) : _,transmittance,_
        with{
            reflectance = (-1)*pm.bridgeFilter(brightness,0);
            transmittance = _;
        };
        openStringPick(length,stiffness,pluckPosition,excitation) = strChain
        with{
            dispersionFilters = par(i,2,si.smooth(stiffness)),_;
            maxStringLength = 6;
            nti = length*pluckPosition; // length of the upper portion of the string
            itb = length*(1-pluckPosition); // length of the lower portion of the string
            strChain = pm.chain(
                pm.stringSegment(maxStringLength,nti) :
                pm.in(excitation) :
                dispersionFilters :
                pm.stringSegment(maxStringLength,itb)
            );
        };
        lengthTuning = 13*pm.speedOfSound/ma.SR;
        stringL = length-lengthTuning;
        egChain = pm.chain(
            pm.lStringRigidTermination :
            openStringPick(stringL,stiffness/1000,pluckPosition,excitation) :
            StringBridge(brightness) : 
            StringBody(length,excitation) :
            pm.out
        );
    };
};`,
    `ViolinTone(f,r,g) = ((pm.f2l(f*r)/6))*ViolinModel(pm.f2l(f*r),0.2*ViolinBow,0.2*ViolinBow,0.79) : *(ViolinEnv)
with {

    ViolinLongBowRamp(x) = ramp(x) - (ramp(x) : ba.latch(g)) : *(-1) : exp;
    ViolinLongBowDynamics(x) = phasor(x) - (phasor(x) : ba.latch(g)) : *(2*ma.PI) : cos;
    ViolinBow = en.adsr(0.1,cperiod*0.7,0.6,cperiod*0.3,g)*(1+0.35*ViolinLongBowDynamics(1/(16*cperiod)))*(0.15+ViolinLongBowRamp(2.5*cperiod/ma.SR));
    ViolinEnv = en.adsr(0.1,cperiod*0.6,0.6,cperiod*0.5,g);
    
    violinBowedString(length,bowPressure,bowVelocity,bowPosition) = strChain
          with{
          maxStringLength = 6;
          nti = length*bowPosition; // length of the upper portion of the string
            itb = length*(1-bowPosition); // length of the lower portion of the string
          strChain = pm.chain(
            pm.stringSegment(maxStringLength,nti) : 
            pm.violinBow(bowPressure,bowVelocity) :  
            pm.stringSegment(maxStringLength,itb)
          );
          };
        violinBridge = pm.rTermination(pm.basicBlock,reflectance) : _,transmittance,_
        with{
            reflectance = (-1)*pm.bridgeFilter(0.2,0.9);
            transmittance = _;
        };
        violinBody(stringL) = reflectance,transmittance,_
        with{
            transmittance = _ <: 0.5*fi.resonbp(pm.l2f(stringL/4),2,1) + 1.5*fi.resonbp(pm.l2f(stringL/2),2,1) :> _ ;
            reflectance = _;
        };
        ViolinModel(length,bowPressure,bowVelocity,bowPosition) = 15*pm.endChain(egChain)
        with{
          lengthTuning = 11*pm.speedOfSound/ma.SR;
          stringL = length-lengthTuning;
          egChain = pm.chain(
            pm.lTermination((-1)*pm.bridgeFilter(0.3,0.1),pm.basicBlock) :
            violinBowedString(stringL,bowPressure,bowVelocity,bowPosition) :
                violinBridge :
                violinBody(stringL) :
                pm.out
          );
        };
};`,
    `ReedTone(f,r,g) = ReedModel(pm.f2l(f*r),0.56*(1+ReedBlow),-0.104) : *(ReedEnv)
with {

    ReedLongBlowDynamics(x) = phasor(x) - (phasor(x) : ba.latch(g)) : *(2*ma.PI) : cos;
    ReedBlow = 3*en.adsr(0.01,cperiod*0.7,0.9,cperiod*0.3,g)*(1+0.25*ReedLongBlowDynamics(1/(16*cperiod)));
    ReedLongBlowRamp(x) = (ramp(x) - (ramp(x) : ba.latch(g))) : *(-1) : exp;
    ReedEnv = en.adsr(0.1,cperiod*0.6,0.8,cperiod*0.5,g)*(0.3+0.7*ReedLongBlowRamp(2*cperiod/ma.SR));
    
    reedTable(offset,slope) = reedTable : min(1) : max(-1)
        with {
            reedTable = *(slope) + offset;
        };
        clarinetReed(stiffness) = reedTable(0.7,stiffness);
        ReedMouthPiece(reedStiffness,pressure) = pm.lTermination(reedInteraction,pm.in(pressure))
        with{
            reedInteraction = *(-1) <: *(clarinetReed(reedStiffness));
        };
        wBell(length) = pm.rTermination(pm.basicBlock,bellFilter)
        with {
          opening = (length^(1/3))/(length^(1/3)+1);
          bellFilter = si.smooth(opening);
        };
        ReedModel(tubeLength,pressure,reedStiffness) = 0.75*pm.endChain(modelChain)
        with{
            lengthTuning = 7*pm.speedOfSound/ma.SR;
            maxTubeLength = 3;
            tunedLength = tubeLength/2-lengthTuning;
            modelChain =
                pm.chain(
                    ReedMouthPiece(reedStiffness,pressure) :
                    pm.openTube(maxTubeLength,tunedLength) :
                    wBell(tubeLength/2) : pm.out
                );
        };
    };`
]

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
    Q: 3
}

const toneNames = ["String1", "String2", "Violin", "Reed"]

const tokenize = str => str.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/(\n|\t)/g,' ').split(' ').map(s => s.trim()).filter(s => s.length)

const baseValue = (noteStr) => {
    let baseStr = noteStr.substring(0,3)
    let value = Object.entries(baseRatio).map(note => (baseStr.includes(note[0]) ? note[1] : -1)).filter(x => x !== -1)
    return (value.length ? value[0] : -1)
}

const octaveValue = (noteStr) => {
    let octStr = noteStr.substring(2,4)
    if(octStr.includes('"'))
        return 2
    if(octStr.includes("'"))
        return 1/2
    return 1
}

const gamakaValue = (noteStr) => {
    if(noteStr.includes("(G)"))
        return 1
    return 0
}

const gamakaParams = (noteStr) => {
    let paramsMatch = /\(G\)\(.*\)/
    let params = noteStr.match(paramsMatch)
    if(params === null || params[0].replace("(G)","") === "()")
        return "none"
    else
        return `${params[0].replace("(G)","").replace("(","").replace(")","")}`
}

const isEqual = (note1, note2) => (baseValue(note1) === baseValue(note2) && octaveValue(note1) === octaveValue(note2) && gamakaValue(note1) === gamakaValue(note2) && gamakaParams(note1) === gamakaParams(note2))

const isNote = (token) => (baseValue(token) !== -1)

const findUniqueNotes = (tokens) => {
    let notes = tokens.filter(isNote)
    let uniqueNotes = []

    notes.forEach(note => {
        if(uniqueNotes.find(uniqueNote => isEqual(uniqueNote, note)) === undefined)
            uniqueNotes.push(note)
        if(note.includes("(G)")) {
            let paramsMatch = /\(G\)\(.*\)/
            let unShakenNote = note.replace(paramsMatch,"")
            if(uniqueNotes.find(uniqueNote => isEqual(uniqueNote, unShakenNote)) === undefined)
                uniqueNotes.push(unShakenNote)
        }
    })

    return uniqueNotes
}

const getFineTune = (noteStr,noteOffsets) => {
    let baseStr = noteStr.substring(0,3)
    let value = Object.entries(baseRatio).map((note,index) => (baseStr.includes(note[0]) ? `${noteOffsets[index]}` : '0')).filter(x => x !== '0')
    return (value.length ? value[0] : '0')
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

const getGateLength = (timeStr) => 8*jatiValue(timeStr)*repeatValue(timeStr)

const getGateTiming = (tokens) => {
    let state = 0
    let timing = []

    tokens.forEach(token => {
        if(state === 0 && isNote(token))
            state = 1
        else if(state === 1 && isNote(token)) {
            timing.push(8)
            state = 1
        } else if(state === 1 && !isNote(token)) {
            timing.push(getGateLength(token))
            state = 0
        }
    })
    if(state === 1)
        timing.push(8)

    return timing
}

const printNoteId = (voiceName, id) => `${voiceName}ratio_${id}`

const printPitch = (voiceName,octave) => `${voiceName}cpitch = 110*(2^(commonPitch/12))*(2^(fineTune/1200))*(2^(${octave}));\n`

const printNoteSpec = (voiceName, noteStr, id, noteOffsets) => `${voiceName}ratio_${id} = (${baseValue(noteStr)}) * (${octaveValue(noteStr)}) * (2^(${getFineTune(noteStr,noteOffsets)}/1200))${printGamaka(voiceName, noteStr, noteOffsets)}  //${noteStr}\n`

const printGamaka = (voiceName, noteStr, noteOffsets) => {
    let params = gamakaParams(noteStr)
    if(params !== 'none') {
        params = evaluateGamakaParams(params, noteStr, noteOffsets)
    }
    return (params === "none" ? `${(gamakaValue(noteStr) ? ` * (delta,(-1)*delta,rate,number,8*cperiod : ${voiceName}shake);` : ";")}` : ` * (${params},8*cperiod : ${voiceName}shake);`)
}

const evaluateGamakaParams = (params, noteStr, noteOffsets) => {
    let paramList = params.split(',')
    let startCents = isNote(paramList[0]) ? centsFromNotes(paramList[0],noteStr) + Number(getFineTune(paramList[0],noteOffsets)) - Number(getFineTune(noteStr,noteOffsets)) : paramList[0]
    let endCents = isNote(paramList[1]) ? centsFromNotes(paramList[1],noteStr) + Number(getFineTune(paramList[1],noteOffsets)) - Number(getFineTune(noteStr,noteOffsets)) : paramList[1]
    paramList[0] = Number(startCents).toFixed(2)
    paramList[1] = Number(endCents).toFixed(2)
    let evaluatedParams = paramList.join(',')
    return evaluatedParams
}

const centsFromNotes = (noteStr, baseNoteStr) => {
    let noteRatio = ratioFromNote(noteStr)
    let baseNoteRatio = ratioFromNote(baseNoteStr)
    return 1200*Math.log2(noteRatio/baseNoteRatio)
}

const ratioFromNote = (noteStr) => Number(baseValue(noteStr))*Number(octaveValue(noteStr))

const printGateTiming = (id, repeats) => (id.includes("Q") ? "0,0,".repeat(repeats-1).concat("0,0") : "1,1,".repeat(repeats-1).concat("1,0"))

const printStrokeTiming = (id, repeats) => {
    if(id.includes("Q")) {
        return "0,0,".repeat(repeats-1).concat("0,0")
    } else if(id.includes("^")) {
        return "1,1,".repeat(repeats-1).concat("1,1")
    } else {
        return "1,1,".repeat(repeats-1).concat("1,0")
    }
}

const printNoteTiming = (id, repeats) => `${id},`.repeat(2*repeats-1).concat(`${id}`)

const getVoice = (voiceName,tokens,octave,noteOffsets,toneName) => {
    let uniqueNotes = findUniqueNotes(tokens)
    let gateTimes = getGateTiming(tokens)
    let noteIds = tokens.filter(isNote).map(n => uniqueNotes.findIndex(t => isEqual(t,n)))

    let noteSpec = `${uniqueNotes.map((str,id) => printNoteSpec(voiceName,str,id,noteOffsets)).join("")}
${voiceName}noteratio = ${uniqueNotes.map((str,id) => printNoteId(voiceName,id)).join()} : ba.selectn(${uniqueNotes.length},${voiceName}noteindex);`

    let gateTiming = `${noteIds.map((id, index) => printGateTiming(uniqueNotes[id],gateTimes[index])).join()}`
    let strokeTiming = `${tokens.filter(isNote).map((id, index) => printStrokeTiming(id,gateTimes[index])).join()}`
    let gateWaveformLength = gateTiming.length
    let noteTiming = `${noteIds.map((id, index) => printNoteTiming(id,gateTimes[index])).join()}`

    let dspVoiceTop = `
${voiceName}phasedcos(x) = phasor(x) - (phasor(x) : ba.latch(${voiceName}gate(cperiod))) : *(2*ma.PI) : cos;
${voiceName}lockedramp(x) = ramp(x) - (ramp(x) : ba.latch(${voiceName}gate(cperiod)));
${voiceName}shake(d1,d2,r,n,p) = 1+((c2v(d1)+c2v(d2))/2+(c2v(d1)-c2v(d2))*${voiceName}phasedcos(l2l(r))/2)*(${voiceName}lockedramp(l2l(r)) < n*ma.SR);
${voiceName}noteindex = cperiod : ${voiceName}motifnotes;
`

    let voiceComposition = `${dspVoiceTop}
${printPitch(voiceName,octave)}
${noteSpec}
${voiceName}gatewaveform = waveform{${gateTiming}};
${voiceName}gate(p) = ${voiceName}gatewaveform,int(2*ba.period(${(gateWaveformLength+1)/4}*p*ma.SR)/(p*ma.SR)) : rdtable;
${voiceName}motif = waveform{${noteTiming}};
${voiceName}motifnotes(p) = ${voiceName}motif,int(2*ba.period(${(gateWaveformLength+1)/4}*p*ma.SR)/(p*ma.SR)) : rdtable;
${voiceName}strokewaveform = waveform{${strokeTiming}};
${voiceName}stroke(p) = ${voiceName}strokewaveform,int(2*ba.period(${(gateWaveformLength+1)/4}*p*ma.SR)/(p*ma.SR)) : rdtable;
${voiceName}gain = 10^(vslider("${voiceName}/Gain",-9,-40,0,0.1) : /(20));
${voiceName}pan = _ <: *(1-pos),*(pos)
with {
    pos = vslider("${voiceName}/Pan",0.5,0,1,0.1) : si.smoo;
};
${voiceName}notes = ${toneName}Tone(${voiceName}cpitch,${voiceName}noteratio,${voiceName}stroke(cperiod)) : *(${voiceName}gain) : @(ma.SR*0.1) <: ${voiceName}pan;
`
    return voiceComposition
}

const generateDSP = (sequencerState,scaleState) => {
    const generateVoiceCode = (sequencerVoiceState) => {
        let voiceName = sequencerVoiceState['voiceName']

        if(!sequencerVoiceState['enabled'])
            return `${voiceName}notes = 0,0;\n`
        
        let tokens = tokenize(sequencerVoiceState['composition'])
        let octave = sequencerVoiceState['octave']
        let noteOffsets = Object.entries(baseRatio).map(note => {
            let cent = Number.parseInt(scaleState[`/FaustDSP/Common_Parameters/12_Note_Scale/${note[0]}/Cent`])
            if(isNaN(cent))
                cent = 0
            let subCent = Number.parseInt(scaleState[`/FaustDSP/Common_Parameters/12_Note_Scale/${note[0]}/0.01_Cent`])
            if(isNaN(subCent))
                subCent = 0
            return cent+0.01*subCent
        })
        let toneName = toneNames[sequencerVoiceState['tone']]
        return getVoice(voiceName,tokens,octave,noteOffsets,toneName)
    }

    let voiceCode = [0, 1, 2, 3, 4, 5, 6].map((i) => generateVoiceCode(sequencerState[i])).join('\n')
    let toneCode = dspToneTemplates.filter((template,index) => {
        let present = [0, 1, 2, 3, 4, 5, 6].map((i) => sequencerState[i]['tone']).filter((toneIndex,index) => sequencerState[index]['enabled']).find(toneIndex => Number(toneIndex) === index)
        return (present !== undefined)
    }).join('\n')
    
    let fullDSPCode = `${dspTemplateTop}
    ${toneCode}
    ${voiceCode}
    ${dspTemplateBottom}
    `
    return fullDSPCode
}

export default generateDSP