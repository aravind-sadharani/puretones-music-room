import * as React from 'react'
import Container from 'components/container'
import Header from 'components/header'
import Footer from 'components/footer'
import PostLinks from 'components/postlinks'
import PostPreview from 'components/postpreview'
import IncludeFaust from 'services/faust'
import { AudioEnvProvider } from 'services/audioenv'
import StopStaleDSP from 'applets/stopstaledsp'
import { graphql } from 'gatsby'

const IndexLayout = ({ data, pageContext, location }) => {
    const {currentPage, numPages} = pageContext
    let prevLink = currentPage !== 1 ? { url: `/learn/${currentPage - 1 === 1 ? "" : (currentPage-1).toString()}`, title: `Page ${currentPage-1}` } : null
    let nextLink = currentPage !== numPages ? { url: `/learn/${currentPage+1}`, title: `Page ${currentPage+1}` } : null
    let postList = data.allMdx.edges.map(({node}) => (
        <PostPreview key={node.id} title={node.frontmatter.title} description={node.excerpt} url={node.fields.slug} />
    ))
    let pageTitle = currentPage !== 1 ? ` - Page ${currentPage}` : ""
    return (
      <Container>
        <IncludeFaust />
        <Header location={location} />
        <AudioEnvProvider>
          <StopStaleDSP />
        </AudioEnvProvider>
        <h2>List of Articles{pageTitle}</h2>
        {postList}
        <PostLinks prev={prevLink} next={nextLink} />
        <Footer>
          Developed by <a href="https://www.sadharani.com">Sadharani</a>
        </Footer>
      </Container>
    )
}
  
export default IndexLayout

export const indexQuery = graphql`
  query IndexQuery($skip: Int!, $limit: Int!) {
    allMdx(
        filter: {fileAbsolutePath: {regex: "/posts/"}}
        sort: { fields: [frontmatter___date, frontmatter___title], order: [ASC, ASC] }
        limit: $limit
        skip: $skip
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