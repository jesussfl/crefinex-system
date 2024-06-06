import { Button, buttonVariants } from '@/modules/common/components/button'
import {
  Plus,
  FileDown,
  PackagePlus,
  User2,
  Package,
  ArrowRight,
  UserCircle,
  PackageMinus,
} from 'lucide-react'
import {
  HeaderLeftSide,
  HeaderRightSide,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'

import { Metadata } from 'next'

import { PageContent } from '@/modules/layout/templates/page'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { Boxes } from 'lucide-react'

import Link from 'next/link'
import { auth } from '@/auth'
// import { Overview } from '@/modules/common/components/overview/overview'

import { getUserPermissions } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Administrador',
  description: 'Desde aquí puedes administrar las salidas del inventario',
}

export default async function Page() {
  const session = await auth()
  const userPermissions = await getUserPermissions()

  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <PackagePlus size={24} />
            Bienvenido, {session?.user?.nombre}
          </PageHeaderTitle>
          <PageHeaderDescription>
            {`Correo: ${session?.user?.email} | Rol: ${session?.user?.rol_nombre}`}
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Button variant="outline" size={'sm'}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </HeaderRightSide>
      </PageHeader>

      <PageContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex flex-row items-center space-x-2">
                    <Boxes className="text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">
                      Estudiantes Totales
                    </CardTitle>
                  </div>
                  <Link
                    href="/dashboard/educacion/estudiantes"
                    className={buttonVariants({ variant: 'outline' })}
                  >
                    Ir a Estudiantes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex flex-row items-center space-x-2">
                    <UserCircle className="text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">
                      Usuarios Registrados
                    </CardTitle>
                  </div>
                  <Link
                    href="/dashboard/usuarios"
                    className={buttonVariants({ variant: 'outline' })}
                  >
                    Ir a usuarios
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold"></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex flex-row items-center space-x-2">
                    <PackageMinus className="text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">
                      Auditoria
                    </CardTitle>
                  </div>
                  <Link
                    href="/dashboard/auditoria"
                    className={buttonVariants({ variant: 'outline' })}
                  >
                    Ir a Auditoria
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold"></div>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle className="text-xl">Estadística</CardTitle>
                </CardHeader>
                <CardContent>{/* <Overview /> */}</CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle className="text-xl">Filtrado</CardTitle>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </PageContent>
    </>
  )
}
