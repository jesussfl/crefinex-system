import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { PackagePlus, UserCog2 } from 'lucide-react'
import { BackLinkButton } from '@/app/(auth)/components/back-button'

import { getEmployeeById } from '../../lib/actions/employee-actions'
import EmployeesForm from '../../components/forms/employees-form'

export const metadata: Metadata = {
  title: 'Editar Empleado',
  description: 'Desde aquí puedes editar un empleado',
}

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const employee = await getEmployeeById(Number(id))
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-8">
          <BackLinkButton label="Volver" variant="outline" />

          <div>
            <PageHeaderTitle>
              <UserCog2 size={24} />
              Editar Empleado
            </PageHeaderTitle>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className="pt-5 space-y-4 md:px-[20px]">
        <EmployeesForm defaultValues={employee} employeeId={Number(id)} />
      </PageContent>
    </>
  )
}
