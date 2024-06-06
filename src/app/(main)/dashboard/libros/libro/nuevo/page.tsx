import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { BookOpen } from 'lucide-react'
import { BackLinkButton } from '@/app/(auth)/components/back-button'

import LevelsForm from '../../components/forms/books-form'
import BooksForm from '../../components/forms/books-form'

export const metadata: Metadata = {
  title: 'Agregar Libro',
  description: 'Desde aquí puedes agregar libros',
}

export default async function Page() {
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-8">
          <BackLinkButton label="Volver" variant="outline" />

          <PageHeaderTitle>
            <BookOpen size={24} />
            Agregar Libro
          </PageHeaderTitle>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className="pt-5 space-y-4 md:px-[20px]">
        <BooksForm />
      </PageContent>
    </>
  )
}
