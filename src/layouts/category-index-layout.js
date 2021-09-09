import * as React from 'react'
import Container from 'components/container'
import Header from 'components/header'
import Footer from 'components/footer'
import Action from 'components/action'
import IncludeFaust from 'services/faust'
import { AudioEnvProvider } from 'services/audioenv'
import StopStaleDSP from 'applets/stopstaledsp'
import { Link } from 'gatsby'

const CategoryIndexLayout = ({ pageContext, location }) => {
    const {categories} = pageContext
    let categoryList = categories.map((category, index) => {
        const {fieldValue, totalCount} = category
        const categoryPath = fieldValue.replace(/ /g, '_').replace(/\//g,'by')
        return(
            <Action key={index}>
                <Link to={`/learn/categories/${categoryPath}/`}>{`${fieldValue} (${totalCount})`}</Link>
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
        <h2>Posts by Category</h2>
        <p>{categoryList}</p>
        <Footer>
          Developed by <a href="https://www.sadharani.com">Sadharani</a>
        </Footer>
      </Container>
    )
}

export default CategoryIndexLayout