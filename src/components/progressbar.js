import * as React from "react"
import styled from "styled-components"

const ProgressBarContainer = styled.div`
    padding: 0 0 1em 0;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
`

const ProgressBarRail = styled.div`
    grid-column-start: 1;
    grid-column-end: 3;
    border-radius: 20px;
    margin: 15px 0;
    background: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`background: ${theme.dark.borderColor};`}
`

const ProgressBarFill = styled.div`
    height: 20px;
    border-radius: 20px;
    width: ${(props) => props.width};
    background: ${({theme}) => theme.light.linkColor};
    ${({theme}) => theme.isDark`background: ${theme.dark.linkColor};`}
`

const ProgressPercentage = styled.input`
    -webkit-appearance: none;
    appearance: none;
    padding: 0 6px;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    background: ${({theme}) => theme.light.bodyBackground};
    ${({theme}) => theme.isDark`background: ${theme.dark.bodyBackground};`}
    color: ${({theme}) => theme.light.textColor};
    ${({theme}) => theme.isDark`color: ${theme.dark.textColor};`}
    border-radius: 5px;
    margin: 0 0 0 auto;
    width: 120px;
`

const ProgressBarTitle = styled.span`
`

const ProgressBar = ({title,width}) => {
    let visible = (width !== '0%') && (width !== '100%')
    return (
        <>
            {visible && <ProgressBarContainer>
                <ProgressBarTitle>{title}</ProgressBarTitle>
                <ProgressPercentage type="text" value={width} readOnly />
                <ProgressBarRail>
                    <ProgressBarFill width={width} />
                </ProgressBarRail>
            </ProgressBarContainer>}
        </>
    )
}

export default ProgressBar