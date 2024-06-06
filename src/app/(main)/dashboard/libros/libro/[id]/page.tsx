import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { PackagePlus } from 'lucide-react'
import { BackLinkButton } from '@/app/(auth)/components/back-button'

import BooksForm from '../../components/forms/books-form'
import { getBookById } from '../../lib/actions/book-actions'

export const metadata: Metadata = {
  title: 'Editar Libro',
  description: 'Desde aquí puedes editar un libro',
}

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const book = await getBookById(Number(id))
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-8">
          <BackLinkButton label="Volver" variant="outline" />

          <div>
            <PageHeaderTitle>
              <PackagePlus size={24} />
              Editar libro
            </PageHeaderTitle>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className="pt-5 space-y-4 md:px-[20px]">
        <BooksForm defaultValues={book} />
      </PageContent>
    </>
  )
}
