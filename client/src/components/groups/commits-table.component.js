/**
 * Commits data table component
 * @author Niall Thurrat
 */

import React from 'react'
import { useTable, useSortBy } from 'react-table'

const CommitsTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data
    },
    useSortBy
  )

  return (
    <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
      <thead>
        {headerGroups.map(headerGroup => (
          // eslint-disable-next-line
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              // eslint-disable-next-line
              <th
                {...column.getHeaderProps(
                  column.getSortByToggleProps())}
                style={{
                  border: 'solid 1px gray',
                  background: 'aliceblue',
                  color: 'black',
                  fontWeight: 'bold'
                }}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            // eslint-disable-next-line
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  // eslint-disable-next-line
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: '3px',
                      border: 'solid 1px gray',
                      background: 'papayawhip'
                    }}
                  >
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default CommitsTable
