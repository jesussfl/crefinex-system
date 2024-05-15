import { BookUp2, PackagePlus, Plus } from 'lucide-react'
import { Metadata } from 'next'
import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'

import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { deleteManyCourses, getAllCourses } from './lib/actions'
import Link from 'next/link'
import { buttonVariants } from '@/modules/common/components/button'
// import ButtonExport from './components/button-export'

export const metadata: Metadata = {
  title: 'Cursos',
  description: 'Desde aquí puedes visualizar todos los cursos de Crefinex',
}
export default async function Page() {
  const courses = await getAllCourses()
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <BookUp2 size={24} />
            Cursos de Crefinex
          </PageHeaderTitle>
          <PageHeaderDescription>
            Visualiza todos los cursos de Crefinex
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Link
            href="/dashboard/educacion/cursos/curso/nuevo"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Registrar Curso Nuevo
          </Link>
        </HeaderRightSide>
      </PageHeader>

      <PageContent>
        <DataTable columns={columns} data={courses} />
      </PageContent>
    </>
  )
}
