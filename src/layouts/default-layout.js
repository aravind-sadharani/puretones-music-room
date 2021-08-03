import * as React from 'react'
import Container from 'components/container'
import Header from 'components/header'
import Footer from 'components/footer'
import IncludeFaust from 'services/faust'
import { AudioEnvProvider } from 'services/audioenv'
import { CommonSettingsEnvProvider } from 'services/commonsettings'
import { Link } from 'gatsby'
import DronePlayer from 'applets/droneplayer'
import MotifPlayer from 'applets/motifplayer'
import CommonPitch from 'applets/commonpitch'
import { MDXProvider } from "@mdx-js/react"
import pureTonesLogo from 'images/puretones-logo.svg'

const shortcodes = { DronePlayer, MotifPlayer, CommonPitch }

const DefaultLayout = ({title,children}) => {
  return (
    <Container>
      <IncludeFaust />
      <Header>
        <Link to="/">
          <h1>
            <img
              src={pureTonesLogo}
              alt="PureTones Logo">
            </img>
            {title || 'PureTones'}
          </h1>
        </Link>
      </Header>
      <AudioEnvProvider>
        <CommonSettingsEnvProvider>
          <MDXProvider components={shortcodes}>
            {children}
          </MDXProvider>
        </CommonSettingsEnvProvider>
      </AudioEnvProvider>
      <Footer>
        Developed by <a href="https://www.sadharani.com">Sadharani</a>
      </Footer>
    </Container>
  )
}

export default DefaultLayout