import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { BookUp2 } from 'lucide-react'
import { BackLinkButton } from '@/app/(auth)/components/back-button'

import LevelsForm from '../../components/forms/levels-form'

export const metadata: Metadata = {
  title: 'Agregar Nivel',
  description: 'Desde aquí puedes agregar niveles',
}

export default async function Page() {
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-8">
          <BackLinkButton label="Volver" variant="outline" />

          <div>
            <PageHeaderTitle>
              <BookUp2 size={24} />
              Agregar Nivel
            </PageHeaderTitle>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className="pt-5 space-y-4 md:px-[20px]">
        <LevelsForm />
      </PageContent>
    </>
  )
}
