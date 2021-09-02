import * as React from 'react'
import Container from 'components/container'
import Header from 'components/header'
import Footer from 'components/footer'
import IncludeFaust from 'services/faust'
import { AudioEnvProvider } from 'services/audioenv'
import { CommonSettingsEnvProvider } from 'services/commonsettings'
import DronePlayer from 'applets/droneplayer'
import MotifPlayer from 'applets/motifplayer'
import ScalePlayer from 'applets/scaleplayer'
import CommonPitch from 'applets/commonpitch'
import StopStaleDSP from 'applets/stopstaledsp'
import Caption from 'components/caption'
import Table from 'components/table'
import FigCaption from 'components/figcaption'
import Audio from 'components/audio'
import Notice from 'components/notice'
import Action from 'components/action'
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Link, graphql } from 'gatsby'
import "katex/dist/katex.min.css"

const shortcodes = { DronePlayer, MotifPlayer, ScalePlayer, CommonPitch, Notice, Caption, table: Table, FigCaption, Audio, Action }

const PostLayout = ({data: { mdx }, pageContext, location}) => {
  const {prev, next} = pageContext
  let prevLink = prev !== null ? { url: `${prev.fields.slug}`, title: `Previous ${prev.fields.slug} ${prev.frontmatter.title}` } : null
  let nextLink = next !== null ? { url: `${next.fields.slug}`, title: `Next ${next.fields.slug} ${next.frontmatter.title}` } : null
  return (
    <Container>
      <IncludeFaust />
      <Header location={location} />
      <AudioEnvProvider>
        <StopStaleDSP />
        <CommonSettingsEnvProvider>
            <MDXProvider components={shortcodes}>
                <MDXRenderer frontmatter={mdx.frontmatter}>{mdx.body}</MDXRenderer>
            </MDXProvider>
        </CommonSettingsEnvProvider>
      </AudioEnvProvider>
      {prevLink !== null && <Link to={prevLink.url}>{prevLink.title}</Link>}
      {nextLink !== null && <Link to={nextLink.url}>{nextLink.title}</Link>}
      <p></p>
      <Footer>
        Developed by <a href="https://www.sadharani.com">Sadharani</a>
      </Footer>
    </Container>
  )
}

export default PostLayout

export const postQuery = graphql`
  query PostQuery($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      id
      body
      frontmatter {
        title
      }
    }
  }
`