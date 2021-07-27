import * as React from "react"
import DefaultLayout from "../layouts/default-layout"
import MusicRoom from "../applets/musicroom"

const IndexPage = () => {
  return (
    <DefaultLayout title='PureTones Music Room'>
      <MusicRoom />      
    </DefaultLayout>
  )
}

export default IndexPage
