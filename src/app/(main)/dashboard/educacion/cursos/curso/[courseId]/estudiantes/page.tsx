import { Users2 } from 'lucide-react'
import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'

import { DataTable } from '@/modules/common/components/table/data-table'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
// import ButtonExport from './components/button-export'

import { getStudentsByCourse } from '../../../../estudiantes/lib/actions/students'
import { columns } from '../../../../estudiantes/columns'
import ModalForm from '@/modules/common/components/modal-form'
import ChangeStudentStateForm from './components/forms/student-states-form'
import {
  StudentByCourseType,
  studentsByCourseColumns,
} from './components/forms/columns/students-by-course-columns'
import { BackLinkButton } from '@/app/(auth)/components/back-button'
import { ManualModalStudentsStates } from './components/manual-modal'

export const metadata: Metadata = {
  title: 'Estudiantes',
  description:
    'Desde aquí puedes visualizar a todos los estudiantes de Crefinex',
}
export default async function Page({
  params: { courseId },
}: {
  params: { courseId: string }
}) {
  const students = await getStudentsByCourse(Number(courseId))
  const filteredStudents = students.map((student) => {
    const studentData = student.student
    return {
      ...studentData,
      status: student.status,
    } as StudentByCourseType
  })

  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <div className="flex justify-start items-center gap-4">
            <BackLinkButton label="Volver" variant="outline" />
            <PageHeaderTitle>
              <Users2 size={24} />
              Estudiantes del curso
            </PageHeaderTitle>
          </div>
          <PageHeaderDescription>
            Visualiza todos los estudiantes del curso
          </PageHeaderDescription>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent>
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-md">Lista de Estudiantes</CardTitle>

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
