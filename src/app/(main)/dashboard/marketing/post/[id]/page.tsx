import PageForm from '@/modules/layout/components/page-form'
import { getPostsById } from '../../lib/actions/post-actions'
import PostsForm from '../../components/forms/posts-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const post = await getPostsById(Number(id))
  return (
    <PageForm title="Editar Post" backLink="/dashboard/marketing">
      <PostsForm defaultValues={post} postId={Number(id)} />
    </PageForm>
  )
}
