import * as React from 'react'
import Container from 'components/container'
import Header from 'components/header'
import Footer from 'components/footer'
import Action from 'components/action'
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
            <Action key={index}>
                <Link to={`/learn/tags/${tagPath}/`}>{`${fieldValue} (${totalCount})`}</Link>
            </Action>
        )
    })
    return (
        <Container>
        <IncludeFaust />
        <Header location={location} />
        <AudioEnvProvider>
          <StopStaleDSP />
        </AudioEnvProvider>
        <h2>Posts by Tag</h2>
        <p>{tagList}</p>
        <Footer>
          Developed by <a href="https://www.sadharani.com">Sadharani</a>
        </Footer>
      </Container>
    )
}

export default TagIndexLayout