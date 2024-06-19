'use client'

import { Post, Prisma } from '@prisma/client'
import { SocialMediaPost } from './social-media-post'
import { useState } from 'react'
import { format } from 'date-fns'
import { Input } from '@/modules/common/components/input/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { es } from 'date-fns/locale'
import { ScrollArea } from '@/modules/common/components/scroll-area/scroll-area'

import { usePostStore } from './lib/stores/posts-store'
import { useStore } from './lib/hooks'

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
export default function PostsContainer({ posts }: Props) {
  const store = useStore(usePostStore, (state) => state)

  const [searchText, setSearchText] = useState('')

  if (!store?.currentMonth) return <div>No hay posts</div>
  const currentMonth = new Date(store?.currentMonth)
  const currentYear = currentMonth.getFullYear()

  const filteredPosts = posts.filter((post) => {
    const postDate = !post.date ? new Date() : new Date(post.date)
    const postMonth = postDate.getMonth()
    const postYear = postDate.getFullYear()
    const postTitle =
      post?.title ||
      ''
        .toLowerCase()
        .replace(/[^a-zA-Z ]/g, '')
        .replace(/\s+/g, ' ')
        .trim()

    return (
      postMonth === currentMonth.getMonth() &&
      postYear === currentMonth.getFullYear() &&
      postTitle.includes(searchText.toLowerCase().replace(/[^a-zA-Z ]/g, ''))
    )
  })

  if (posts.length === 0) return <div className="text-center">No hay posts</div>

  return (
    <div>
      <div className="flex justify-between items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold">
          {format(currentMonth, 'MMMM yyyy', { locale: es })
            .charAt(0)
            .toUpperCase() +
            format(currentMonth, 'MMMM yyyy', { locale: es }).slice(1)}
        </h1>
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
            onValueChange={store?.handleMonthChange}
            defaultValue={String(currentMonth.getMonth())}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                {Array.from({ length: 12 }).map((_, index) => (
                  <SelectItem key={index} value={String(index)}>
                    {format(new Date(2021, index), 'MMMM', { locale: es })
                      .charAt(0)
                      .toUpperCase() +
                      format(new Date(2021, index), 'MMMM', {
                        locale: es,
                      }).slice(1)}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
          <Select
            onValueChange={store?.handleYearChange}
            defaultValue={String(currentMonth.getFullYear())}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i
                return (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                )
              })}
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
