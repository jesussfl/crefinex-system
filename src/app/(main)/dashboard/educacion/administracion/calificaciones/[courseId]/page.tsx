import { Users2 } from 'lucide-react'
import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { DataTable } from '@/modules/common/components/table/data-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
// import ButtonExport from './components/button-export'

import { BackLinkButton } from '@/app/(auth)/components/back-button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/modules/common/components/breadcrumb'
import Link from 'next/link'
import { getCourseById, getStudentsByCourseId } from '../../lib/actions'
import { studentsByCourseColumns } from '../../../cursos/curso/[courseId]/estudiantes/components/forms/columns/students-by-course-columns'

export const metadata: Metadata = {
  title: 'Estudiantes',
  description:
    'Desde aquí puedes visualizar a todos los estudiantes de Crefinex',
}

export default async function Page({
  params: { courseId },
}: {
  params: { courseId: string }
}) {
  const students = await getStudentsByCourseId(Number(courseId))
  const course = await getCourseById(Number(courseId))

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
                      Estudiantes del curso: {course.title}
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
