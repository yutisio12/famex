import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Table, Group, Button, TextInput, Text, Loader, ScrollArea, Card } from "@mantine/core"
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks'

const DataTable = forwardRef(({
  columns,
  fetchData,
  pageSize = 10
}, ref) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize,

  })

  const [sorting, setSorting] = useState([])
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 500)
  const isSmall = useMediaQuery('(max-width: 768px)')

  const loadData = async () => {
    setLoading(true)

    const sort = sorting?.length > 0 ? `${sorting[0].id},${sorting[0].desc ? "DESC" : "ASC"}` : null
    // alert(debouncedSearch)
    const res = await fetchData({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sort,
      search: debouncedSearch
    })

    setData(res.data)
    setTotal(res.total)
    setLoading(false)
  }

  // Expose loadData function to parent components via ref
  useImperativeHandle(ref, () => ({
    loadData
  }));

  useEffect(() => {
    loadData()
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    debouncedSearch
  ])

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(total / pagination.pageSize),
    state: {
      pagination,
      sorting
    },
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <>
      <Group mb="sm" position="apart">
        <TextInput
          placeholder="Search..."
          value={search}
          onChange={e => {
            setPagination({ ...pagination, pageIndex: 0 })
            setSearch(e.target.value)
          }}
        />
      </Group>

      {/* Responsive: show a horizontal scrollable table on larger screens,
          and a stacked card list on small screens */}
      {isSmall ? (
        loading ? (
          <Table>
            <tbody>
              <tr>
                <td colSpan={columns.length}>
                  <Group position="center">
                    <Loader size="sm" />
                  </Group>
                </td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <div>
            {table.getRowModel().rows.map((row) => (
              <Card withBorder mb="xs" key={row.id}>
                <div style={{ padding: 8 }}>
                  {row.getVisibleCells().filter(c => c.column.id !== 'actions').map(cell => (
                    <div key={cell.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                      <Text size="xs" color="dimmed">{cell.column.columnDef.header}</Text>
                      <Text size="sm" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Text>
                    </div>
                  ))}

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {/** render actions cell if exists **/}
                    {(() => {
                      const actionCell = row.getVisibleCells().find(c => c.column.id === 'actions')
                      return actionCell ? flexRender(actionCell.column.columnDef.cell, actionCell.getContext()) : null
                    })()}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        <ScrollArea>
          <Table striped highlightOnHover style={{ minWidth: 700 }}>
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(header => (
                    <th
                      key={header.id}
                      style={{ cursor: "pointer", textAlign: "center" }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === "asc" && " 🔼"}
                      {header.column.getIsSorted() === "desc" && " 🔽"}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length}>
                    <Group position="center">
                      <Loader size="sm" />
                    </Group>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} style={{ textAlign: "center" }}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </ScrollArea>
      )}

      <Group position="apart" mt="sm">
        <Text>
          Page {pagination.pageIndex + 1} of{" "}
          {Math.ceil(total / pagination.pageSize)}
        </Text>

        <Group>
          <Button
            size="xs"
            onClick={() => table.previousPage()}
            disabled={pagination.pageIndex === 0}
          >
            Prev
          </Button>
          <Button
            size="xs"
            onClick={() => table.nextPage()}
            disabled={(pagination.pageIndex + 1) * pagination.pageSize >= total}
          >
            Next
          </Button>
        </Group>
      </Group>
    </>
  )

});

export default DataTable;