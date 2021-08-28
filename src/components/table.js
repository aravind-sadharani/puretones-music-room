import * as React from 'react'
import styled from 'styled-components'

const TableContainer = styled.div`
    overflow-x: auto;
    border: 1px solid;
    border-color: ${({theme}) => theme.light.borderColor};
    ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    margin: 0 0 1em 0;
`

const TableElement = styled.table`
    width: 100%;
    margin: 0 auto;
    border-style: hidden;
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
        border: 1px solid;
        border-color: ${({theme}) => theme.light.borderColor};
        ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
        background-color: ${({theme}) => theme.light.borderColor};
        ${({theme}) => theme.isDark`background-color: ${theme.dark.borderColor};`}
    }
    tr:nth-child(even) {
        background-color: ${({theme}) => theme.light.borderColor};
        ${({theme}) => theme.isDark`background-color: ${theme.dark.borderColor};`}
    }
    td {
        padding: 0 12px;
        border: 1px solid;
        border-color: ${({theme}) => theme.light.borderColor};
        ${({theme}) => theme.isDark`border-color: ${theme.dark.borderColor};`}
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