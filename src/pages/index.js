import * as React from "react"
import Container from "../components/container"
import Header from "../components/header"
import Footer from "../components/footer"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import IncludeFaust from "../services/faust"
import MusicRoom from "../applets/musicroom"
import { AudioEnvProvider } from "../services/audioenv"

const IndexPage = () => {

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
            PureTones Music Room
          </h1>
        </Link>
      </Header>
      <AudioEnvProvider>
        <MusicRoom />
      </AudioEnvProvider>
      <Footer>
        <p>Developed by <a href="https://www.sadharani.com">Sadharani</a></p>
      </Footer>
    </Container>
  )
}

export default IndexPage
