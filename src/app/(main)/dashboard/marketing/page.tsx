import { BarChart2, BookOpen, Plus, UserCog2 } from 'lucide-react'
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
import PostsContainer from './cards-container'
import Link from 'next/link'
import { buttonVariants } from '@/modules/common/components/button'
import { getAllPosts } from './lib/actions/post-actions'

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
        <HeaderRightSide></HeaderRightSide>
      </PageHeader>
      <Tabs defaultValue="planner">
        <TabsList className="mx-5">
          <TabsTrigger value="planner">Planner Mensual</TabsTrigger>
          <TabsTrigger value="metrics">Metricas</TabsTrigger>
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
        <TabsContent value="metrics">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-md">Métricas</CardTitle>
              </CardHeader>
              <CardContent className={'pb-8'}></CardContent>
            </Card>
          </PageContent>
        </TabsContent>
      </Tabs>
    </>
  )
}
