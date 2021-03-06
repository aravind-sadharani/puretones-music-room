import * as React from 'react'
import Container from 'components/container'
import Header from 'components/header'
import Footer from 'components/footer'
import PostLinks from 'components/postlinks'
import PostPreview from 'components/postpreview'
import Tag from 'components/tag'
import IncludeFaust from 'services/faust'
import { AudioEnvProvider } from 'services/audioenv'
import StopStaleDSP from 'applets/stopstaledsp'
import { graphql, Link } from 'gatsby'

const IndexLayout = ({ data, pageContext, location }) => {
    const {currentPage, numPages} = pageContext
    let prevLink = currentPage !== 1 ? { url: `/learn/${currentPage - 1 === 1 ? "" : (currentPage-1).toString()}`, title: `Page ${currentPage-1}` } : null
    let nextLink = currentPage !== numPages ? { url: `/learn/${currentPage+1}`, title: `Page ${currentPage+1}` } : null
    let postList = data.allMdx.edges.map(({node}) => (
        <PostPreview key={node.id} title={node.frontmatter.title} description={node.excerpt} url={node.fields.slug} />
    ))
    let pageTitle = currentPage !== 1 ? ` - Page ${currentPage}` : ""
    const FirstPageContent = () => (
      <>
        <h2>Learn about Indian Classical Music</h2>
        <p>The best way to learn Indian Classical music is under the tutelage of a music teacher whose artistry and understanding you admire and trust. Our aim in providing these articles is to help increase awareness around many aspects of Indian Classical music about which clear and precise information may be hard to find. We have written these articles in a style we feel would be suitable for a wide audience with varying levels of skill and knowledge about Indian music.</p>
        <p>Indian Classical music has a very long history and can be said to have started from around 1200 BCE with the singing of passages from Sama Veda. Since then Indian Classical music has evolved and gone through significant developments on its way to its present day form. Through in-depth articles with a variety of samples and musical demonstrations, we have attempted to shed some light on Indian Ragas, Tuning Systems and other aspects relating to Indian Classical Music.</p>
        <p>You can browse the articles by Category or Tag to find a topic of your interest. Or you can read the articles sequentially. All these articles feature samples and demonstrations which have been created using the PureTones <Link to="/app/">App</Link>.</p>
        <h2>Browse by Category or Tag</h2>
        <p>
          <Tag><Link to='/learn/categories'>Categories</Link></Tag>
          <Tag><Link to='/learn/tags'>Tags</Link></Tag>
        </p>
      </>
    )
    return (
      <Container>
        <IncludeFaust />
        <Header location={location} />
        <AudioEnvProvider>
          <StopStaleDSP />
        </AudioEnvProvider>
        {currentPage === 1 && <FirstPageContent />}
        <h2>List of Articles{pageTitle}</h2>
        {postList}
        <PostLinks prev={prevLink} next={nextLink} />
        <Footer>
          Developed by <a target="_blank" rel="nofollow noreferrer" href="https://www.sadharani.com">Sadharani</a>
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