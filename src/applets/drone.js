import * as React from "react"
import TabNav from "../components/tabs"

const stringTabs = ['String 1', 'String 2', 'String 3', 'String 4', 'String 5', 'String 6']
const Drone = () => (
    <>
        Drone Page
        <br />
        <br />
        <TabNav tablist={stringTabs} pagelist={stringTabs}></TabNav>
    </>
)

export default Drone