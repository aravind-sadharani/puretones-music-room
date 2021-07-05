import * as React from "react"
import Container from "../components/container"
import Header from "../components/header"
import Footer from "../components/footer"
import TabNav from "../components/tabs"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const mainNavTabs = ['Drone', 'Scale', 'Sequencer']
const stringTabs = ['String 1', 'String 2', 'String 3', 'String 4', 'String 5', 'String 6']
const StringNav = () => <TabNav tablist={stringTabs} pagelist={stringTabs}></TabNav>
const scaleTabs = ['Sa', 're', 'Re', 'ga', 'Ga', 'ma', 'Ma', 'Pa', 'dha', 'Dha', 'ni', 'Ni', 'SA']
const ScaleNav = () => <TabNav tablist={scaleTabs} pagelist={scaleTabs}></TabNav>
const mainNavPages = [<StringNav /> , <ScaleNav />, 'Sequencer Page']

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
