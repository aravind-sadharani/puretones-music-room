import * as React from 'react'
import Container from '../components/container'
import Header from '../components/header'
import Footer from '../components/footer'
import IncludeFaust from '../services/faust'
import { StaticImage } from 'gatsby-plugin-image'
import { AudioEnvProvider } from '../services/audioenv'
import { Link } from 'gatsby'
import DSPPlayer from '../applets/dspplayer'
import MotifPlayer from '../applets/motifplayer'
import { MDXProvider } from "@mdx-js/react"

const shortcodes = { DSPPlayer, MotifPlayer }

const DefaultLayout = ({title,children}) => {
  return (
    <Container>
        <IncludeFaust />
        <Header>
        <Link to="/">
          <h1>
            <StaticImage
              src="../images/puretones-logo.svg"
              alt="PureTones Logo">
            </StaticImage>
            {title || 'PureTones'}
          </h1>
        </Link>
      </Header>
      <AudioEnvProvider>
        <MDXProvider components={shortcodes}>
          {children}
        </MDXProvider>
      </AudioEnvProvider>
      <Footer>
        Developed by <a href="https://www.sadharani.com">Sadharani</a>
      </Footer>
    </Container>
  )
}

export default DefaultLayout