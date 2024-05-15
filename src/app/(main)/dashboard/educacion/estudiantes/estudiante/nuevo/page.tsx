import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { PackagePlus } from 'lucide-react'
import { BackLinkButton } from '@/app/(auth)/components/back-button'
import StudentsForm from '../../components/forms/students-form'
import {
  getStudentById,
  getStudentByIdDocument,
} from '../../lib/actions/students'

export const metadata: Metadata = {
  title: 'Agregar Estudiante',
  description: 'Desde aquí puedes agregar estudiantes',
}

export default async function Page({
  params: { studentId },
}: {
  params: { studentId: string }
}) {
  const student = await getStudentByIdDocument(studentId)
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-8">
          <BackLinkButton label="Volver" variant="outline" />

          <div>
            <PageHeaderTitle>
              <PackagePlus size={24} />
              Agregar un estudiante
            </PageHeaderTitle>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className="pt-5 space-y-4 md:px-[20px]">
        <StudentsForm defaultValues={student} />
      </PageContent>
    </>
  )
}
