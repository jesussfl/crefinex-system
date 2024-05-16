'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Courses, Prisma, Students_Courses } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
type StudentsRelation = Omit<
  Students_Courses,
  'id_course' | 'id' | 'fecha_creacion' | 'ultima_actualizacion'
>

type FormValues = Omit<
  Courses,
  'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  students: StudentsRelation[]
}
export const getAllCourses = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const courses = await prisma.courses.findMany({
    include: {
      students: {
        include: {
          student: true,
        },
      },
    },
  })

  return courses
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
      students: {
        include: {
          student: true,
        },
      },
    },
  })

  if (!course) {
    throw new Error('Course not found')
  }
  return course
}

export const createCourse = async (data: FormValues) => {
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

  // if (!data.students) {
  //   await prisma.courses.create({
  //     data,
  //   })
  //   await registerAuditAction('Se creó un nuevo curso: ' + data.title)
  //   revalidatePath('/dashboard/educacion/cursos')

  //   return {
  //     error: false,
  //     success: 'Curso creado exitosamente',
  //   }
  // }

  await prisma.courses.create({
    data: {
      ...data,
      students: {
        create: data.students,
      },
    },
  })

  await registerAuditAction('Se creó un nuevo curso: ' + data.title)
  revalidatePath('/dashboard/educacion/cursos')

  return {
    error: false,
    success: 'Curso creado exitosamente',
  }
}

export const updateCourse = async (data: FormValues, id: number) => {
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

  await prisma.courses.update({
    where: {
      id,
    },
    data: {
      ...data,
      students: {
        deleteMany: {},
        create: data.students.map((student) => {
          return {
            id_student: student.id_student,
          }
        }),
      },
    },
  })

  await registerAuditAction('Se actualizó el curso: ' + data.title)
  revalidatePath('/dashboard/educacion/cursos')

  return {
    error: false,
    success: 'Curso actualizado exitosamente',
  }
}
export const deleteManyCourses = async (ids: number[]) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.CURSOS,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.courses.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  await registerAuditAction('Se eliminaron cursos: ' + ids)
  revalidatePath('/dashboard/educacion/cursos')

  return {
    error: false,
    success: 'Cursos eliminados exitosamente',
  }
}
