import React from 'react'
import { Button } from '@/modules/common/components/button'
import { Input } from '@/modules/common/components/input/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/modules/common/components/dropdown-menu/dropdown-menu'
import { useToast } from '../toast/use-toast'
export default function DataTableFilters({
  table,
  isColumnFilterEnabled,
  filtering,
  setFiltering,
  deleteMethod,
  selectedRowsId,
}: {
  table: any
  isColumnFilterEnabled: boolean
  filtering: any
  setFiltering: (filtering: any) => void
  deleteMethod?: (ids: number[]) => void
  selectedRowsId: number[]
}) {
  const { toast } = useToast()
  return (
    <div className="flex flex-1 items-center py-4">
      <Input
        placeholder="Filtrar..."
        value={filtering}
        onChange={(event) => setFiltering(event.target.value)}
        // value={(table.getColumn('nombre')?.getFilterValue() as string) ?? ''}
        // onChange={(event) =>
        //   table.getColumn('nombre')?.setFilterValue(event.target.value)
        // }
        className="max-w-sm"
      />
      {isColumnFilterEnabled && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column: any) => column.getCanHide())
              .map((column: any) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {selectedRowsId?.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            deleteMethod &&
            deleteMethod(selectedRowsId).then((data) => {
              if (data?.error) {
                toast({
                  title: 'Parece que hubo un problema',
                  description: data.error,
                  variant: 'destructive',
                })

                return
              }

              if (data?.success) {
                toast({
                  title: 'Estudiantes eliminados',
                  description: 'Los estudiantes se han eliminado correctamente',
                  variant: 'success',
                })
              }
            })
          }
        >
          Eliminar
        </Button>
      )}
    </div>
  )
}
