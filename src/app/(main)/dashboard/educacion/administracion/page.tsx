import { PencilRuler, Plus } from 'lucide-react'
import { Metadata } from 'next'
import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import GradesTable from './components/grades-table/grades-table'
import {
  getAllCourses,
  getAllEvaluations,
  getAllStudentsWithGrades,
} from './lib/actions'

export const metadata: Metadata = {
  title: 'Administración Academica',
  description: 'Desde aquí puedes visualizar todos los cursos de Crefinex',
}
export default async function Page() {
  const studentsWithGrades = await getAllStudentsWithGrades()
  const evaluations = await getAllEvaluations()
  const courses = await getAllCourses()
  const transformedCourses = courses.map((course) => ({
    value: course.id,
    label: `${course.title} (${course.level.name})`,
  }))

  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <PencilRuler size={24} />
            Administración Academica
          </PageHeaderTitle>
          <PageHeaderDescription>
            Visualiza todas las notas de los estudiantes
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide></HeaderRightSide>
      </PageHeader>
      <PageContent>
        <GradesTable
          studentsWithGrades={studentsWithGrades}
          evaluations={evaluations}
          courses={transformedCourses}
        />
      </PageContent>
    </>
  )
}
