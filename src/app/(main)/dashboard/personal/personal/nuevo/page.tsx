import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { UserCog2 } from 'lucide-react'
import { BackLinkButton } from '@/app/(auth)/components/back-button'

import EmployeesForm from '../../components/forms/employees-form'

export const metadata: Metadata = {
  title: 'Agregar Empleado',
  description: 'Desde aquí puedes agregar empleados',
}

export default async function Page() {
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-8">
          <BackLinkButton label="Volver" variant="outline" />

          <PageHeaderTitle>
            <UserCog2 size={24} />
            Agregar Empleado
          </PageHeaderTitle>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className="pt-5 space-y-4 md:px-[20px]">
        <EmployeesForm />
      </PageContent>
    </>
  )
}
