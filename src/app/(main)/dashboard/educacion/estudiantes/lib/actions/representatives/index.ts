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
    return { error: 'Representante no encontrado', success: false, data: null }
  }

  return {
    error: false,
    success: true,
    data: representative,
  }
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
    actionName: 'CREAR',
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
