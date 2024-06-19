'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma, Student_Status } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
import { auth } from '@/auth'
import { getAge } from '@/utils/helpers/get-age'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { getCldImageUrl } from 'next-cloudinary'
import axios from 'axios'
import { StudentFormType } from '@/types/types'

export const getAllStudents = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const students = await prisma.student.findMany({
    include: {
      representatives: true,
      current_course: {
        include: {
          level: true,
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
      representatives: true,
      current_course: {
        include: {
          level: true,
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
      representatives: true,
      current_course: {
        include: {
          level: true,
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
      id_main_representative: true,
      phone_number: true,
      gender: true,
      address: true,
      degree: true,
      liveWith: true,
      city: true,
      country: true,
      can_medicate: true,
      medicine: true,
      birth_place: true,
      school: true,
      extracurricular_activities: true,
      current_course: {
        select: {
          level: true,
        },
      },
      schedules: {
        select: {
          schedule: true,
        },
      },
      secondary_representative: {
        select: {
          names: true,
          last_names: true,
          id_document_type: true,
          id_document_number: true,
          phone_number: true,
          relationship: true,
        },
      },
      emergency_representative: {
        select: {
          names: true,
          last_names: true,
          id_document_type: true,
          id_document_number: true,
          phone_number: true,
          relationship: true,
        },
      },
      representatives: {
        select: {
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
              civil_status: true,
              work_position: true,
              is_working: true,
              facebook: true,
              instagram: true,
              youtube: true,
              tiktok: true,
            },
          },
        },
      },
    },
  })

  if (!student) {
    throw new Error('Estudiante no encontrado')
  }

  const { current_course, ...rest } = student
  return {
    ...rest,

    representatives: student.representatives.map((rep) => rep.representative),
    level_id: student.current_course.level.id,
    current_status: student.current_status,
    current_schedules: student.schedules.map((schedule) => {
      return {
        value: String(schedule.schedule.id),
        label: `${schedule.schedule.day} (${schedule.schedule.start} - ${schedule.schedule.end})`,
      }
    }),
  }
}

const generateCode = async (
  courseLevel: number,
  courseId: number,
  courseModality: number,
  courseEndMonth: number,
  courseStartYear: number,
  id_student?: number
): Promise<string> => {
  // Obtener el número total de estudiantes en la base de datos
  const studentCount = await prisma.student.count()

  // El siguiente ID del estudiante será studentCount + 1
  const studentId = id_student ? id_student : studentCount + 1

  // Formatear mes y año
  const formattedMonth = courseEndMonth.toString().padStart(2, '0')
  const formattedYear = courseStartYear.toString().slice(-2)

  // Generar el código
  const code = `${courseId}-${courseLevel}-${courseModality}-${studentId}-${formattedMonth}-${formattedYear}`
  return code
}
const generateStudentCode = async (
  course: Prisma.CoursesGetPayload<{ include: { level: true } }>,
  id_student?: number
) => {
  const courseLevel = course.level.order || 1
  const courseModality = course.modality === 'Presencial' ? 1 : 2
  const courseStartDate = course.start_date
    ? new Date(course.start_date)
    : new Date()
  const courseStartMonth = courseStartDate.getMonth() + 1
  const courseStartYear = courseStartDate.getFullYear()
  const code = await generateCode(
    courseLevel,
    course.id,
    courseModality,
    courseStartMonth,
    courseStartYear,
    id_student
  )

  return code
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
    include: {
      level: true,
    },
  })

  if (!course) {
    return {
      error: 'No se encontro el horario',
      success: false,
    }
  }

  const uuid = (await prisma.student.count()) + 1
  const codigo = await generateStudentCode(course)
  const {
    current_schedules,

    level_id,
    ...rest
  } = data

  try {
    await prisma.$transaction([
      prisma.representative.createMany({
        data: data.representatives.map((representative) => ({
          ...representative,
        })),
      }),

      prisma.student.create({
        data: {
          ...rest,
          emergency_representative: rest.emergency_representative
            ? {
                create: {
                  ...rest.emergency_representative,
                },
              }
            : undefined,
          secondary_representative: rest.secondary_representative
            ? {
                create: {
                  ...rest.secondary_representative,
                },
              }
            : undefined,

          id_main_representative: undefined,
          main_representative: data.id_main_representative
            ? {
                connect: {
                  id_document_number: data.id_main_representative,
                },
              }
            : undefined,
          can_medicate: rest.can_medicate ? true : false,
          uuid,
          codigo: codigo,
          id_current_course: undefined,
          current_course: {
            connect: {
              id: rest.id_current_course,
            },
          },
          schedules: {
            createMany: {
              data: data.current_schedules.map((schedule) => ({
                id_schedule: Number(schedule.value),
              })),
            },
          },
          representatives: {
            createMany: {
              data: data.representatives.map((representative) => ({
                id_document_number_representative:
                  representative.id_document_number,
              })),
            },
          },
          courses: {
            create: {
              id_course: rest.id_current_course,
            },
          },
        },
      }),
    ])

    await registerAuditAction(
      `Se registró un nuevo estudiante: ${data.names} ${data.lastNames}`
    )
    revalidatePath('/dashboard/educacion/estudiantes')

    return {
      error: false,
      success: 'Estudiante registrado exitosamente',
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      return {
        error: error.message,
        success: false,
      }
    }

    return {
      error: 'Parece que hubo un problema',
      success: false,
    }
  }
}

export const updateStudent = async (id: number, data: StudentFormType) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.ESTUDIANTES,
    actionName: 'ACTUALIZAR',
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
    include: {
      level: true,
    },
  })

  if (!course) {
    return {
      error: 'No se encontró el horario',
      success: false,
    }
  }

  const codigo = await generateStudentCode(course, id)
  const {
    level_id,
    emergency_representative,
    secondary_representative,
    current_schedules,
    id_current_course,
    id_main_representative,
    //@ts-ignore
    schedules,
    representatives,
    ...rest
  } = data
  const coursesOfStudent = await prisma.students_Courses.findMany({
    where: {
      id_student: id,
    },
  })

  const isCurrentCourseExist = coursesOfStudent.some(
    (course) => course.id_course === id_current_course
  )
  try {
    await prisma.$transaction([
      prisma.representative.deleteMany({
        where: {
          students: {
            some: {
              student_id: id,
            },
          },
        },
      }),

      prisma.representative.createMany({
        data: data.representatives.map((representative) => ({
          ...representative,
        })),
      }),

      prisma.student.update({
        where: { id },
        data: {
          ...rest,
          codigo: codigo,
          emergency_representative: {
            update: {
              ...emergency_representative,
            },
          },
          secondary_representative: {
            update: {
              ...secondary_representative,
            },
          },
          courses: isCurrentCourseExist
            ? undefined
            : {
                create: {
                  id_course: id_current_course,
                },
              },
          current_course: {
            connect: {
              id: id_current_course,
            },
          },
          main_representative: id_main_representative
            ? {
                connect: {
                  id_document_number: id_main_representative,
                },
              }
            : undefined,

          schedules: {
            deleteMany: {},
            createMany: {
              data: data.current_schedules.map((schedule) => ({
                id_schedule: Number(schedule.value),
              })),
            },
          },
          representatives: {
            deleteMany: {},
            createMany: {
              data: data.representatives.map((representative) => ({
                id_document_number_representative:
                  representative.id_document_number,
              })),
            },
          },
        },
      }),
    ])
    await registerAuditAction('Se actualizó el estudiante: ' + data.names)
    revalidatePath('/dashboard/educacion/estudiantes')

    return {
      error: false,
      success: 'Estudiante actualizado exitosamente',
    }
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        error: error.message,
        success: false,
      }
    }

    return {
      error: error.message,
      success: false,
    }
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
      emergency_representative: true,
      secondary_representative: true,
      main_representative: true,
      current_course: {
        include: {
          level: true,
        },
      },
      representatives: {
        include: {
          representative: true,
        },
      },
    },
  })

  if (!student) {
    throw new Error('El estudiante no existe')
  }
  const url = getCldImageUrl({
    width: 960,
    height: 600,
    src: student.student_image || '',
  })

  const urlMainRepresentative = getCldImageUrl({
    width: 960,
    height: 600,
    src: student?.main_representative?.representative_image || '',
  })

  const imageToShow = async (url: string) => {
    if (!url) return null
    const response = await axios(url, { responseType: 'arraybuffer' })
    const buffer64 = Buffer.from(response.data, 'binary').toString('base64')
    return buffer64
  }
  const mainRepresentativeImage = {
    width: 4,
    height: 4,
    data: await imageToShow(urlMainRepresentative),
    extension: '.jpg',
  }
  const exportedImage = {
    width: 4,
    height: 4,
    data: await imageToShow(url),
    extension: '.jpg',
  }

  const convertRepresentativeImages = async (representatives: any) => {
    const representativeImages = representatives.map(
      async (representative: any) => {
        const image = getCldImageUrl({
          width: 960,
          height: 600,
          src: representative.representative.representative_image || '',
        })

        const buffer64 = await imageToShow(image)

        return {
          representative_image: buffer64,
          id: representative.representative.id,
        }
      }
    )

    return Promise.all(representativeImages)
  }
  const representativeImagesConverted = await convertRepresentativeImages(
    student.representatives
  )
  const representatives = student.representatives.map(
    (representative, index) => {
      return {
        ...representative.representative,
        representative_image: {
          width: 4,
          height: 4,
          data: representativeImagesConverted[index].representative_image,
          extension: '.jpg',
        },
      }
    }
  )
  return {
    // nombre_completo: `${student.names} ${student.lastNames}`,
    codigo: student.codigo,
    mes: format(new Date(), 'MMMM', { locale: es }),
    ano: format(new Date(), 'yyyy', { locale: es }),
    dia: format(new Date(), 'dd', { locale: es }),
    orden: '1',
    nivel: student.current_course.level.name,
    nombre_nivel: student.current_course.level.name,
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
    edad:
      (student?.birthDate && getAge(new Date(student.birthDate))) ||
      'sin definir',

    fecha_actual: format(new Date(), 'dd-MM-yyyy'),
    nombre_completo: student?.names + ' ' + student?.lastNames,
    ci_estudiante: student?.id_document_number,
    fecha_nacimiento: student?.birthDate
      ? format(new Date(student.birthDate), 'dd-MM-yyyy')
      : 'sin definir',
    sexo: student.gender,
    estado: student.state,
    plantel: student.school,
    grado: 'Sin definir',
    hasMedicamento: student?.can_medicate ? 'Si' : 'No',
    lugar_nacimiento: student.birth_place,
    medicamento: student?.medicine,
    student_image: exportedImage.data != null ? exportedImage : null,
    direccion: student.address,
    hasExtraActivities: student?.extracurricular_activities ? 'Si' : 'No',
    extra_activities: student?.extracurricular_activities,
    correo: student?.email,
    emergencia_nombre:
      student.emergency_representative?.names +
      ' ' +
      student.emergency_representative?.last_names,
    emergencia_parentesco: student.emergency_representative?.relationship,
    emergencia_telefono: student.emergency_representative?.phone_number,
    autorizacion_nombre:
      student.secondary_representative?.names +
      ' ' +
      student.secondary_representative?.last_names,
    autorizacion_cedula: `${student.secondary_representative?.id_document_type}-${student.secondary_representative?.id_document_number}`,
    autorizacion_parentesco: student.secondary_representative?.relationship,
    autorizacion_telefono: student.secondary_representative?.phone_number,
    representante: {
      nombre_completo_representante:
        student.main_representative?.names +
        ' ' +
        student.main_representative?.lastNames,
      fecha_nacimiento_r:
        (student.main_representative?.birthDate &&
          format(
            new Date(student.main_representative?.birthDate),
            'dd-MM-yyyy'
          )) ||
        'sin definir',
      //if word end with "a" add "la" else add "el"
      title: student?.main_representative?.relationship.endsWith('a')
        ? `DATOS DE LA ${student.main_representative.relationship.toUpperCase()}`
        : `DATOS DEL ${student.main_representative?.relationship.toUpperCase()}`,
      edad:
        (student.main_representative?.birthDate &&
          getAge(new Date(student.main_representative?.birthDate))) ||
        'sin definir',
      ci_representante: `${student.main_representative?.id_document_type}-${student.main_representative?.id_document_number}`,
      parentesco: student.main_representative?.relationship,
      direccion_representante: student.main_representative?.address,
      profesion: student.main_representative?.profession || 'No aplica',
      telefono_representante: student.main_representative?.phone_number,
      direccion_trabajo: student.main_representative?.work_address || '',
      correo_representante: student.main_representative?.email || '',
      sexo: student.main_representative?.gender,
      representative_image:
        mainRepresentativeImage.data != null ? mainRepresentativeImage : null,
      is_working: student.main_representative?.is_working ? 'Si' : 'No',
      facebook: student.main_representative?.facebook,
      instagram: student.main_representative?.instagram,
      youtube: student.main_representative?.youtube,
      tiktok: student.main_representative?.tiktok,
      cargo_laboral: student.main_representative?.work_position,
      estado_civil: student?.main_representative?.civil_status,
    },
    representantes: representatives.map((representative) => {
      return {
        nombre_completo_representante:
          representative?.names + ' ' + representative?.lastNames,
        fecha_nacimiento_r:
          (representative?.birthDate &&
            format(new Date(representative?.birthDate), 'dd-MM-yyyy')) ||
          'sin definir',
        //if word end with "a" add "la" else add "el"
        title: representative.relationship.endsWith('a')
          ? `DATOS DE LA ${representative.relationship.toUpperCase()}`
          : `DATOS DEL ${representative.relationship.toUpperCase()}`,
        edad:
          (representative?.birthDate &&
            getAge(new Date(representative?.birthDate))) ||
          'sin definir',
        ci_representante: `${representative?.id_document_type}-${representative?.id_document_number}`,
        parentesco: representative?.relationship,
        direccion_representante: representative?.address,
        profesion: representative?.profession || 'No aplica',
        telefono_representante: representative?.phone_number,
        direccion_trabajo: representative?.work_address || '',
        correo_representante: representative?.email || '',
        sexo: representative?.gender,
        representative_image:
          representative?.representative_image.data != null
            ? representative?.representative_image
            : null,
        is_working: representative?.is_working ? 'Si' : 'No',
        facebook: representative?.facebook,
        instagram: representative?.instagram,
        youtube: representative?.youtube,
        tiktok: representative?.tiktok,
        cargo_laboral: representative?.work_position,
        estado_civil: representative.civil_status,
      }
    }),
  }
}
