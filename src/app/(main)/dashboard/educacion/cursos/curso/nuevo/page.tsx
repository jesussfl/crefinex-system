import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { BookUp2, UserCircle2 } from 'lucide-react'
import { BackLinkButton } from '@/app/(auth)/components/back-button'
import CoursesForm from '../../components/forms/courses-form'
import { getAllStudents } from '../../../estudiantes/lib/actions/students'

export const metadata: Metadata = {
  title: 'Agregar Curso',
  description: 'Desde aquí puedes agregar cursos',
}

export default async function Page() {
  const students = await getAllStudents()
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-8">
          <BackLinkButton label="Volver" variant="outline" />

          <div>
            <PageHeaderTitle>
              <BookUp2 size={24} />
              Agregar Curso
            </PageHeaderTitle>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className="pt-5 space-y-4 md:px-[20px]">
        <CoursesForm students={students} />
      </PageContent>
    </>
  )
}
