'use server'
import { registerAuditAction } from '@/lib/actions/audit'
import { prisma } from '@/lib/prisma'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { Evaluation } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const createEvaluation = async (data: Evaluation) => {
  const sessionResponse = await validateUserSession()
  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.ADMINISTRACION_ACADEMICA,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }
  const evaluation = await prisma.evaluation.create({
    data: data,
  })
  await registerAuditAction('Se agregó una nueva evaluación al curso:')

  revalidatePath('/dashboard/educacion/administracion')

  return {
    success: 'Evaluación creada exitosamente',
    error: false,
  }
}

export const deleteEvaluation = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.ADMINISTRACION_ACADEMICA,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.evaluation.delete({
    where: {
      id,
    },
  })

  await registerAuditAction('Se elimino la evaluacion: ' + id)
  revalidatePath('/dashboard/cursos/estudiantes')

  return {
    error: false,
    success: 'Evaluacion eliminado exitosamente',
  }
}
