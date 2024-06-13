'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/modules/common/components/button'

import { Student } from '@prisma/client'
import { getAge } from '@/utils/helpers/get-age'

export const SelectedStudentsColumns: ColumnDef<Student>[] = [
  //   SELECT_COLUMN,
  {
    accessorKey: 'id',
    header: 'ID',
  },

  {
    id: 'fullName',
    accessorFn: (row) => `${row.names} ${row.lastNames}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre Completo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    id: 'age',
    accessorFn: (row) => {
      if (!row.birthDate) return 'Sin fecha de nacimiento'
      return getAge(new Date(row.birthDate))
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Edad
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    id: 'id_document_number',
    accessorFn: (row) => `${row.id_document_type}-${row.id_document_number}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Documento de identidad
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Sexo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
]
