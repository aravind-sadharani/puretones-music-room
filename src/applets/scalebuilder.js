import * as React from 'react'
import styled from 'styled-components'
import CommonPitch from 'applets/commonpitch'
import Button from 'components/button'
import { buildScale, prepareKeyboard } from 'utils/buildscale'
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
    const [scaleRules, setScaleRules] = React.useState({rules: ""})
    const [scaleResult, setScaleResult] = React.useState({status: false, message: "", scale: [], notespec: [], settings: ""})
    const onRulesChange = (rules) => {
        setScaleRules({rules: rules})
    }
    
    const solveRules = () => {
        let result = buildScale(scaleRules.rules)

        setScaleResult({status: result.status, message: result.message, scale: result.scale, notespec: [], settings: ""})
    }

    const listen = () => {
        let result = prepareKeyboard(scaleResult.scale)

        setScaleResult({...scaleResult, notespec: result.notespec, settings: result.settings})
    }

    return (
        <>
            <CommonPitch />
            <ScaleBuilderContainer>
                <p><strong>Scale Builder</strong></p>
                <ScaleBuilderEditorElement rows='8' value={scaleRules.rules} onChange={(e) => onRulesChange(e.target.value)} />
                <center><Button onClick={() => solveRules()}>Solve</Button></center>
                <p></p>
                {scaleResult.message !== '' && <ScaleBuilderResultElement><code>{scaleResult.message}</code></ScaleBuilderResultElement>}
                {scaleResult.status && scaleResult.settings === '' && <center><Button onClick={() => listen()}>Listen</Button></center>}
            </ScaleBuilderContainer>
            {scaleResult.settings !== '' && <ScalePlayer title='Press Start to Listen' noteSpec={scaleResult.notespec} scale={scaleResult.settings} />}
        </>
    )
}

export default ScaleBuilder