import { Users2 } from 'lucide-react'
import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
} from '@/modules/layout/templates/page'
import { DataTable } from '@/modules/common/components/table/data-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
// import ButtonExport from './components/button-export'
import { getStudentsByCourse } from '../../../../estudiantes/lib/actions/students'
import {
  StudentByCourseType,
  studentsByCourseColumns,
} from './components/forms/columns/students-by-course-columns'
import { BackLinkButton } from '@/app/(auth)/components/back-button'
import { ManualModalStudentsStates } from './components/manual-modal'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/modules/common/components/breadcrumb'
import Link from 'next/link'
import { getCourseById } from '../../../lib/actions'

export const metadata: Metadata = {
  title: 'Estudiantes',
  description:
    'Desde aquí puedes visualizar a todos los estudiantes de Crefinex',
}

const generateCode = (
  courseLevel: number,
  courseId: number,
  studentId: number,
  courseEndMonth: number,
  courseStartYear: number
): string => {
  const formattedMonth = courseEndMonth.toString().padStart(2, '0')
  const formattedYear = courseStartYear.toString().slice(-2)
  const code = `${courseId}-${courseLevel}-${studentId}-${formattedMonth}-${formattedYear}`
  return code
}

export default async function Page({
  params: { courseId },
}: {
  params: { courseId: string }
}) {
  const students = await getStudentsByCourse(Number(courseId))
  const course = await getCourseById(Number(courseId))
  const courseLevel = course.level.order || 0 // Asumiendo que el nivel del curso está en el objeto `course`
  const courseEndDate = course.end_date ? new Date(course.end_date) : new Date()
  const courseStartDate = course.start_date
    ? new Date(course.start_date)
    : new Date()
  const courseEndMonth = courseEndDate.getMonth() + 1
  const courseStartYear = courseStartDate.getFullYear()
  const filteredStudents = students.map((student) => {
    const studentData = student.student
    const code = generateCode(
      courseLevel,
      Number(courseId),
      studentData.id,
      courseEndMonth,
      courseStartYear
    )

    return {
      ...studentData,
      status: student.status,
      code: code, // Añadir el código generado a los datos del estudiante
    } as StudentByCourseType
  })

  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <div className="flex justify-start items-center gap-4">
            <BackLinkButton label="Volver" variant="outline" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>
                    <Link href="/dashboard/educacion/cursos">Cursos</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>
                    <Link
                      href="/dashboard/educacion/cursos"
                      className="flex items-center gap-4"
                    >
                      <Users2 size={24} />
                      Estudiantes del curso: {course.title}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent>
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle className="text-md">Lista de Estudiantes</CardTitle>
              <CardDescription>
                Desde aquí puedes visualizar a todos los estudiantes del curso
                seleccionado
              </CardDescription>
            </div>
            <ManualModalStudentsStates
              id={Number(courseId)}
              students={filteredStudents}
            />
          </CardHeader>
          <CardContent>
            <DataTable
              columns={studentsByCourseColumns}
              data={filteredStudents}
            />
          </CardContent>
        </Card>
      </PageContent>
    </>
  )
}
