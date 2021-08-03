import * as React from 'react'
import styled from 'styled-components'

const TableContainer = styled.div`
    overflow-x: auto;
`

const TableElement = styled.table`
    width: calc(100% - 2px);
    margin: 0 auto 1em;
    border-style: hidden;
    box-shadow: 0 1px 0 1px #e6e6eb;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    tr:last-child td:first-child{
        border-bottom-left-radius: 5px;
    }
    tr:last-child td:last-child{
        border-bottom-right-radius: 5px;
    }
    th {
        padding: 6px 12px;
        border: 1px solid #e6e6eb;
        background-color: #e6e6eb;
    }
    tr:nth-child(even) {
        background-color: #e6e6eb;
    }
    td {
        padding: 0 12px;
        border: 1px solid #e6e6eb;
    }
`

const Table = ({children}) => (
    <TableContainer>
        <TableElement>
            {children}
        </TableElement>
    </TableContainer>
)

export default Table