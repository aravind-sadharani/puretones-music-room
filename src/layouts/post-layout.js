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
import Tag from 'components/tag'
import PostLinks from 'components/postlinks'
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { graphql, Link } from 'gatsby'
import "katex/dist/katex.min.css"

const shortcodes = { DronePlayer, MotifPlayer, ScalePlayer, CommonPitch, Notice, Caption, table: Table, FigCaption, Audio, Tag }

const PostLayout = ({data: { mdx }, pageContext, location}) => {
  const {prev, next} = pageContext
  let prevLink = prev !== null ? { url: `${prev.fields.slug}`, title: `${prev.frontmatter.title}` } : null
  let nextLink = next !== null ? { url: `${next.fields.slug}`, title: `${next.frontmatter.title}` } : null
  let tagList = mdx.frontmatter.tags.map((tag,index) => {
    const tagPath = tag.replace(/ /g, '_').replace(/\//g,'by')
    return (
      <Tag key={index}><Link to={`/learn/tags/${tagPath}`}>{tag}</Link></Tag>
    )
  })
  return (
    <Container>
      <IncludeFaust />
      <Header location={location} />
      <AudioEnvProvider>
        <StopStaleDSP />
        <CommonSettingsEnvProvider>
            <MDXProvider components={shortcodes}>
                <h1>{mdx.frontmatter.title}</h1>
                <MDXRenderer frontmatter={mdx.frontmatter}>{mdx.body}</MDXRenderer>
            </MDXProvider>
        </CommonSettingsEnvProvider>
      </AudioEnvProvider>
      <h2>Category and Tags</h2>
      <p>
        <Tag><Link to={`/learn/categories/${mdx.frontmatter.category.replace(/ /g, '_').replace(/\//g,'by')}`}>{mdx.frontmatter.category}</Link></Tag>
        {tagList}
      </p>
      <PostLinks prev={prevLink} next={nextLink} />
      <Footer>
        Developed by <a target="_blank" rel="nofollow noreferrer" href="https://www.sadharani.com">Sadharani</a>
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
        tags
        category
      }
    }
  }
`