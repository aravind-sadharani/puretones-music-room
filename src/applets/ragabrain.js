import * as React from 'react'
import styled from 'styled-components'
import Button from 'components/button'
import SaveRestore from 'components/saverestore'
import { buildScale, prepareKeyboard } from 'utils/buildscale'
import { analyzeScale } from 'utils/analyzescale'
import ScalePlayer from 'applets/scaleplayer'
import MotifPlayer from 'applets/motifplayer'
import Slider from "components/slider"
import TabNav from "components/tabs"
import RagaWeights from 'applets/ragaweights'

const SCALE=300
const START=0.5
const RANDOM=0
const GOOD=1

const RagaBrainContainer = styled.div`
    padding: 12px 12px 0 12px;
    margin: 0 0 1em 0;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-radius: 5px;
`

const ScaleBuilderEditorElement = styled.textarea`
    color: ${({theme}) => theme.light.textColor};
    ${({theme}) => theme.isDark`color: ${theme.dark.textColor};`}
    background-color: ${({theme}) => theme.light.bodyBackground};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.bodyBackground};`}
    display: block;
    overflow: auto;
    height: auto;
    width: 100%;
    margin: 0 0 12px 0;
    border: 1px solid;
    border-radius: 5px;
    padding: 0 6px;
    font-size: 0.85rem;
    resize: vertical;
`

const ScaleBuilderResultElement = styled.pre`
    margin: 0 0 1em 0;
    overflow-x: scroll;
