'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  RowSelectionState,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/modules/common/components/table/table'
import { DataTable } from './data-table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isColumnFilterEnabled?: boolean
  selectedData?: any
  setSelectedData?: (data: any) => void
  onSelectedRowsChange?: (lastSelectedRow: any) => void
}

export function DataTableV2<TData extends { id: any }, TValue>({
  columns: tableColumns,
  data: tableData,
  isColumnFilterEnabled = true,
  onSelectedRowsChange,
  selectedData,
  setSelectedData,
}: DataTableProps<TData, TValue>) {
  const [selectedItems, setSelectedItems] = useState<{
    [key: number]: boolean
  }>({})
  const [selectedRows, setSelectedRows] = useState<TData[]>([])

  const handleTableSelect = useCallback((lastSelectedRow: any) => {
    if (lastSelectedRow) {
      setSelectedRows((prev) => {
        if (prev.find((row) => row.id === lastSelectedRow.id)) {
          return prev.filter((item) => item.id !== lastSelectedRow.id)
        } else {
          return [...prev, lastSelectedRow]
        }
      })
    }
  }, [])

  console.log(selectedRows, 'SELECTED ROWS')

  return (
    <DataTable
      data={tableData}
      columns={tableColumns}
      isColumnFilterEnabled={isColumnFilterEnabled}
      onSelectedRowsChange={
        onSelectedRowsChange ? onSelectedRowsChange : handleTableSelect
      }
      selectedData={selectedData ? selectedData : selectedItems}
      setSelectedData={setSelectedData ? setSelectedData : setSelectedItems}
    />
  )
}
