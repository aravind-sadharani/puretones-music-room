import * as React from "react"
import TabNav from "../components/tabs"

const scaleTabs = ['Sa', 're', 'Re', 'ga', 'Ga', 'ma', 'Ma', 'Pa', 'dha', 'Dha', 'ni', 'Ni', 'SA']
const Scale = () => (
    <>
        Scale Page
        <br />
        <br />
        <TabNav tablist={scaleTabs} pagelist={scaleTabs}></TabNav>
    </>
)

export default Scale