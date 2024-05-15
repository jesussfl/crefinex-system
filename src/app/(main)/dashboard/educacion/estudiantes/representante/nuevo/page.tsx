import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { UserCircle2 } from 'lucide-react'
import { BackLinkButton } from '@/app/(auth)/components/back-button'
import StudentsForm from '../../components/forms/students-form'
import RepresentativesForm from '../../components/forms/representatives-form'

export const metadata: Metadata = {
  title: 'Agregar Representante',
  description: 'Desde aquí puedes agregar representantes',
}

export default async function Page() {
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-8">
          <BackLinkButton label="Volver" variant="outline" />

          <div>
            <PageHeaderTitle>
              <UserCircle2 size={24} />
              Agregar Representante
            </PageHeaderTitle>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className="pt-5 space-y-4 md:px-[20px]">
        <RepresentativesForm />
      </PageContent>
    </>
  )
}
