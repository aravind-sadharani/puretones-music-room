import * as React from 'react'
import styled from 'styled-components'
import Button from 'components/button'
import SaveRestore from 'components/saverestore'
import { buildScale, prepareKeyboard } from 'utils/buildscale'
import { analyzeScale } from 'utils/analyzescale'
import ScalePlayer from 'applets/scaleplayer'
import MotifPlayer from 'applets/motifplayer'

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
        setWeights(analyzeScale(scaleResult.scale))
        setGenTitle('Generate Phrases from Scale')
    }

    const generatePhrase = () => {
        let {noteWeights,linkWeights} = weights
        let randomNoteIndices = [randomIndex(noteWeights)]
        for(let i=1; i<5; i++) {
            randomNoteIndices.push(randomIndex(linkWeights[randomNoteIndices[i-1]]))
        }
        let randomNotes = randomNoteIndices.map(index => noteFromIndex(index))
        setPhrase(randomNotes.join(' '))
    }

    const randomIndex = (distribution) => {
        let max = distribution[distribution.length-1]
        let randomInstance = Math.random()*max
        return distribution.findIndex(histogram => (randomInstance < histogram))
    }

    const noteFromIndex = (index) => {
        if(index < scaleResult.scale.length)
            return `${scaleResult.scale[index][0]}'`
        if(index < 2*scaleResult.scale.length)
            return `${scaleResult.scale[index-scaleResult.scale.length][0]}`
        return 'Sa"'
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
                </center>
            </RagaBrainContainer>}
            {phrase !== '' && <MotifPlayer title={phrase} motif={phrase} scale={scaleResult.settings} />}
        </>
    )
}

export default RagaBrain