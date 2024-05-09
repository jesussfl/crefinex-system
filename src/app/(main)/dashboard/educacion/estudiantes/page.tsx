import { PackagePlus, Plus } from 'lucide-react'
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
import { getAllStudents } from './lib/actions/students'
import Link from 'next/link'
import { buttonVariants } from '@/modules/common/components/button'
import { deleteManyCourses } from '../cursos/lib/actions'
// import ButtonExport from './components/button-export'

export const metadata: Metadata = {
  title: 'Estudiantes',
  description:
    'Desde aquí puedes visualizar a todos los estudiantes de Crefinex',
}
export default async function Page() {
  const students = await getAllStudents()
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <PackagePlus size={24} />
            Estudiantes de Crefinex
          </PageHeaderTitle>
          <PageHeaderDescription>
            Visualiza todos los estudiantes de Crefinex
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Link
            href="/dashboard/educacion/estudiantes/registro"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Registrar Estudiante
          </Link>
        </HeaderRightSide>
      </PageHeader>

      <PageContent>
        <DataTable
          columns={columns}
          data={students}
          multipleDeleteMethod={deleteManyCourses}
        />
      </PageContent>
    </>
  )
}
