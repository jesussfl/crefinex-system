import Image from 'next/image'
import { PlusCircledIcon } from '@radix-ui/react-icons'

import { cn } from '@/utils/utils'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/modules/common/components/context-menu'
import { Badge } from '@/modules/common/components/badge'
import { format } from 'date-fns'
import Link from 'next/link'
import { deletePost } from './lib/actions/post-actions'

interface SocialMediaPost extends React.HTMLAttributes<HTMLDivElement> {
  post: any
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
  return (
    <div className={cn('space-y-3', className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <Link href={`/dashboard/marketing/post/${post.id}`}>
            <div className="space-y-3 hover:cursor-pointer hover:scale-105 transition-all">
              <div className="overflow-hidden rounded-md">
                {post.cover ? (
                  <div className="relative">
                    <Image
                      src={post.cover}
                      alt={post.title}
                      width={width}
                      height={height}
                      className={cn(
                        'h-auto w-auto object-cover transition-all hover:scale-105',
                        aspectRatio === 'portrait'
                          ? 'aspect-[3/4]'
                          : 'aspect-square'
                      )}
                    />
                    <Badge
                      variant="secondary"
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
                      variant="secondary"
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
                  {format(post.date, 'dd/MM/yyyy HH:mm')}
                </p>
              </div>
            </div>
          </Link>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem onClick={() => deletePost(post.id)}>
            Eliminar
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
