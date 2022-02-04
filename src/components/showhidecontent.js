import * as React from "react"
import ShowHideControls from 'components/showhidecontrols'

const ShowHideContent = ({title,children}) => {
    const [visibility,setVisibility] = React.useState(false)
    return (
        <ShowHideControls title={title} visibility={visibility} onShowHide={()=>setVisibility(!visibility)} heading>
            {children}
        </ShowHideControls>
    )
}

export default ShowHideContent