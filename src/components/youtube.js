import * as React from 'react'
import styled from 'styled-components'

const VideoContainer = styled.div`
  padding-bottom: 56.25%;
  position: relative;
  height: 0px;
  overflow: hidden;
  border-radius: 5px;
  iframe {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
  }
`

const Thumbnail = styled.img`
   width: 100%;
   position: absolute;
   top: -16.67%;
   left: 0;
   cursor: pointer;
 `

const YouTube = ({videoid, starttime, endtime}) => {
    const [showThumb,setThumbState] = React.useState(true)
    const hideThumb = () => setThumbState(false)
    const srcParams = () => {
        if(starttime && endtime)
            return `?start=${starttime}&end=${endtime}`
        else if(starttime && !endtime)
            return `?start=${starttime}`
        else if(!starttime && endtime)
            return `?end=${endtime}`
        else
            return ``
    }
    return (
      <VideoContainer>
      <iframe
        title={videoid}
        frameBorder="0"
        allowFullScreen=""
        src={`https://www.youtube.com/embed/${videoid}${srcParams()};rel=0`}
        onLoad={hideThumb}
      />
      { showThumb ?
        <Thumbnail alt="" src={`https://img.youtube.com/vi/${videoid}/hqdefault.jpg`} />
        : null
      }
     </VideoContainer>
    )
}

export default YouTube