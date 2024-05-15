import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { PackagePlus } from 'lucide-react'
import { BackLinkButton } from '@/app/(auth)/components/back-button'

import RepresentativesForm from '../../components/forms/representatives-form'
import { getRepresentativeByIdDocument } from '../../lib/actions/representatives'

export const metadata: Metadata = {
  title: 'Editar Representante',
  description: 'Desde aquí puedes editar representantes',
}

export default async function Page({
  params: { representativeId },
}: {
  params: { representativeId: string }
}) {
  const representative = await getRepresentativeByIdDocument(representativeId)
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-8">
          <BackLinkButton label="Volver" variant="outline" />

          <div>
            <PageHeaderTitle>
              <PackagePlus size={24} />
              Editar Representante
            </PageHeaderTitle>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className="pt-5 space-y-4 md:px-[20px]">
        <RepresentativesForm defaultValues={representative} />
      </PageContent>
    </>
  )
}
