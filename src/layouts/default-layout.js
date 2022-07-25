import * as React from 'react'
import Container from 'components/container'
import Header from 'components/header'
import Footer from 'components/footer'
import IncludeFaust from 'services/faust'
import { AudioEnvProvider } from 'services/audioenv'
import { CommonSettingsEnvProvider } from 'services/commonsettings'
import DronePlayer from 'applets/droneplayer'
import MotifPlayer from 'applets/motifplayer'
import ScalePlayer from 'applets/scaleplayer'
import CommonPitch from 'applets/commonpitch'
import StopStaleDSP from 'applets/stopstaledsp'
import Caption from 'components/caption'
import Table from 'components/table'
import FigCaption from 'components/figcaption'
import Audio from 'components/audio'
import Notice from 'components/notice'
import Action from 'components/action'
import { MDXProvider } from "@mdx-js/react"
import "katex/dist/katex.min.css"

const shortcodes = { DronePlayer, MotifPlayer, ScalePlayer, CommonPitch, Notice, Caption, table: Table, FigCaption, Audio, Action }

const DefaultLayout = ({children,location}) => {
  return (
    <Container>
      <IncludeFaust />
      <Header location={location} />
      <AudioEnvProvider>
        <StopStaleDSP />
        <CommonSettingsEnvProvider>
          <MDXProvider components={shortcodes}>
            {children}
          </MDXProvider>
        </CommonSettingsEnvProvider>
      </AudioEnvProvider>
      <Footer>
        Developed by <a target="_blank" rel="nofollow noreferrer" href="https://www.sadharani.com">Sadharani</a>
      </Footer>
    </Container>
  )
}

export default DefaultLayout