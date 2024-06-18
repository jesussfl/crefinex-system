// components/AttendanceTable.tsx
'use client'

import { Evaluation, Post, Prisma } from '@prisma/client'
import { ComboboxData } from '@/types/types'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/modules/common/components/card/card'
import { SocialMediaPost } from './social-media-post'
import previousTuesday from 'date-fns/esm/previousTuesday'
import { useState } from 'react'
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns'
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
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [searchText, setSearchText] = useState('')
  const [selectedYear, setSelectedYear] = useState<number>(
    currentMonth.getFullYear()
  )

  const handleMonthChange = (value: string) => {
    const newMonth = new Date(currentMonth.setMonth(parseInt(value)))
    setCurrentMonth(newMonth)
  }

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value)
    setSelectedYear(newYear)
    const newMonth = new Date(currentMonth.setFullYear(newYear))
    setCurrentMonth(newMonth)
  }

  const filteredPosts = posts.filter((post) => {
    const postDate = new Date(post.date)
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
            onValueChange={handleMonthChange}
            defaultValue={String(currentMonth.getMonth())}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                {Array.from({ length: 12 }).map((_, index) => (
                  <SelectItem key={index} value={String(index)}>
                    {format(new Date(2021, index), 'MMMM', { locale: es })}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
          <Select
            onValueChange={handleYearChange}
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
