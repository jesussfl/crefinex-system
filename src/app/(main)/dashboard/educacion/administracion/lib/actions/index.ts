'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { GradeFormType } from '../../components/forms/user-grade-form'
import { registerAuditAction } from '@/lib/actions/audit'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'

export const getAllCourses = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const courses = await prisma.courses.findMany({
    include: {
      level: true,

      schedules: true,
      students: {
        include: {
          student: true,
        },
      },
    },
  })

  return courses
}
export const createGradeByStudentAndEvaluation = async (
  data: GradeFormType
) => {
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
  const grade = await prisma.student_Grades.create({
    data: data,
  })
  await registerAuditAction(
    'Se registró una nueva calificación del estudiante con ID:' +
      data.id_student
  )

  revalidatePath('/dashboard/educacion/administracion')

  return {
    success: 'Grado creado exitosamente',
    error: false,
  }
}

export const updateGradeByStudentAndEvaluation = async (
  data: GradeFormType,
  id: number
) => {
  const sessionResponse = await validateUserSession()
  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.ADMINISTRACION_ACADEMICA,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }
  const grade = await prisma.student_Grades.update({
    where: {
      id,
    },
    data: data,
  })
  await registerAuditAction(
    'Se actualizó una nueva calificación del estudiante con ID:' +
      data.id_student
  )

  revalidatePath('/dashboard/educacion/administracion')

  return {
    success: 'Calificación actualizada exitosamente',
    error: false,
  }
}

export const getStudentsWithGradesByCourseId = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const grades = await prisma.student_Grades.findMany({
    where: {
      evaluation: {
        id_course: id,
      },
    },
    include: {
      student: true,
      evaluation: true,
    },
  })

  const students = await prisma.student.findMany({
    where: {
      id_current_course: id,
    },
    include: {
      grades: {
        include: {
          evaluation: true,
        },
      },
    },
  })
  return students
}
export const getAllStudentsWithGrades = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const students = await prisma.student.findMany({
    include: {
      grades: {
        include: {
          evaluation: true,
        },
      },
    },
  })
  return students
}
export const getEvaluationsByCourseId = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const evaluations = await prisma.evaluation.findMany({
    where: {
      id_course: id,
    },
  })

  return evaluations
}
export const getAllEvaluations = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const evaluations = await prisma.evaluation.findMany({})

  return evaluations
}
export const getCourseById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const course = await prisma.courses.findUnique({
    where: {
      id,
    },
    include: {
      level: true,
      schedules: true,
      evaluations: true,
      // students: {
      //   include: {
      //     student: true,
      //   },
      // },
    },
  })

  if (!course) {
    throw new Error('Course not found')
  }
  return course
}

export const getStudentsByCourseId = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const students = await prisma.student.findMany({
    where: {
      id_current_course: id,
    },
  })
  return students
}
