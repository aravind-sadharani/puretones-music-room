import * as React from 'react'
import Container from 'components/container'
import Header from 'components/header'
import Footer from 'components/footer'
import IncludeFaust from 'services/faust'
import { AudioEnvProvider } from 'services/audioenv'
import StopStaleDSP from 'applets/stopstaledsp'
import { Link, graphql } from 'gatsby'

const IndexLayout = ({ data, pageContext, location }) => {
    const {currentPage, numPages} = pageContext
    let prevLink = currentPage !== 1 ? { url: `/learn/${currentPage - 1 === 1 ? "" : (currentPage-1).toString()}`, title: `Page ${currentPage-1}` } : null
    let nextLink = currentPage !== numPages ? { url: `/learn/${currentPage+1}`, title: `Page ${currentPage+1}` } : null
    let postList = data.allMdx.edges.map(({node}) => (
        <li key={node.id} >
            <Link to={node.fields.slug}>
                <h3>{node.fields.slug} {node.frontmatter.title}</h3>
            </Link>
        </li>
    ))
    return (
      <Container>
        <IncludeFaust />
        <Header location={location} />
        <AudioEnvProvider>
          <StopStaleDSP />
        </AudioEnvProvider>
        <h2>List of Articles</h2>
        <ul>
            {postList}
        </ul>
        {prevLink !== null && <Link to={prevLink.url}>{prevLink.title}</Link>}
        {nextLink !== null && <Link to={nextLink.url}>{nextLink.title}</Link>}
        <p></p>
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
        limit: $limit
        skip: $skip
    ) {
        edges {
            node {
                id
                frontmatter {
                    title
                }
                fields {
                    slug
                }
            }
        }
    }
  }
`