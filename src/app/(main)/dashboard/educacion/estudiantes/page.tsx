import { Plus, Users2 } from 'lucide-react'
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
import {
  getAllOnlineStudents,
  getAllPresencialStudents,
} from './lib/actions/students'
import Link from 'next/link'
import { buttonVariants } from '@/modules/common/components/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'
import { representativeColumns } from './components/columns/representative-columns'
import { getAllRepresentatives } from './lib/actions/representatives'

export const metadata: Metadata = {
  title: 'Estudiantes',
  description:
    'Desde aquí puedes visualizar a todos los estudiantes de Crefinex',
}
export default async function Page() {
  const onlineStudents = await getAllOnlineStudents()
  const presencialStudents = await getAllPresencialStudents()
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
        <HeaderRightSide>
          <Link
            href="/dashboard/educacion/estudiantes/estudiante/nuevo"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Estudiante
          </Link>
        </HeaderRightSide>
      </PageHeader>
      <Tabs defaultValue="presencial">
        <TabsList className="mx-5">
          <TabsTrigger value="presencial">Estudiantes Presencial</TabsTrigger>
          <TabsTrigger value="online">Estudiantes Online </TabsTrigger>
          <TabsTrigger value="representantes">Representantes</TabsTrigger>
        </TabsList>
        <TabsContent value="presencial">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-md">
                  Estudiantes Presencial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={presencialStudents} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
        <TabsContent value="online">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-md">Estudiantes Online</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={onlineStudents} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
        <TabsContent value="representantes">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-md">Representantes</CardTitle>
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