`

const RagaBrain = () => {
    const [scaleRules, setScaleRules] = React.useState({rules: ""})
    const [scaleResult, setScaleResult] = React.useState({status: false, message: "", scale: [], title: "", notespec: [], settings: ""})
    const [weights, setWeights] = React.useState({})
    const [phrase, setPhrase] = React.useState("")
    const [phraseIndices, setPhraseIndices] = React.useState([])
    const [confidence, setConfidence] = React.useState(0)
    const [phraseLength, setPhraseLength] = React.useState(2)
    const [feedback, setFeedback] = React.useState({start: 0, end: 0, link: 0})
    const [threshold, setThreshold] = React.useState(20)
    const [mode, setMode] = React.useState(RANDOM)
    const onRulesChange = (rules) => {
        setScaleRules({rules: rules})
    }
    
    const solveRules = () => {
        let result = buildScale(scaleRules.rules)

        if(result.status) {
            let keyboard = prepareKeyboard(result.scale)
            let title = newTitle(scaleResult.message,result.message)
            setScaleResult({status: result.status, message: result.message, scale: result.scale, title: title, notespec: keyboard.notespec, settings: keyboard.settings})

            let {noteWeights,linkWeights} = analyzeScale(result.scale)
            let initialWeights = {startWeights: [...noteWeights], linkWeights: [...linkWeights], endWeights: [...noteWeights]}
            setWeights(initialWeights)
            setPhrase('')
            setPhraseIndices([])
        } else
            setScaleResult({status: result.status, message: result.message, scale: result.scale, title: "", notespec: [], settings: ""})
    }

    const newTitle = (oldMsg, newMsg) => {
        if(newMsg === '')
            return ''
        if(oldMsg === '' || oldMsg.split('\n')[0] !== newMsg.split('\n')[0])
            return `Listen to the ${newMsg.split('\n')[0].replace(/,/g,', ')}`
        
        let oldMsgLines = oldMsg.split('\n')
        let newMsgLines = newMsg.split('\n')
        let changes = newMsgLines.filter((line,index) => line !== oldMsgLines[index]).join(', ')
        return `Listen to the ${oldMsg.split('\n')[0].replace(/,/g,', ')}\n ${changes !== '' ? `(${changes})` : ''}` 
    }

    const save = () => `data:text/plain;charset=utf-8,${encodeURIComponent(scaleResult.settings)}`

    const resetWeights = () => {
        let {noteWeights,linkWeights} = analyzeScale(scaleResult.scale)
        let initialWeights = {startWeights: [...noteWeights], linkWeights: [...linkWeights], endWeights: [...noteWeights]}
        setWeights(initialWeights)
        setPhrase('')
        setPhraseIndices([])
    }

    const restoreWeights = (snapshot,filename) => {
        setWeights({...JSON.parse(snapshot)})
    }

    const saveWeights = () => `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(weights))}`

    const generatePhrase = (mode) => {
        setMode(mode)
        let {startWeights,linkWeights,endWeights} = weights
        let randomNoteIndices = []
        let startInstance = mode === RANDOM ? uniformIndex(startWeights) : goodIndex(startWeights,threshold*START)
        randomNoteIndices.push(startInstance.index)
        let phraseConfidence = startInstance.confidence
        for(let i=1; i<phraseLength-1; i++) {
            let linkInstance = mode === RANDOM ? uniformIndex(linkWeights[randomNoteIndices[i-1]]) : goodIndex(linkWeights[randomNoteIndices[i-1]],threshold)
            randomNoteIndices.push(linkInstance.index)
            phraseConfidence *= linkInstance.confidence
        }
        let endInstance = mode === RANDOM ? uniformIndex(combineDensity(linkWeights[randomNoteIndices[phraseLength-2]],endWeights)) : goodIndex(combineDensity(linkWeights[randomNoteIndices[phraseLength-2]],endWeights),threshold)
        randomNoteIndices.push(endInstance.index)
        phraseConfidence *= endInstance.confidence
        let randomNotes = randomNoteIndices.map(index => noteFromIndex(index))
        setPhrase(randomNotes.join(' '))
        setPhraseIndices(randomNoteIndices)
        setConfidence(SCALE*Math.pow(phraseConfidence, 1/phraseLength))
    }

    const combineDensity = (density1, density2) => {
        return density1.map((density1Value, index) => density1Value*density2[index])
    }

    const uniformIndex = (density) => {
        let distribution = [...density]
        for(let i=1; i<distribution.length; i++)
            distribution[i] += distribution[i-1]
        let max = distribution[distribution.length-1]
        let instanceIndex = Math.floor(Math.random()*distribution.length)
        return {
            index: instanceIndex,
            confidence: density[instanceIndex]/max
        }
    }

    const randomIndex = (density) => {
        let distribution = [...density]
        for(let i=1; i<distribution.length; i++)
            distribution[i] += distribution[i-1]
        let max = distribution[distribution.length-1]
        let randomInstance = Math.random()*max
        let instanceIndex = distribution.findIndex(histogram => (randomInstance < histogram))
        return {
            index: instanceIndex,
            confidence: density[instanceIndex]/max
        }
    }

    const goodIndex = (density,threshold) => {
        const MAX = 1000
        let found = false
        let goodInstance = {}
        for(let i=0; i<MAX && !found; i++) {
            goodInstance = randomIndex(density)
            if(SCALE*goodInstance.confidence >= threshold)
                found = true
        }
        if(!found)
            console.log(found)
        return goodInstance
    }

    const noteFromIndex = (index) => {
        if(index < scaleResult.scale.length)
            return `${scaleResult.scale[index][0]}`
        if(index < 2*scaleResult.scale.length)
            return `${scaleResult.scale[index-scaleResult.scale.length][0]}"`
        return 'SA"'
    }

    const indexFromNote = (note) => {
        if(note === 'SA"')
            return 2*scaleResult.scale.length
        let index = scaleResult.scale.findIndex(candidateNote => candidateNote[0] === note.replace('"',''))
        if(note.includes('"'))
            return index + scaleResult.scale.length
        else
            return index
    }

    let phraseLengthParams = {
        key: "Phrase Length",
        init: phraseLength,
        max: 10,
        min: 2,
        step: 1
    }

    let startFeedbackParams = {
        key: "Starting Note",
        init: feedback[`start`],
        max: 2,
        min: -2,
        step: 1
    }

    let endFeedbackParams = {
        key: "Ending Note",
        init: feedback[`end`],
        max: 2,
        min: -2,
        step: 1
    }

    let linkFeedbackParams = {
        key: "Path",
        init: feedback[`link`],
        max: 2,
        min: -2,
        step: 1
    }

    let thresholdParams = {
        key: "Threshold",
        init: threshold,
        max: 80,
        min: 0,
        step: 1
    }

    const updateWeights = () => {
        let {startWeights, linkWeights, endWeights} = weights

        let notes = phrase.split(' ')
        startWeights[indexFromNote(notes[0])] *= (1+0.1*feedback.start)
        for(let i=0;i<notes.length-1;i++) {
            linkWeights[indexFromNote(notes[i])][indexFromNote(notes[i+1])] *= (1+0.1*feedback.link)
            if(notes[i].includes('"') && notes[i+1].includes('"')) {
                linkWeights[indexFromNote(notes[i])-scaleResult.scale.length][indexFromNote(notes[i+1])-scaleResult.scale.length] = linkWeights[indexFromNote(notes[i])][indexFromNote(notes[i+1])]
            } else if(!(notes[i].replace('Sa"','SA').includes('"')) && !(notes[i+1].replace('Sa"','SA').includes('"'))) {
                linkWeights[indexFromNote(notes[i])+scaleResult.scale.length][indexFromNote(notes[i+1])+scaleResult.scale.length] = linkWeights[indexFromNote(notes[i])][indexFromNote(notes[i+1])]
            }
        }
        endWeights[indexFromNote(notes[notes.length-1])] *= (1+0.1*feedback.end)

        setWeights({startWeights: [...startWeights], linkWeights: [...linkWeights], endWeights: [...endWeights]})
        setPhrase('')
        setPhraseIndices([])
        setFeedback({start: 0, end: 0, link: 0})
    }

    const editWeights = (value,rowID,colID) => {
        let {startWeights, linkWeights, endWeights} = weights
        if(rowID === '-1') {
            startWeights[colID] = Number(value)
            setWeights({...weights, startWeights: startWeights})
        } else if(rowID === '-2') {
            endWeights[colID] = Number(value)
            setWeights({...weights, endWeights: endWeights})
        } else {
            linkWeights[rowID][colID] = Number(value)
            setWeights({...weights, linkWeights: linkWeights})
        }
    }

    const tabList = ['Parameters', 'Train', 'Generate']
    const pageList = [
        <>
            <p><strong>Model Parameters</strong></p>
            <center>
                <Button onClick={()=>resetWeights()}>Reset</Button>
                <SaveRestore extn='JSON' save={saveWeights} restore={restoreWeights}/>
            </center>
            <p></p>
            <RagaWeights scale={scaleResult.scale} weights={weights} phrase={phraseIndices} onWeightChanged={(value,rowID,colID) => editWeights(value,rowID,colID)} />
        </>,
        <>
            <p><strong>Random Phrases for Training</strong></p>
            <Slider params={phraseLengthParams} path='phraselength' onParamUpdate={(value,path) => setPhraseLength(value)}></Slider>
            <center>
                <Button onClick={()=>generatePhrase(RANDOM)}>Generate</Button>
            </center>
            <p></p>
            {phrase !== '' && mode === RANDOM && <MotifPlayer title={`${phrase} (Score: ${confidence.toFixed(0)})`} motif={phrase} scale={scaleResult.settings} />}
            {phrase !== '' && mode === RANDOM && <>
                <p><strong>Provide Feedback for the phrase</strong></p>
                <Slider params={startFeedbackParams} path='feedback' onParamUpdate={(value,path) => setFeedback({...feedback, start: value})}></Slider>
                <Slider params={endFeedbackParams} path='feedback' onParamUpdate={(value,path) => setFeedback({...feedback, end: value})}></Slider>
                <Slider params={linkFeedbackParams} path='feedback' onParamUpdate={(value,path) => setFeedback({...feedback, link: value})}></Slider>
                <center><Button onClick={() => updateWeights()}>Update</Button></center>
                <p></p>
            </>}
        </>,
        <>
            <p><strong>Generate Phrases from Threshold</strong></p>
            <Slider params={phraseLengthParams} path='phraselength' onParamUpdate={(value,path) => setPhraseLength(value)}></Slider>
            <Slider params={thresholdParams} path='threshold' onParamUpdate={(value,path) => setThreshold(value)}></Slider>
            <center>
                <Button onClick={()=>generatePhrase(GOOD)}>Generate</Button>
            </center>
            <p></p>
            {phrase !== '' && mode === GOOD && <MotifPlayer title={`${phrase} (Score: ${confidence.toFixed(0)})`} motif={phrase} scale={scaleResult.settings} />}
        </>
    ]

    return (
        <>
            <RagaBrainContainer>
                <p><strong>Constraints for the Scale</strong></p>
                <ScaleBuilderEditorElement rows='8' value={scaleRules.rules} onChange={(e) => onRulesChange(e.target.value)} />
                <center>
                    <Button onClick={() => solveRules()}>Build</Button>
                    {scaleResult.settings !== '' && <SaveRestore extn='pkb' save={save}/>}
                    <p></p>
                </center>
            </RagaBrainContainer>
            {scaleResult.settings !== '' && <ScalePlayer title={scaleResult.title} noteSpec={scaleResult.notespec} scale={scaleResult.settings} />}
            {scaleResult.message !== '' && !scaleResult.status && <RagaBrainContainer>
                <p><strong>Notes about the Scale</strong></p>
                <ScaleBuilderResultElement>
                    <code>
                        {scaleResult.message}
                    </code>
                </ScaleBuilderResultElement>
            </RagaBrainContainer>}
            {scaleResult.status && <TabNav tablist={tabList} pagelist={pageList} />}
        </>
    )
}

export default RagaBrain