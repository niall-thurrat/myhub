import React, { useMemo } from 'react'
import Table from './table.component'

const ReleasesTable = props => {
  const releasesColumns = useMemo(
    () => [
      {
        Header: 'releases for all group projects (max 20 per project just now)',
        columns: [
          {
            Header: 'tag',
            accessor: 'tag_name'
          },
          {
            Header: 'name',
            accessor: 'name'
          },
          {
            Header: 'description',
            accessor: 'description'
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
      {props.releases ? (
        <div>
          <div>
            <h5>Latest Releases Table</h5>
          </div>
          <div>
            <Table
              columns={releasesColumns}
              data={props.releases}
            />
            <br />
          </div>
        </div>
      ) : (
        <div>
          <br />
          <p>No release data found...</p>
        </div>
      )}
      <br />
    </div>
  )
}

export default ReleasesTable
