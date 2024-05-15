import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { PackagePlus } from 'lucide-react'
import { BackLinkButton } from '@/app/(auth)/components/back-button'
import CoursesForm from '../../components/forms/courses-form'
import { getCourseById } from '../../lib/actions'
import { getAllStudents } from '../../../estudiantes/lib/actions/students'

export const metadata: Metadata = {
  title: 'Editar Curso',
  description: 'Desde aquí puedes editar un curso',
}

export default async function Page({
  params: { courseId },
}: {
  params: { courseId: string }
}) {
  const course = await getCourseById(Number(courseId))
  const students = await getAllStudents()
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-8">
          <BackLinkButton label="Volver" variant="outline" />

          <div>
            <PageHeaderTitle>
              <PackagePlus size={24} />
              Editar curso
            </PageHeaderTitle>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className="pt-5 space-y-4 md:px-[20px]">
        <CoursesForm defaultValues={course} students={students} />
      </PageContent>
    </>
  )
}
