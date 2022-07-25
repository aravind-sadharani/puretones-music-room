import * as React from 'react'
import Container from 'components/container'
import Header from 'components/header'
import Footer from 'components/footer'
import PostPreview from 'components/postpreview'
import IncludeFaust from 'services/faust'
import { AudioEnvProvider } from 'services/audioenv'
import StopStaleDSP from 'applets/stopstaledsp'
import { graphql } from 'gatsby'

const CategoryLayout = ({ data, pageContext, location }) => {
    const {category} = pageContext
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
        <h2>Articles under〝{category}〞</h2>
        {postList}
        <Footer>
          Developed by <a target="_blank" rel="nofollow noreferrer" href="https://www.sadharani.com">Sadharani</a>
        </Footer>
      </Container>
    )
}

export default CategoryLayout

export const categoryQuery = graphql`
  query CategoryQuery($category: String!) {
    allMdx(
        filter: {fileAbsolutePath: {regex: "/posts/"}, frontmatter: {category: {eq: $category}}}
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