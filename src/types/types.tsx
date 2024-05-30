import { Option } from '@/modules/common/components/multiple-selector'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { Documentos_Identidad, Genders, Prisma, Rol } from '@prisma/client'
export type RolesWithPermissionsArray = Rol & {
  permisos: Option[]
}
export type CreateRolesWithPermissions = Omit<
  Rol & { permisos: { permiso_key: string }[] },
  'id'
>
export type SideMenuItem = {
  identifier: SECTION_NAMES

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

  profession?: string | null
  work_address?: string | null
  gender: Genders
  phone_number: string
  email?: string | null
  address?: string | null
  country: string
  city: string
  state: string
  relationship: string

  id_document_type: Documentos_Identidad
  id_document_number: string
  id_document_image?: string | null

  representative_image?: string | null
}
