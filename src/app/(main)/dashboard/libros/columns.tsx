'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import { Button, buttonVariants } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'
import { Book } from '@prisma/client'
import { format } from 'date-fns'
import Link from 'next/link'
import { Progress } from '@/modules/common/components/progress-bar'
import ProtectedTableActions from '@/modules/common/components/table-actions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { deleteBook } from './lib/actions/book-actions'
import { cn } from '@/utils/utils'

export const columns: ColumnDef<Book>[] = [
  SELECT_COLUMN,
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <HeaderCell column={column} title="Título" />,
  },
  {
    accessorKey: 'synopsis',
    header: ({ column }) => <HeaderCell column={column} title="Sinopsis" />,
  },
  {
    id: 'estado',
    accesorKey: 'completion_percentage',
    header: ({ column }) => (
      <Button
        variant="ghost"
        size={'sm'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-xs"
      >
        Porcentaje de completación
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-3 w-full items-center">
          <p>{row.original.completion_percentage}%</p>
          <Progress
            className="flex-1"
            value={row.original.completion_percentage}
          />
          <p>100%</p>
        </div>
      )
    },
  },
  {
    id: 'paginas',
    accessorFn: (row) => row.page_count,

    header: ({ column }) => (
      <HeaderCell column={column} title="Número de Páginas" />
    ),
    cell: ({ row }) => {
      return <div>{row.original.page_count}</div>
    },
  },
  {
    accessorKey: 'publication_date',
    header: ({ column }) => (
      <HeaderCell column={column} title="Fecha de Publicación" />
    ),
    cell: ({ row }) => {
      return row.original.publication_date
        ? format(new Date(row.original.publication_date), 'dd/MM/yyyy')
        : 'Sin fecha de publicación'
    },
  },
  {
    id: 'precio',
    accessorFn: (row) => row.price,
    header: ({ column }) => (
      <HeaderCell column={column} title="Precio de venta" />
    ),
  },
  {
    id: 'editables',
    accessorFn: (row) => row.photoshop_files_url,
    header: ({ column }) => (
      <HeaderCell column={column} title="URL de editables" />
    ),
    cell: ({ row }) => {
      if (!row.original.photoshop_files_url)
        return <div>No hay una URL asociado</div>

      return (
        <a
          className={cn(buttonVariants({ variant: 'outline' }))}
          href={row.original.photoshop_files_url}
        >
          Ir al sitio
        </a>
      )
    },
  },
  {
    id: 'pdf',
    accessorFn: (row) => row.PDF_file_url,
    header: ({ column }) => <HeaderCell column={column} title="URL del PDF" />,
    cell: ({ row }) => {
      if (!row.original.PDF_file_url) return <div>No hay una URL asociado</div>

      return (
        <a
          className={cn(buttonVariants({ variant: 'outline' }))}
          href={row.original.PDF_file_url}
        >
          Ir al sitio
        </a>
      )
    },
  },
  {
    id: 'ilustraciones',
    accessorFn: (row) => row.illustrations_url,
    header: ({ column }) => (
      <HeaderCell column={column} title="URL de ilustraciones" />
    ),
    cell: ({ row }) => {
      if (!row.original.illustrations_url)
        return <div>No hay una URL asociado</div>

      return (
        <a
          className={cn(buttonVariants({ variant: 'outline' }))}
          href={row.original.illustrations_url}
        >
          Ir al sitio
        </a>
      )
    },
  },

  {
    id: 'acciones',

    cell: ({ row }) => {
      const data = row.original

      return (
        <ProtectedTableActions
          sectionName={SECTION_NAMES.LIBROS}
          editConfig={{
            href: `/dashboard/libros/libro/${data.id}`,
          }}
          deleteConfig={{
            alertTitle: '¿Estás seguro de eliminar este libro?',
            alertDescription: `Estas a punto de eliminar este libro y todas sus dependencias.`,
            onConfirm: () => {
              return deleteBook(data.id)
            },
          }}
        ></ProtectedTableActions>
      )
    },
  },
]

export const HeaderCell = ({ column, title }: { column: any; title: any }) => {
  return (
    <Button
      variant="ghost"
      size={'sm'}
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className="text-xs"
    >
      {title}
      <ArrowUpDown className="ml-2 h-3 w-3" />
    </Button>
  )
}
