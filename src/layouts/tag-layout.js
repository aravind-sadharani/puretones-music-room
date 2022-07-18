import * as React from 'react'
import Container from 'components/container'
import Header from 'components/header'
import Footer from 'components/footer'
import PostPreview from 'components/postpreview'
import IncludeFaust from 'services/faust'
import { AudioEnvProvider } from 'services/audioenv'
import StopStaleDSP from 'applets/stopstaledsp'
import { graphql } from 'gatsby'

const TagLayout = ({ data, pageContext, location }) => {
    const {tag} = pageContext
    let postList = data.allMdx.edges.map(({node}) => (
      <PostPreview key={node.id} title={node.frontmatter.title} description={node.excerpt} url={node.fields.slug} />
    ))
    return (
        <Container>
        <IncludeFaust />
        <Header location={location} />
        <AudioEnvProvider>
          <StopStaleDSP />
        </AudioEnvProvider>
        <h2>Articles tagged〝{tag}〞</h2>
        {postList}
        <Footer>
          Developed by <a target="_blank" rel="nofollow" href="https://www.sadharani.com">Sadharani</a>
        </Footer>
      </Container>
    )
}

export default TagLayout

export const tagQuery = graphql`
  query TagQuery($tag: [String]) {
    allMdx(
        filter: {fileAbsolutePath: {regex: "/posts/"}, frontmatter: {tags: {in: $tag}}}
        sort: { fields: [frontmatter___date, frontmatter___title], order: [ASC, ASC] }
    ) {
        edges {
            node {
                id
                excerpt(pruneLength: 200)
                frontmatter {
                    title
                    date
                }
                fields {
                    slug
                }
            }
        }
    }
  }
`