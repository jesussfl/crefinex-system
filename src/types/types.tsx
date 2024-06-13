import { Option } from '@/modules/common/components/multiple-selector'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import {
  Documentos_Identidad,
  Genders,
  Modalities,
  Prisma,
  Rol,
  Student_Status,
} from '@prisma/client'
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
export type StudentFormType = {
  names: string
  lastNames: string
  birthDate: Date | null
  current_status: Student_Status
  liveWith?: string | null
  degree?: string | null
  id_current_course: number
  current_schedules: Option[]
  modalidad: Modalities
  gender: Genders

  phone_number?: string | null
  email?: string | null

  address?: string | null
  country: string
  city: string
  state: string
  level_id: number
  extracurricular_activities?: string | null

  id_document_type: Documentos_Identidad
  id_document_number?: string | null
  id_document_image?: string | null
  student_image?: string | null

  id_main_representative?: string | null

  secondary_representative: {
    names: string
    last_names: string
    id_document_type: Documentos_Identidad
    id_document_number: string
    relationship: string
    phone_number: string
  }
  emergency_representative: {
    names: string
    last_names: string
    id_document_type: Documentos_Identidad
    id_document_number: string
    relationship: string
    phone_number: string
  }

  representatives: RepresentativeFormType[]

  school?: string | null
  birth_place?: string | null
  can_medicate: boolean
  medicine?: string | null
}
export type RepresentativeFormType = {
  names: string
  lastNames: string
  birthDate: Date | null

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
  civil_status: string
  work_position?: string | null
  is_working: boolean

  facebook?: string | null
  instagram?: string | null
  tiktok?: string | null
  youtube?: string | null

  id_document_type: Documentos_Identidad
  id_document_number: string
  id_document_image?: string | null

  representative_image?: string | null
}

export type StudentWithGrades = Prisma.StudentGetPayload<{
  include: {
    grades: {
      include: {
        evaluation: true
      }
    }
  }
}>
