/**
 * Commits table component
 * @author Niall Thurrat
 */

import React, { useMemo } from 'react'
import Table from './table.component'

const CommitsTable = props => {
  const commitsColumns = useMemo(
    () => [
      {
        Header: 'Commits for all group projects (max 20 per project just now)',
        columns: [
          {
            Header: 'commit id',
            accessor: 'id'
          },
          {
            Header: 'author',
            accessor: 'author_name'
          },
          {
            Header: 'message',
            accessor: 'message'
          },
          {
            Header: 'when',
            accessor: 'created_at'
          },
          {
            Header: 'project id',
            accessor: 'project_id'
          }
        ]
      }
    ],
    []
  )

  return (
    <div>
      {props.commits ? (
        <div>
          <div>
            <h5>Latest Commits Table</h5>
          </div>
          <div>
            <Table
              columns={commitsColumns}
              data={props.commits}
            />
            <br />
          </div>
        </div>
      ) : (
        <div>
          <br />
          <p>No commit data found...</p>
        </div>
      )}
      <br />
    </div>
  )
}

export default CommitsTable
