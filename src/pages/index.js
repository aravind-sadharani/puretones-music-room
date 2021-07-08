import * as React from "react"
import Container from "../components/container"
import Header from "../components/header"
import Footer from "../components/footer"
import TabNav from "../components/tabs"
import Drone from "../applets/drone"
import Scale from "../applets/scale"
import Sequencer from "../applets/sequencer"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const mainNavTabs = ['Drone', 'Scale', 'Sequencer']
const mainNavPages = [<Drone /> , <Scale />, <Sequencer />]

const IndexPage = () => (
  <Container>
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
    <TabNav tablist={mainNavTabs} pagelist={mainNavPages}></TabNav>
    <Footer>
      <p>Developed by <a href="https://www.sadharani.com">Sadharani</a></p>
    </Footer>
  </Container>
)

export default IndexPage
