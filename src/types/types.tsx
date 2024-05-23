import { Option } from '@/modules/common/components/multiple-selector'
import { Documentos_Identidad, Genders, Prisma, Rol } from '@prisma/client'
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

export type RepresentativeFormType = {
  names: string
  lastNames: string
  birthDate: Date

  profession?: string
  gender: Genders
  phone_number: string
  email?: string
  address: string
  country: string
  city: string
  state: string
  id_document_type: Documentos_Identidad
  id_document_number: string
  id_document_image?: string
}
