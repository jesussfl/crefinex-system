import PageForm from '@/modules/layout/components/page-form'
import PostsForm from '../components/forms/posts-form'

export default async function Page() {
  return (
    <PageForm title="Agregar Post" backLink="/dashboard/marketing/">
      <PostsForm />
    </PageForm>
  )
}
