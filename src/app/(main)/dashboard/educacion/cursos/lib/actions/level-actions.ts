'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Modalities, Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'

export const getAllLevels = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const levels = await prisma.level.findMany()

  return levels
}

export const getLevelById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const level = await prisma.level.findUnique({
    where: {
      id,
    },
  })

  if (!level) {
    throw new Error('Level not found')
  }
  return level
}

export const getLevelsByModality = async (modality: Modalities) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const levels = await prisma.level.findMany({
    where: {
      modalidad: modality,
    },
  })

  return levels
}

export const createLevel = async (data: Prisma.LevelCreateInput) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.CURSOS,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.level.create({
    data: {
      ...data,
      order: Number(data.order),
    },
  })

  await registerAuditAction('Se creó un nuevo nivel: ' + data.name)
  revalidatePath('/dashboard/educacion/cursos')

  return {
    error: false,
    success: 'Nivel creado exitosamente',
  }
}

export const updateLevel = async (
  data: Prisma.LevelUpdateInput,
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

  await prisma.level.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction('Se actualizó el nivel: ' + data.name)
  revalidatePath('/dashboard/educacion/cursos')

  return {
    error: false,
    success: 'Curso actualizado exitosamente',
  }
}
