import { Plus, Users2 } from 'lucide-react'
import { Metadata } from 'next'
import {
  HeaderLeftSide,
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
// import ButtonExport from './components/button-export'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'
import { getAllRepresentatives } from './lib/actions/representatives'
import { representativeColumns } from './components/columns/representative-columns'

export const metadata: Metadata = {
  title: 'Estudiantes',
  description:
    'Desde aquí puedes visualizar a todos los estudiantes de Crefinex',
}
export default async function Page() {
  const students = await getAllStudents()
  const representatives = await getAllRepresentatives()
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <Users2 size={24} />
            Estudiantes de Crefinex
          </PageHeaderTitle>
          <PageHeaderDescription>
            Visualiza todos los estudiantes de Crefinex
          </PageHeaderDescription>
        </HeaderLeftSide>
      </PageHeader>
      <Tabs defaultValue="students">
        <TabsList className="mx-5">
          <TabsTrigger value="students">Estudiantes</TabsTrigger>
          <TabsTrigger value="representative">Representantes</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-md">Lista de Estudiantes</CardTitle>
                <Link
                  href="/dashboard/educacion/estudiantes/estudiante/nuevo"
                  className={buttonVariants({ variant: 'default' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Estudiante
                </Link>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={students} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
        <TabsContent value="representative">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-md">
                  Lista de Representantes
                </CardTitle>
                <Link
                  href="/dashboard/educacion/estudiantes/representante/nuevo"
                  className={buttonVariants({ variant: 'default' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Representante
                </Link>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={representativeColumns}
                  data={representatives}
                />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
      </Tabs>
    </>
  )
}
