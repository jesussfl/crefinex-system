'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import { Button, buttonVariants } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'
import { Prisma } from '@prisma/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/modules/common/components/dropdown-menu/dropdown-menu'
import { format } from 'date-fns'
import Link from 'next/link'
import { cn } from '@/utils/utils'
import ProtectedTableActions from '@/modules/common/components/table-actions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { deleteCourse } from './lib/actions'
type CoursesType = Prisma.CoursesGetPayload<{
  include: {
    level: true
    schedules: true
    students: {
      include: {
        student: true
      }
    }
  }
}>
export const columns: ColumnDef<CoursesType>[] = [
  SELECT_COLUMN,
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Título
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Descripción
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    id: 'nivel',
    accessorFn: (row) => {
      return `Nivel ${row.level.order} - ${row.level.name}`
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nivel
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'start_date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Fecha de inicio
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return row.original.start_date
        ? format(new Date(row.original.start_date), 'dd/MM/yyyy')
        : 'Sin fecha de inicio'
    },
  },
  {
    accessorKey: 'end_date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Fecha de culminación
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return row.original.end_date
        ? format(new Date(row.original.end_date), 'dd/MM/yyyy')
        : 'Sin fecha de culminación'
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Precio
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    id: 'Horarios',
    accessorFn: (row) => {
      const labels = row.schedules.map((schedule) => {
        return `${schedule.day} (${schedule.start} - ${schedule.end})`
      })

      return labels.join(', ')
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Horarios
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'students',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Estudiantes
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = row.original
      return (
        <Link
          href={`/dashboard/educacion/cursos/curso/${data.id}/estudiantes`}
          className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
        >
          Ver estudiantes
        </Link>
      )
    },
  },
  {
    id: 'acciones',
    cell: ({ row }) => {
      const data = row.original

      return (
        <ProtectedTableActions
          sectionName={SECTION_NAMES.CURSOS}
          editConfig={{
            href: `/dashboard/educacion/cursos/curso/${data.id}`,
          }}
          deleteConfig={{
            alertTitle: '¿Estás seguro de eliminar este curso?',
            alertDescription: `Estas a punto de eliminar este curso y todas sus dependencias.`,
            onConfirm: () => {
              return deleteCourse(data.id)
            },
          }}
        >
          <Link
            href={`/dashboard/educacion/estudiantes/exportar/${String(
              data.id
            )}`}
          >
            <DropdownMenuItem>Exportar</DropdownMenuItem>
          </Link>
          {/* <Link
            href={`/dashboard/abastecimiento/recepciones/exportar/${String(
              data.id
            )}`}
          >
            <DropdownMenuItem>Exportar</DropdownMenuItem>
          </Link> */}
        </ProtectedTableActions>
      )
    },
  },
]
