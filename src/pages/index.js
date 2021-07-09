import * as React from "react"
import Container from "../components/container"
import Header from "../components/header"
import Footer from "../components/footer"
import TabNav from "../components/tabs"
import Selector from "../components/selector"
import Slider from "../components/slider"
import Drone from "../applets/drone"
import Scale from "../applets/scale"
import Sequencer from "../applets/sequencer"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const mainNavTabs = ['Drone', 'Scale', 'Sequencer']
const mainNavPages = [<Drone /> , <Scale />, <Sequencer />]
const selectProps = {
  key: "Key",
  default: 3,
  options: [
    {
      value: "14",
      text: "B"
    },
    {
      value: "13",
      text: "A#"
    },
    {
      value: "12",
      text: "A"
    },
    {
      value: "11",
      text: "G#"
    },
    {
      value: "10",
      text: "G"
    },
    {
      value: "9",
      text: "F#"
    },
    {
      value: "8",
      text: "F"
    },
    {
      value: "7",
      text: "E"
    },
    {
      value: "6",
      text: "D#"
    },
    {
      value: "5",
      text: "D"
    },
    {
      value: "4",
      text: "C#"
    },
    {
      value: "3",
      text: "C"
    }
  ]
}

const sliderProps = {
  key: "Offset",
  init: 0,
  max: 100,
  min: -100,
  step: 1
}

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
    <p><strong>Common Parameters</strong></p>
    <br />
    <Selector params={selectProps}></Selector>
    <Slider params={sliderProps}></Slider>
    <br />
    <TabNav tablist={mainNavTabs} pagelist={mainNavPages}></TabNav>
    <Footer>
      <p>Developed by <a href="https://www.sadharani.com">Sadharani</a></p>
    </Footer>
  </Container>
)

export default IndexPage
