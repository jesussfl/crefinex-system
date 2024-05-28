'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
export const getAllRepresentatives = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const representatives = await prisma.representative.findMany()

  return representatives
}

export const getRepresentativeById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const representative = await prisma.representative.findUnique({
    where: {
      id,
    },
  })

  if (!representative) {
    throw new Error('Representante no encontrado')
  }

  return representative
}
export const getRepresentativeByIdDocument = async (id: string) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const representative = await prisma.representative.findUnique({
    where: {
      id_document_number: id,
    },
  })

  if (!representative) {
    throw new Error('Representante no encontrado')
  }

  return representative
}

export const createRepresentative = async (data: any) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.ESTUDIANTES,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.representative.create({
    data,
  })

  await registerAuditAction('Se creó un nuevo representante: ' + data.names)
  revalidatePath('/dashboard/cursos/estudiantes')

  return {
    error: false,
    success: 'Representante creado exitosamente',
  }
}

export const deleteManyRepresentatives = async (ids: number[]) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.ESTUDIANTES,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.representative.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  await registerAuditAction('Se eliminaron representantes: ' + ids)
  revalidatePath('/dashboard/cursos/estudiantes')

  return {
    error: false,
    success: 'Representantes eliminados exitosamente',
  }
}

export const deleteRepresentative = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.ESTUDIANTES,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.representative.delete({
    where: {
      id,
    },
  })

  await registerAuditAction('Se eliminó el representante: ' + id)
  revalidatePath('/dashboard/cursos/estudiantes')

  return {
    error: false,
    success: 'Representante eliminado exitosamente',
  }
}
export const updateRepresentative = async (
  data: Prisma.RepresentativeUpdateInput,
  id: number
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.CURSOS,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const representative = await prisma.representative.update({
    where: {
      id,
    },
    data,
  })

  if (!representative) {
    return {
      error: 'Parece que hubo un problema',
      success: false,
    }
  }
  await registerAuditAction(
    'Se editó el representante: ' + representative.names
  )
  revalidatePath('/dashboard/cursos/representante')

  return {
    error: false,
    success: true,
  }
}
