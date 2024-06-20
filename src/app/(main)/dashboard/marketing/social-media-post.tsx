import { cn } from '@/utils/utils'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/modules/common/components/context-menu'
import { Badge } from '@/modules/common/components/badge'
import { format } from 'date-fns'
import Link from 'next/link'
import { deletePost } from './lib/actions/post-actions'
import { CldImage } from 'next-cloudinary'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/modules/common/components/alert-dialog'
import { Post } from '@prisma/client'

interface SocialMediaPost extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
  aspectRatio?: 'portrait' | 'square'
  width?: number
  height?: number
}

export function SocialMediaPost({
  post,
  aspectRatio = 'portrait',
  width,
  height,
  className,
  ...props
}: SocialMediaPost) {
  const getBadgeStatus = (status: string | null) => {
    switch (status) {
      case 'En Revisión':
        return 'warning'
      case 'Publicado':
        return 'success'
      case 'Rechazado':
        return 'destructive'
      case 'Pendiente':
        return 'secondary'
      case 'Aprobado':
        return 'success'

      default:
        return 'secondary'
    }
  }

  return (
    <div className={cn('space-y-3', className)} {...props}>
      <AlertDialog>
        <ContextMenu>
          <ContextMenuTrigger>
            <Link href={`/dashboard/marketing/post/${post.id}`}>
              <div className="space-y-3 hover:cursor-pointer hover:scale-105 transition-all p-3 border border-gray-300 rounded-md">
                <div className="overflow-hidden rounded-md ">
                  {post.image ? (
                    <div className="relative">
                      <CldImage
                        src={post.image || ''}
                        width={width}
                        height={height}
                        alt="Uploaded Image"
                      />
                      <Badge
                        variant={getBadgeStatus(post.status)}
                        className="absolute top-2 right-2"
                      >
                        {post.status}
                      </Badge>
                    </div>
                  ) : (
                    <div className="relative">
                      <div
                        className={cn(
                          'h-auto w-auto bg-slate-200 object-cover transition-all hover:scale-105',
                          aspectRatio === 'portrait'
                            ? 'aspect-[3/4]'
                            : 'aspect-square'
                        )}
                      />
                      <Badge
                        variant={getBadgeStatus(post.status)}
                        className="text-sm absolute top-2 right-2"
                      >
                        {post.status}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-4 text-md"></div>
                <div className="space-y-1">
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {post.description}
                  </p>
                  <p className="text-sm truncate font-medium">
                    {post.date
                      ? format(post.date, 'dd/MM/yyyy HH:mm')
                      : 'Sin fecha'}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm truncate font-regular">Título:</p>
                    <Badge
                      variant={getBadgeStatus(post.title_status)}
                      className="text-sm top-2 right-2"
                    >
                      {post.title_status ? post.title_status : 'En Revisión'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm truncate font-regular">Portada:</p>
                    <Badge
                      variant={getBadgeStatus(post.cover_status)}
                      className="text-sm top-2 right-2"
                    >
                      {post.cover_status ? post.cover_status : 'En Revisión'}
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-40">
            <ContextMenuItem onClick={() => deletePost(post.id)}>
              Eliminar
            </ContextMenuItem>
            <ContextMenuItem>
              <AlertDialogTrigger>Ver Portada</AlertDialogTrigger>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <AlertDialogContent className="max-h-[90vh]">
          <AlertDialogHeader>
            <AlertDialogTitle>{post.title}</AlertDialogTitle>
            <AlertDialogDescription>{post.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <CldImage
            src={post.image || ''}
            width={400}
            height={800}
            alt="Uploaded Image"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cerrar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
