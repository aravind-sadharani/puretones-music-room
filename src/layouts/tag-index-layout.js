import * as React from 'react'
import Container from 'components/container'
import Header from 'components/header'
import Footer from 'components/footer'
import Tag from 'components/tag'
import IncludeFaust from 'services/faust'
import { AudioEnvProvider } from 'services/audioenv'
import StopStaleDSP from 'applets/stopstaledsp'
import { Link } from 'gatsby'

const TagIndexLayout = ({ pageContext, location }) => {
    const {tags} = pageContext
    let tagList = tags.map((tag, index) => {
        const {fieldValue, totalCount} = tag
        const tagPath = fieldValue.replace(/ /g, '_').replace(/\//g,'by')
        return(
            <Tag key={index}>
                <Link to={`/learn/tags/${tagPath}/`}>{`${fieldValue} (${totalCount})`}</Link>
            </Tag>
        )
    })
    return (
        <Container>
        <IncludeFaust />
        <Header location={location} />
        <AudioEnvProvider>
          <StopStaleDSP />
        </AudioEnvProvider>
        <h2>Articles by Tag</h2>
        <p>{tagList}</p>
        <Footer>
          Developed by <a target="_blank" rel="nofollow" href="https://www.sadharani.com">Sadharani</a>
        </Footer>
      </Container>
    )
}

export default TagIndexLayout