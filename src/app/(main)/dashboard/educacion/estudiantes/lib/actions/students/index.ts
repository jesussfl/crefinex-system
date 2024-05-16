'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma, Student_Status } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
export const getAllStudents = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const brands = await prisma.student.findMany()

  return brands
}
export const getStudentsByCourse = async (id_course: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const students = await prisma.students_Courses.findMany({
    where: {
      id_course,
    },
    include: {
      student: true,
    },
  })

  return students
}
export const getStudentById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const student = await prisma.student.findUnique({
    where: {
      id,
    },
  })

  if (!student) {
    throw new Error('Estudiante no encontrado')
  }

  return student
}
export const getStudentByIdDocument = async (id: string) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const student = await prisma.student.findUnique({
    where: {
      id_document_number: id,
    },
    include: {
      representative: true,
    },
  })

  if (!student) {
    throw new Error('Estudiante no encontrado')
  }

  return student
}
export const createStudent = async (data: Prisma.StudentCreateInput) => {
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

  await prisma.student.create({
    data,
  })

  await registerAuditAction('Se creó un nuevo estudiante: ' + data.names)
  revalidatePath('/dashboard/cursos/estudiantes')

  return {
    error: false,
    success: 'Estudiante creado exitosamente',
  }
}
export const updateStudent = async (
  data: Prisma.StudentUpdateInput,
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

  const student = await prisma.student.update({
    where: {
      id,
    },
    data,
  })

  if (!student) {
    return {
      error: 'Parece que hubo un problema',
      success: false,
    }
  }
  await registerAuditAction('Se editó el estudiante: ' + student.names)
  revalidatePath('/dashboard/cursos/estudiantes')

  return {
    error: false,
    success: true,
  }
}
export const updateManyStudents = async (
  data: Prisma.StudentUpdateInput,
  ids: number[]
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

  const students = await prisma.student.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data,
  })

  if (!students) {
    return {
      error: 'Parece que hubo un problema',
      success: false,
    }
  }

  await registerAuditAction('Se editaron los estudiantes: ' + ids)
  revalidatePath('/dashboard/cursos/estudiantes')

  return {
    error: false,
    success: true,
  }
}
export const updateManyStudentStatusByCourse = async (
  status: Student_Status,
  ids: number[],
  id_course: number
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

  const students = await prisma.students_Courses.updateMany({
    where: {
      id_course,
      AND: {
        id_student: {
          in: ids,
        },
      },
    },
    data: {
      status: status,
    },
  })
  if (!students) {
    return {
      error: 'Parece que hubo un problema',
      success: false,
    }
  }

  await registerAuditAction('Se editaron los estudiantes: ' + ids)
  revalidatePath(
    '/dashboard/educacion/cursos/curso/' + id_course + '/estudiantes'
  )

  return {
    error: false,
    success: true,
  }
}
export const deleteManyStudents = async (ids: number[]) => {
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

  await prisma.student.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  await registerAuditAction('Se eliminaron estudiantes: ' + ids)
  revalidatePath('/dashboard/cursos/estudiantes')

  return {
    error: false,
    success: 'Estudiantes eliminados exitosamente',
  }
}
