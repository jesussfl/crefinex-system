'use client'

import { Post, Prisma } from '@prisma/client'
import { SocialMediaPost } from './social-media-post'
import { useState } from 'react'
import { Input } from '@/modules/common/components/input/input'

import { usePostStore } from './lib/stores/posts-store'
import { useStore } from './lib/hooks'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { ScrollArea } from '@/modules/common/components/scroll-area/scroll-area'
export type StudentWithGrades = Prisma.StudentGetPayload<{
  include: {
    grades: {
      include: {
        evaluation: true
      }
    }
  }
}>

interface Props {
  posts: Post[]
}
export default function PostsContainerWithoutMonth({ posts }: Props) {
  const store = useStore(usePostStore, (state) => state)

  const [searchText, setSearchText] = useState('')

  const filteredPosts = posts.filter((post) => {
    const isPostFiltered =
      store?.selectedStatus !== 'Todos'
        ? post.status === store?.selectedStatus
        : true
    const postTitle =
      post?.title ||
      ''
        .toLowerCase()
        .replace(/[^a-zA-Z ]/g, '')
        .replace(/\s+/g, ' ')
        .trim()

    return (
      isPostFiltered &&
      !post.date &&
      postTitle.includes(searchText.toLowerCase().replace(/[^a-zA-Z ]/g, ''))
    )
  })

  if (filteredPosts.length === 0)
    return <div className="text-center">No hay posts</div>

  return (
    <div>
      <div className="flex justify-between items-center gap-4 mb-8">
        <p className="text-sm flex-1 font-medium">
          {`Creados: ${filteredPosts.length} ${
            filteredPosts.length > 1 ? 'publicaciones' : 'publicación'
          }`}
        </p>
        <div className="flex justify-end items-center gap-4">
          <Input
            type="text"
            placeholder="Buscar"
            className="w-[200px]"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            onValueChange={store?.handleStatusChange}
            defaultValue={store?.selectedStatus || 'Todos'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent className="w-[200px]">
              <ScrollArea>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Publicado">Publicados</SelectItem>
                <SelectItem value="Rechazado">Rechazado</SelectItem>
                <SelectItem value="En_Borrador">En_Borrador</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {filteredPosts.map((post) => (
          <SocialMediaPost
            key={post.id}
            post={post}
            className="w-[250px]"
            aspectRatio="square"
            width={250}
            height={330}
          />
        ))}
      </div>
    </div>
  )
}
