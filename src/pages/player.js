import * as React from 'react'
import Container from 'components/container'
import Header from 'components/header'
import Footer from 'components/footer'
import IncludeFaust from 'services/faust'
import { AudioEnvProvider } from 'services/audioenv'
import { CommonSettingsEnvProvider } from 'services/commonsettings'
import StopStaleDSP from 'applets/stopstaledsp'
import PureTonesEmbed from 'applets/puretonesembed'

const PlayerPage = ({location}) => {
  return (
    <Container>
      <IncludeFaust />
      <Header location={location} />
      <AudioEnvProvider>
        <StopStaleDSP />
        <CommonSettingsEnvProvider>
          <PureTonesEmbed location={location} />
        </CommonSettingsEnvProvider>
      </AudioEnvProvider>
      <Footer>
        Developed by <a target="_blank" rel="nofollow noreferrer" href="https://www.sadharani.com">Sadharani</a>
      </Footer>
    </Container>
  )
}

export default PlayerPage