import * as React from 'react'
import styled from 'styled-components'
import CommonPitch from 'applets/commonpitch'
import Button from 'components/button'
import buildScale from 'utils/buildscale'
import ScalePlayer from 'applets/scaleplayer'

const ScaleBuilderContainer = styled.div`
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
    code {
        padding: 0px;
    }
`

const ScaleBuilder = () => {
    const [scaleConstraints, setScaleConstraints] = React.useState({constraints: ""})
    const [scaleResult, setScaleResult] = React.useState({message: "", notespec: [], settings: ""})
    const onConstraintsChange = (constraints) => {
        setScaleConstraints({constraints: constraints})
    }
    
    const solveConstraints = () => {
        let result = buildScale(scaleConstraints.constraints)
        
        let message = `The following notes are part of the scale: ${result.scaleNotes.map(note => note[0]).join(',')}
${result.solvedNotes.map(note => `${note[0]}: ${note[1]} ¢`).join('\n')}
${result.unSolvedNotes.length > 0 ? `The following notes cannot be solved with the given information: ${result.unSolvedNotes.map(note => note[0]).join(',')}\nThey will have default values.\n` : ''}`

        setScaleResult({message: message, notespec: [], settings: ""})
    }

    const generate = () => {
        let result = buildScale(scaleConstraints.constraints)

        const noteLabel = note => scaleNotesList.includes(note) ? note : 'fade'

        let scaleNotesList = result.scaleNotes.map(note => note[0]).join(',')
        let noteSpec = [
            {white: "Sa", black: `${noteLabel('re')}`},
            {white: `${noteLabel('Re')}`, black: `${noteLabel('ga')}`},
            {white: `${noteLabel('Ga')}`},
            {white: `${noteLabel('ma')}`, black: `${noteLabel('Ma')}`},
            {white: `${noteLabel('Pa')}`, black: `${noteLabel('dha')}`},
            {white: `${noteLabel('Dha')}`, black: `${noteLabel('ni')}`},
            {white: `${noteLabel('Ni')}`},
            {white: "SA"}
        ]
        setScaleResult({message: scaleResult.message, notespec: noteSpec, settings: result.settings})
    }

    return (
        <>
            <CommonPitch />
            <ScaleBuilderContainer>
                <p><strong>Scale Builder</strong></p>
                <ScaleBuilderEditorElement rows='8' value={scaleConstraints.constraints} onChange={(e) => onConstraintsChange(e.target.value)} />
                <center><Button onClick={() => solveConstraints()}>Solve Scale</Button></center>
                <p></p>
                {scaleResult.message !== '' && <ScaleBuilderResultElement><code>{scaleResult.message}</code></ScaleBuilderResultElement>}
                {scaleResult.message !== '' && <center><Button onClick={() => generate()}>Build Scale</Button></center>}
            </ScaleBuilderContainer>
            {scaleResult.settings !== '' && <ScalePlayer title='Generated Scale' noteSpec={scaleResult.notespec} scale={scaleResult.settings} />}
        </>
    )
}

export default ScaleBuilder