import * as React from "react"
import styled from "styled-components"

const ToggleContainer = styled.div`
    padding: 0 0 1em 0;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
`

const ToggleElement = styled.label`
    margin: 0 0 0 auto;
    position: relative;
    display: inline-block;
    width: 48px;
    height: 28px;
`

const ToggleState = styled.input.attrs({ type: 'checkbox' })`
    opacity: 0;
    width: 0;
    height: 0;
`

const ToggleSwitch = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({checked,theme}) => checked ? `${theme.light.linkColor}` : `${theme.light.borderColor}`};
    ${({checked,theme}) => checked ? theme.isDark`background-color: ${theme.dark.linkColor};` : theme.isDark`background-color: ${theme.dark.borderColor};`}
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 28px;
    :before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 4px;
        bottom: 4px;
        background-color: ${({theme}) => theme.light.bodyBackground};
        ${({theme}) => theme.isDark`background-color: ${theme.dark.bodyBackground};`}
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 50%;
        -webkit-transform: ${({checked}) => checked ? 'translateX(20px)' : ''};
        -ms-transform: ${({checked}) => checked ? 'translateX(20px)' : ''};
        transform: ${({checked}) => checked ? 'translateX(20px)' : ''};
    }
`

const ToggleKey = styled.span`
`

const Toggle = ({title,status,path,onParamUpdate}) => {
    const [checked,check] = React.useState(false)
    const changeToggle = (newStatus) => {
        let value = newStatus ? 1 : 0
        onParamUpdate(value,path)
    }
    React.useEffect(()=>{
        let checkedFromStatus = Number(status) ? true : false
        check(checkedFromStatus)
    },[status])
    return (
        <ToggleContainer>
            <ToggleKey>{title}</ToggleKey>
            <ToggleElement>
                <ToggleState checked={checked} onChange={(e) => changeToggle(e.target.checked)}/>
                <ToggleSwitch checked={checked} />
            </ToggleElement>
        </ToggleContainer>
    )
}

export default Toggle