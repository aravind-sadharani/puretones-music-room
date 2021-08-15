import * as React from "react"
import { Helmet } from "react-helmet"

const IncludeFaust = () => (
    <Helmet>
        <script src="/Faustlib/index.min.js" type="text/javascript"></script>
        <script src="/Faustlib/puretones-comb.min.js" type="text/javascript"></script>
        <script src="/Faustlib/musicscale.min.js" type="text/javascript"></script>
        <script src="/Faustlib/musicscale-worklet.min.js" type="text/javascript"></script>
    </Helmet>
)

export default IncludeFaust