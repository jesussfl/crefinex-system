import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { PackagePlus } from 'lucide-react'
import { BackLinkButton } from '@/app/(auth)/components/back-button'
import LevelsForm from '../../components/forms/levels-form'
import { getLevelById } from '../../lib/actions/level-actions'

export const metadata: Metadata = {
  title: 'Editar Nivel',
  description: 'Desde aquí puedes editar un nivel',
}

export default async function Page({
  params: { levelId },
}: {
  params: { levelId: string }
}) {
  const level = await getLevelById(Number(levelId))
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-8">
          <BackLinkButton label="Volver" variant="outline" />

          <div>
            <PageHeaderTitle>
              <PackagePlus size={24} />
              Editar nivel
            </PageHeaderTitle>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className="pt-5 space-y-4 md:px-[20px]">
        <LevelsForm defaultValues={level} />
      </PageContent>
    </>
  )
}
