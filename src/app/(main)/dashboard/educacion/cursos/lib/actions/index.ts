'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  Courses,
  Modalities,
  Prisma,
  Schedule,
  Students_Courses,
} from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
type StudentsRelation = Omit<
  Students_Courses,
  'id_course' | 'id' | 'fecha_creacion' | 'ultima_actualizacion'
>
type SchedulesRelation = Omit<Schedule, 'id' | 'course_id'>

type FormValues = Omit<
  Courses,
  'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  schedules: SchedulesRelation[]
}
export const getAllCourses = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const courses = await prisma.courses.findMany({
    include: {
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
export const getAllOnlineCourses = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const courses = await prisma.courses.findMany({
    where: {
      modality: 'Online',
    },
    include: {
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
export const getAllPresencialCourses = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const courses = await prisma.courses.findMany({
    where: {
      modality: 'Presencial',
    },
    include: {
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
export const getSchedulesByLevelAndModality = async (
  level: string,
  modality: Modalities
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const courses = await prisma.schedule.findMany({
    where: {
      course: {
        level,
        AND: {
          modality: modality,
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
      schedules: true,
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
      schedules: {
        create: data.schedules,
      },
      // students: {
      //   create: data.students,
      // },
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
      schedules: {
        deleteMany: {},
        create: data.schedules.map((schedule) => {
          return {
            day: schedule.day,
            start: schedule.start,
            end: schedule.end,
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
