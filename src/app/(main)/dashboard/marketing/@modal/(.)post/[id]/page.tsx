import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import { getPostsById } from '../../../lib/actions/post-actions'
import PostsForm from '../../../components/forms/posts-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const post = await getPostsById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden max-h-[90vh] p-0'}
      >
        <DialogHeader className="p-5 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Post
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <PostsForm postId={Number(id)} defaultValues={post} />
      </DialogContent>
    </Dialog>
  )
}
