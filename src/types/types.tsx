import { Option } from '@/modules/common/components/multiple-selector'
import { Prisma, Rol } from '@prisma/client'
export type RolesWithPermissionsArray = Rol & {
  permisos: Option[]
}
export type CreateRolesWithPermissions = Omit<
  Rol & { permisos: { permiso_key: string }[] },
  'id'
>
export type SideMenuItem = {
  title: string
  path: string
  icon?: any
  submenu?: boolean
  submenuItems?: SideMenuItem[]
  requiredPermissions?: string[]
}

export type CheckboxDataType = {
  id: number
  label: string
}

export type ComboboxData = {
  value: number
  label: string
}

export type CourseColumns = {
  title: string
}
