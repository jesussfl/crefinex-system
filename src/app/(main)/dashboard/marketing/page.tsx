import { BarChart2, Plus } from 'lucide-react'
import { Metadata } from 'next'
import {
  HeaderLeftSide,
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
import PostsContainer from './cards-container'
import Link from 'next/link'
import { buttonVariants } from '@/modules/common/components/button'
import { getAllPosts } from './lib/actions/post-actions'
import PostsContainerWithoutMonth from './cards-container-without-month'

export const metadata: Metadata = {
  title: 'Marketing',
  description:
    'Desde aquí puedes visualizar todo lo relacionado a las redes sociales',
}
export default async function Page() {
  const posts = await getAllPosts()
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <BarChart2 size={24} />
            Marketing
          </PageHeaderTitle>
          <PageHeaderDescription>
            Visualiza todo lo relacionado a redes sociales
          </PageHeaderDescription>
        </HeaderLeftSide>
      </PageHeader>
      <Tabs defaultValue="planner">
        <TabsList className="mx-5">
          <TabsTrigger value="planner">Planner Mensual</TabsTrigger>
          <TabsTrigger value="planner-without-month">
            Planner sin Meses
          </TabsTrigger>
        </TabsList>
        <TabsContent value="planner">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-md">Planner Mensual</CardTitle>
                <Link
                  href="/dashboard/marketing/post"
                  className={buttonVariants({ variant: 'default' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Post
                </Link>
              </CardHeader>
              <CardContent className={'pb-8'}>
                <PostsContainer posts={posts} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
        <TabsContent value="planner-without-month">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-md">Planner Mensual</CardTitle>
                <Link
                  href="/dashboard/marketing/post"
                  className={buttonVariants({ variant: 'default' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Post
                </Link>
              </CardHeader>
              <CardContent className={'pb-8'}>
                <PostsContainerWithoutMonth posts={posts} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
      </Tabs>
    </>
  )
}
