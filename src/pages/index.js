import * as React from "react"
import Container from "../components/container"
import Header from "../components/header"
import Footer from "../components/footer"
import TabNav from "../components/tabs"
import Selector from "../components/selector"
import Slider from "../components/slider"
import Button from "../components/button"
import Drone from "../applets/drone"
import Scale from "../applets/scale"
import Sequencer from "../applets/sequencer"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import IncludeFaust from "../services/faust"

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

const composition = `import("stdfaust.lib");
process = 0.3*os.osc(220) <: dm.zita_light;`

const playStopTitle = {
  active: "Stop",
  inactive: "Play"
}

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {faust: null, audioCtx: null, playing: false}
  }

  play = (composition) => {
    let {faust, audioCtx, playing} = this.state
    audioCtx = window.audioCtx
    audioCtx = audioCtx ? audioCtx : new (window.AudioContext || window.webkitAudioContext)()
    window.audioCtx = audioCtx
    if(audioCtx.state === "suspended") {
      audioCtx.resume()
    }
    if(!playing) {
      console.log(`Getting Faust Ready...`)
      if(!faust)
        faust = new window.Faust2WebAudio.Faust({debug: false, wasmLocation: "/Faustlib/libfaust-wasm.wasm", dataLocation: "/Faustlib/libfaust-wasm.data"})
      faust.ready.then(() => {
        console.log(`Playing...`)
        faust.getNode(composition, { audioCtx, useWorklet: false, bufferSize: 16384, args: { "-I": "libraries/"} }).then(node => {
          window.node = node  
          this.setState({faust: faust, audioCtx: audioCtx, playing: true})
          node.connect(audioCtx.destination)
        }, reason => {
          console.log(composition)
          console.log(reason)
        })
      }, reason => {
        console.log(reason)
      })
    } else {
      console.log(`Stopping...`)
      let node = window.node
      node.disconnect(audioCtx.destination)
      node.destroy()
      this.setState({faust: faust, audioCtx: this.state.audioCtx, playing: false})
    }
  }

  render = () => {
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
        <p><strong>Common Parameters</strong></p>
        <br />
        <Selector params={selectProps}></Selector>
        <Slider params={sliderProps}></Slider>
        <Button stateful title={playStopTitle} onClick={() => this.play(composition)}>Play</Button>
        <br />
        <TabNav tablist={mainNavTabs} pagelist={mainNavPages}></TabNav>
        <Footer>
          <p>Developed by <a href="https://www.sadharani.com">Sadharani</a></p>
        </Footer>
      </Container>
    )
  }
}

export default IndexPage
