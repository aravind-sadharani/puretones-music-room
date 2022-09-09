import * as React from 'react'
import styled from 'styled-components'
import Button from 'components/button'
import SaveRestore from 'components/saverestore'
import { buildScale, prepareKeyboard } from 'utils/buildscale'
import { analyzeScale } from 'utils/analyzescale'
import ScalePlayer from 'applets/scaleplayer'
import MotifPlayer from 'applets/motifplayer'
import Slider from "components/slider"
import RagaWeights from 'applets/ragaweights'

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
    const [genTitle, setGenTitle] = React.useState('Initialize Weights')
    const [feedback, setFeedback] = React.useState({start: 0, end: 0, link: 0})
    const onRulesChange = (rules) => {
        setScaleRules({rules: rules})
    }
    
    const solveRules = () => {
        let result = buildScale(scaleRules.rules)

        if(result.status) {
            let keyboard = prepareKeyboard(result.scale)
            let title = newTitle(scaleResult.message,result.message)
            setScaleResult({status: result.status, message: result.message, scale: result.scale, title: title, notespec: keyboard.notespec, settings: keyboard.settings})
        } else
            setScaleResult({status: result.status, message: result.message, scale: result.scale, title: "", notespec: [], settings: ""})
        
        setGenTitle('Initialize Weights')
        setPhrase('')
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

    const initializeWeights = () => {
        let {noteWeights,linkWeights} = analyzeScale(scaleResult.scale)
    
        for(let i=1; i<noteWeights.length; i++) {
            noteWeights[i] += noteWeights[i-1]
        }
        for(let i=0; i<linkWeights.length; i++) {
            for(let j=1; j<linkWeights[i].length; j++) {
                linkWeights[i][j] += linkWeights[i][j-1]
            }
        }
        setWeights({startWeights: [...noteWeights], linkWeights: [...linkWeights], endWeights: [...noteWeights]})
        setGenTitle('Generate Phrases from Scale')
    }

    const restoreWeights = (snapshot,filename) => {
        setWeights({...JSON.parse(snapshot)})
    }

    const saveWeights = () => `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(weights))}`

    const generatePhrase = () => {
        let {startWeights,linkWeights,endWeights} = weights
        let randomNoteIndices = [randomIndex(startWeights)]
        for(let i=1; i<4; i++) {
            randomNoteIndices.push(randomIndex(linkWeights[randomNoteIndices[i-1]]))
        }
        randomNoteIndices.push(randomIndex(combineDistribution(linkWeights[randomNoteIndices[3]],endWeights)))
        let randomNotes = randomNoteIndices.map(index => noteFromIndex(index))
        setPhrase(randomNotes.join(' '))
    }

    const combineDistribution = (dist1, dist2) => {
        return dist1.map((histogram, index) => histogram*dist2[index])
    }

    const randomIndex = (distribution) => {
        let max = distribution[distribution.length-1]
        let randomInstance = Math.random()*max
        return distribution.findIndex(histogram => (randomInstance < histogram))
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

    const updateWeights = () => {
        let {startWeights, linkWeights, endWeights} = weights
        for(let i=startWeights.length-1; i>0; i--) {
            startWeights[i] -= startWeights[i-1]
        }
        for(let i=0; i<linkWeights.length; i++) {
            for(let j=linkWeights[i].length-1; j>0; j--) {
                linkWeights[i][j] -= linkWeights[i][j-1]
            }
        }
        for(let i=endWeights.length-1; i>0; i--) {
            endWeights[i] -= endWeights[i-1]
        }

        let notes = phrase.split(' ')
        startWeights[indexFromNote(notes[0])] *= (1+0.1*feedback.start)
        for(let i=0;i<notes.length-1;i++) {
            linkWeights[indexFromNote(notes[i])][indexFromNote(notes[i+1])] *= (1+0.1*feedback.link)
        }
        endWeights[indexFromNote(notes[notes.length-1])] *= (1+0.1*feedback.end)

        for(let i=1; i<startWeights.length; i++) {
            startWeights[i] += startWeights[i-1]
        }
        for(let i=0; i<linkWeights.length; i++) {
            for(let j=1; j<linkWeights[i].length; j++) {
                linkWeights[i][j] += linkWeights[i][j-1]
            }
        }
        for(let i=1; i<endWeights.length; i++) {
            endWeights[i] += endWeights[i-1]
        }

        setWeights({startWeights: [...startWeights], linkWeights: [...linkWeights], endWeights: [...endWeights]})
        setPhrase('')
        setFeedback({start: 0, end: 0, link: 0})
    }

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
            {scaleResult.status && <RagaBrainContainer>
                <p><strong>{genTitle}</strong></p>
                <center>
                    {genTitle === 'Initialize Weights' && <Button onClick={()=>initializeWeights()}>Initialize</Button>}
                    {genTitle !== 'Initialize Weights' && <Button onClick={()=>generatePhrase()}>Generate</Button>}
                    <SaveRestore extn='JSON' save={saveWeights} restore={restoreWeights}/>
                    <p></p>
                </center>
            </RagaBrainContainer>}
            {phrase !== '' && <MotifPlayer title={phrase} motif={phrase} scale={scaleResult.settings} />}
            {phrase !== '' && <RagaBrainContainer>
                <p><strong>Provide feedback for the phrase</strong></p>
                <Slider params={startFeedbackParams} path='feedback' onParamUpdate={(value,path) => setFeedback({...feedback, start: value})}></Slider>
                <Slider params={endFeedbackParams} path='feedback' onParamUpdate={(value,path) => setFeedback({...feedback, end: value})}></Slider>
                <Slider params={linkFeedbackParams} path='feedback' onParamUpdate={(value,path) => setFeedback({...feedback, link: value})}></Slider>
                <center><Button onClick={() => updateWeights()}>Update</Button></center>
                <p></p>
            </RagaBrainContainer>}
            {scaleResult.status && genTitle !== 'Initialize Weights' && <RagaWeights scale={scaleResult.scale} weights={weights} />}
        </>
    )
}

export default RagaBrain