'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/modules/common/components/button'
import { DropdownMenuItem } from '@/modules/common/components/dropdown-menu/dropdown-menu'
import { SELECT_COLUMN } from '@/utils/constants/columns'
import { Usuario } from '@prisma/client'
import Link from 'next/link'
import ProtectedTableActions from '@/modules/common/components/table-actions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { updateUserState } from './lib/actions/users'

export const columns: ColumnDef<Usuario>[] = [
  SELECT_COLUMN,
  {
    accessorKey: 'id',
    header: 'ID',
  },

  {
    accessorKey: 'nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Correo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'estado',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Estado
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const { estado } = row.original
      const COLORS = {
        Activo: 'bg-green-500',

        Bloqueado: 'bg-red-500',
      }
      return (
        <div className="w-32 flex gap-2 items-center">
          <div
            //@ts-ignore
            className={` rounded-full w-2 h-2 ${COLORS[estado || 'Activo']}`}
          />{' '}
          {estado}
        </div>
      )
    },
  },
  {
    accessorKey: 'rol_nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Rol
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original
      const estado = row.original.estado
      return (
        <ProtectedTableActions
          sectionName={SECTION_NAMES.USUARIOS}
          editConfig={{
            actionName: 'Editar Rol',
            href: `/dashboard/usuarios/${user.id}`,
          }}
          deleteConfig={{
            actionName: `${estado === 'Activo' ? 'Bloquear' : 'Desbloquear'}`,
            alertTitle: `¿Estás seguro de ${
              estado === 'Activo' ? 'bloquear' : 'desbloquear'
            } a este usuario?`,
            alertDescription: `Estas a punto de ${
              estado === 'Bloqueado' ? 'bloquear' : 'desbloquear'
            } este usuario.`,
            onConfirm: () => {
              return updateUserState(
                user.id,
                `${estado === 'Activo' ? 'Bloqueado' : 'Activo'}`
              )
            },
          }}
        >
          <Link href={`/dashboard/usuarios/cambiar-contrasena/${user.id}`}>
            <DropdownMenuItem>Cambiar contraseña</DropdownMenuItem>
          </Link>
        </ProtectedTableActions>
      )
    },
  },
]
