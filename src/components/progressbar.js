import * as React from "react"
import styled from "styled-components"

const ProgressBarContainer = styled.div`
    display: ${({width}) => width === 100 ? 'none' : 'grid'};
    padding: 0 0 1em 0;
    margin: 0;
    grid-template-columns: 1fr 1fr;
`

const ProgressBarRail = styled.div`
    grid-column-start: 1;
    grid-column-end: 3;
    border-radius: 20px;
    margin: 15px 0;
    background-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.borderColor};`}
`

const ProgressBarFill = styled.div`
    height: 20px;
    border-radius: 20px;
    width: ${({width}) => width === 0 ? '0%' : `max(20px,${width}%)`};
    background-color: ${({theme}) => theme.light.linkColor};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.linkColor};`}
`

const ProgressPercentage = styled.input`
    -webkit-appearance: none;
    appearance: none;
    padding: 0 6px;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    background-color: ${({theme}) => theme.light.bodyBackground};
    ${({theme}) => theme.isDark`background-color: ${theme.dark.bodyBackground};`}
    color: ${({theme}) => theme.light.textColor};
    ${({theme}) => theme.isDark`color: ${theme.dark.textColor};`}
    border-radius: 5px;
    margin: 0 0 0 auto;
    width: 120px;
`

const ProgressBarTitle = styled.span`
`

const ProgressBar = ({title,progress}) => {
    return (
        <ProgressBarContainer width={progress}>
            <ProgressBarTitle>{title}</ProgressBarTitle>
            <ProgressPercentage type="text" value={`${progress}%`} readOnly />
            <ProgressBarRail>
                <ProgressBarFill width={progress} />
            </ProgressBarRail>
        </ProgressBarContainer>
    )
}

export default ProgressBar