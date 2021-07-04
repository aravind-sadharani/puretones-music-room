import * as React from "react"
import Container from "../components/container"
import Header from "../components/header"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

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
    <p>Hello World!</p>
  </Container>
)

export default IndexPage
