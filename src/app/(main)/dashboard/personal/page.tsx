import { BookOpen, Plus, UserCog2 } from 'lucide-react'
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
import Link from 'next/link'
import { buttonVariants } from '@/modules/common/components/button'
import { getAllEmployees } from './lib/actions/employee-actions'

export const metadata: Metadata = {
  title: 'Personal',
  description: 'Desde aquí puedes visualizar todos los empleados de Crefinex',
}
export default async function Page() {
  const employees = await getAllEmployees()

  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <UserCog2 size={24} />
            Personal de Crefinex
          </PageHeaderTitle>
          <PageHeaderDescription>
            Visualiza todo el personal de Crefinex
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Link
            href="/dashboard/personal/personal/nuevo"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Registrar Empleado
          </Link>
        </HeaderRightSide>
      </PageHeader>
      <Tabs defaultValue="datos">
        <TabsList className="mx-5">
          <TabsTrigger value="datos">Información del personal</TabsTrigger>
        </TabsList>
        <TabsContent value="datos">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-md">
                  Información del Personal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={employees} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
      </Tabs>
    </>
  )
}
