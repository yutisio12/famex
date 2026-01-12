import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';

export default function DataTable({
  columns,
  fetchData,
  pageSize = 10
}) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize,

  })

  const [sorting, setSorting] = useState([])
  const [search, setSearch] = useState('')

  const loadData = async () => {
    setLoading(true)

    const sort = sorting.length > 0 ? `${sorting[0].id},${sorting[0].desc ? "DESC" : "ASC"}` : null

    const res = await fetchData({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sort,
      search
    })

    setData(res.data)
    setTotal(res.total)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    search
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
    <div>
      {/* Search */}
      <input
        placeholder="Search..."
        value={search}
        onChange={e => {
          setPagination({ ...pagination, pageIndex: 0 })
          setSearch(e.target.value)
        }}
        style={{ marginBottom: 10 }}
      />

      {loading && <p>Loading...</p>}

      <table border="1" cellPadding="8">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  style={{ cursor: "pointer" }}
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
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: 10 }}>
        <button
          onClick={() => table.previousPage()}
          disabled={pagination.pageIndex === 0}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {pagination.pageIndex + 1} of{" "}
          {Math.ceil(total / pagination.pageSize)}
        </span>

        <button
          onClick={() => table.nextPage()}
          disabled={(pagination.pageIndex + 1) * pagination.pageSize >= total}
        >
          Next
        </button>
      </div>
    </div>
  )

}