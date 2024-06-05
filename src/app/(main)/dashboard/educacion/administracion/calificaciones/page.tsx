import { Users2 } from 'lucide-react'
import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
} from '@/modules/layout/templates/page'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'

import { BackLinkButton } from '@/app/(auth)/components/back-button'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/modules/common/components/breadcrumb'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Estudiantes',
  description:
    'Desde aquí puedes visualizar a todos los estudiantes de Crefinex',
}

export default async function Page() {
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <div className="flex justify-start items-center gap-4">
            <BackLinkButton label="Volver" variant="outline" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>
                    <Link href="/dashboard/educacion/cursos">Cursos</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>
                    <Link
                      href="/dashboard/educacion/cursos"
                      className="flex items-center gap-4"
                    >
                      <Users2 size={24} />
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent>
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle className="text-md">Lista de Estudiantes</CardTitle>
              <CardDescription>
                Desde aquí puedes visualizar a todos los estudiantes del curso
                seleccionado
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </PageContent>
    </>
  )
}
