'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'

export const getAllEmployees = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const employees = await prisma.employee.findMany()

  return employees
}

export const getEmployeeById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const employee = await prisma.employee.findUnique({
    where: {
      id,
    },
  })

  if (!employee) {
    throw new Error('Employee not found')
  }
  return employee
}

export const createEmployee = async (data: Prisma.EmployeeCreateInput) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.PERSONAL,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.employee.create({
    data,
  })

  await registerAuditAction('Se creó un nuevo empleado: ' + data.names)
  revalidatePath('/dashboard/personal')

  return {
    error: false,
    success: 'Empleado creado exitosamente',
  }
}

export const updateEmployee = async (
  data: Prisma.EmployeeUpdateInput,
  id: number
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.PERSONAL,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.employee.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction('Se actualizó el empleado: ')
  revalidatePath('/dashboard/personal')

  return {
    error: false,
    success: 'Empleado actualizado exitosamente',
  }
}
export const deleteEmployee = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.PERSONAL,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.employee.delete({
    where: {
      id,
    },
  })

  await registerAuditAction('Se elimino el empleado: ' + id)
  revalidatePath('/dashboard/personal')

  return {
    error: false,
    success: 'Empleado eliminado exitosamente',
  }
}
