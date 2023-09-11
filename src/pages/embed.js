import * as React from 'react'
import Container from 'components/container'
import IncludeFaust from 'services/faust'
import { AudioEnvProvider } from 'services/audioenv'
import { CommonSettingsEnvProvider } from 'services/commonsettings'
import StopStaleDSP from 'applets/stopstaledsp'
import PureTonesEmbed from 'applets/puretonesembed'

const EmbedPage = ({location}) => {
  return (
    <Container>
      <IncludeFaust />
      <AudioEnvProvider>
        <StopStaleDSP />
        <CommonSettingsEnvProvider>
          <PureTonesEmbed location={location} />
        </CommonSettingsEnvProvider>
      </AudioEnvProvider>
    </Container>
  )
}

export default EmbedPage