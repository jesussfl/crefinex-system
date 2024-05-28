'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma, Student_Status } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
import { StudentFormType } from '../../../components/forms/students-form'
import { auth } from '@/auth'
import { getAge } from '@/utils/helpers/get-age'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const getAllStudents = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const students = await prisma.student.findMany({
    include: {
      representative: true,
      current_course: {
        include: {
          schedules: true,
        },
      },
    },
  })

  return students
}
export const getAllOnlineStudents = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const onlineStudents = await prisma.student.findMany({
    where: {
      modalidad: 'Online',
    },
    include: {
      representative: true,
      current_course: {
        include: {
          schedules: true,
        },
      },
    },
  })

  return onlineStudents
}
export const getAllPresencialStudents = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const presencialStudents = await prisma.student.findMany({
    where: {
      modalidad: 'Presencial',
    },
    include: {
      representative: true,
      current_course: {
        include: {
          schedules: true,
        },
      },
    },
  })

  return presencialStudents
}

export const getAllSchedulesByCourseId = async (course_id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const schedules = await prisma.schedule.findMany({
    where: {
      course_id,
    },
  })

  return schedules
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
export const getStudentById = async (id: number): Promise<StudentFormType> => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const student = await prisma.student.findUnique({
    where: {
      id,
    },
    select: {
      names: true,
      lastNames: true,
      id_document_type: true,
      id_document_number: true,
      current_status: true,
      modalidad: true,
      id_current_course: true,
      state: true,
      birthDate: true,
      email: true,

      phone_number: true,
      gender: true,
      address: true,
      city: true,
      country: true,
      current_level: true,
      extracurricular_activities: true,
      current_course: {
        select: {
          level: true,
        },
      },
      representative: {
        select: {
          names: true,
          lastNames: true,
          id_document_type: true,
          id_document_number: true,
          id_document_image: true,
          state: true,
          profession: true,
          work_address: true,
          birthDate: true,
          email: true,
          phone_number: true,
          gender: true,
          address: true,
          city: true,
          country: true,
          relationship: true,
        },
      },
    },
  })

  if (!student) {
    throw new Error('Estudiante no encontrado')
  }

  return {
    ...student,
    status: student.current_status,
  }
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
const generateCode = async (
  courseLevel: number,
  courseId: number,
  courseEndMonth: number,
  courseStartYear: number
): Promise<string> => {
  // Obtener el número total de estudiantes en la base de datos
  const studentCount = await prisma.student.count()

  // El siguiente ID del estudiante será studentCount + 1
  const studentId = studentCount + 1

  // Formatear mes y año
  const formattedMonth = courseEndMonth.toString().padStart(2, '0')
  const formattedYear = courseStartYear.toString().slice(-2)

  // Generar el código
  const code = `${courseId}-${courseLevel}-${studentId}-${formattedMonth}-${formattedYear}`
  return code
}
const extractCourseLevel = (courseLevel: string): number => {
  if (courseLevel.includes('Nivel 1')) return 1
  if (courseLevel.includes('Nivel 2')) return 2
  if (courseLevel.includes('Nivel 3')) return 3
  if (courseLevel.includes('Nivel 4')) return 4
  if (courseLevel.includes('Nivel 5')) return 5

  return 0
}
export const createStudent = async (data: StudentFormType) => {
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

  if (!data.id_current_course) {
    return {
      error: 'No has seleccionado un horario',
      success: false,
    }
  }
  const course = await prisma.courses.findUnique({
    where: {
      id: data.id_current_course,
    },
  })

  if (!course) {
    return {
      error: 'No se encontro el horario',
      success: false,
    }
  }
  const courseLevel = extractCourseLevel(
    course.level ? course.level : 'Nivel 1'
  )
  const courseStartDate = course.start_date
    ? new Date(course.start_date)
    : new Date()
  const courseStartMonth = courseStartDate.getMonth() + 1
  const courseStartYear = courseStartDate.getFullYear()
  const code = await generateCode(
    courseLevel,
    course.id,
    courseStartMonth,
    courseStartYear
  )
  const uuid = (await prisma.student.count()) + 1
  await prisma.student.create({
    data: {
      ...data,
      uuid,
      codigo: code,
      id_current_course: undefined,
      current_course: {
        connect: {
          id: data.id_current_course,
        },
      },
      representative: data.representative
        ? {
            create: data.representative,
          }
        : undefined,
    },
  })

  await registerAuditAction('Se registró un nuevo estudiante: ' + data.names)
  revalidatePath('/dashboard/cursos/estudiantes')

  return {
    error: false,
    success: 'Estudiante registrado exitosamente',
  }
}

export const updateStudent = async (data: StudentFormType, id: number) => {
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
    data: {
      ...data,
      id_current_course: undefined,
      current_course: {
        connect: {
          id: data.id_current_course,
        },
      },
      representative: data.representative
        ? {
            update: data.representative,
          }
        : undefined,
    },
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
export const deleteStudent = async (id: number) => {
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

  await prisma.student.delete({
    where: {
      id,
    },
  })

  await registerAuditAction('Se elimino el estudiante: ' + id)
  revalidatePath('/dashboard/cursos/estudiantes')

  return {
    error: false,
    success: 'Estudiante eliminado exitosamente',
  }
}

export const getDataToExportPreInscription = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const student = await prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      current_course: true,
      representative: true,
    },
  })

  if (!student) {
    throw new Error('El estudiante no existe')
  }

  return {
    nivel: student.current_course.level,
    mes_inicio: format(
      new Date(
        student.current_course.start_date
          ? student.current_course.start_date
          : new Date()
      ),
      'MMMM',
      { locale: es }
    ),
    mes_culminacion: format(
      new Date(
        student.current_course.end_date
          ? student.current_course.end_date
          : new Date()
      ),
      'MMMM',
      { locale: es }
    ),
    edad: getAge(new Date(student.birthDate)),
    //example: fecha_actual:  '2022-12-31' ,
    fecha_actual: format(new Date(), 'dd-MM-yyyy'),
    nombre_completo: student?.names + ' ' + student?.lastNames,
    ci_estudiante: student?.id_document_number,
    fecha_nacimiento: format(new Date(student.birthDate), 'dd-MM-yyyy'),
    direccion: student.address,
    hasExtraActivities: student?.extracurricular_activities ? 'Si' : 'No',
    extra_activities: student?.extracurricular_activities,
    nombre_completo_representante: student.representative
      ? student.representative?.names + ' ' + student.representative.lastNames
      : 'No aplica',
    fecha_nacimiento_r: student.representative
      ? format(new Date(student.representative.birthDate), 'dd-MM-yyyy')
      : 'No aplica',
    ci_representante: student.representative
      ? `${student.representative?.id_document_type}-${student.representative?.id_document_number}`
      : 'No aplica',
    parentesco: student?.representative?.relationship,
    direccion_representante: student.representative
      ? student.representative.address
      : 'No aplica',
    profesion: student?.representative?.profession || 'No aplica',
    // direccion_trabajo: student.representative ? student.representative?.work_address : 'No aplica',
    telefono_representante: student.representative?.phone_number,
    correo: student?.email,
    direccion_trabajo: student?.representative?.work_address || '',
    correo_representante: student?.representative?.email || '',
  }
}
