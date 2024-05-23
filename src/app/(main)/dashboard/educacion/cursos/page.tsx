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
import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { getAllOnlineCourses, getAllPresencialCourses } from './lib/actions'
import Link from 'next/link'
import { buttonVariants } from '@/modules/common/components/button'

export const metadata: Metadata = {
  title: 'Cursos',
  description: 'Desde aquí puedes visualizar todos los cursos de Crefinex',
}
export default async function Page() {
  const courses = await getAllPresencialCourses()
  const onlineCourses = await getAllOnlineCourses()
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
      <Tabs defaultValue="presenciales">
        <TabsList className="mx-5">
          <TabsTrigger value="presenciales">Presenciales</TabsTrigger>
          <TabsTrigger value="online">Online</TabsTrigger>
        </TabsList>
        <TabsContent value="presenciales">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-md">Cursos Presenciales</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={courses} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
        <TabsContent value="online">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-md">Cursos Online</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={onlineCourses} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
      </Tabs>
      <PageContent>
        <DataTable columns={columns} data={courses} />
      </PageContent>
    </>
  )
}
