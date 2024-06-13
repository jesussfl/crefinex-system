'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'

export const getAllPosts = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const posts = await prisma.post.findMany()

  return posts
}

export const getPostsById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  })

  if (!post) {
    throw new Error('Post not found')
  }
  return post
}

export const createPost = async (data: Prisma.PostCreateInput) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.MARKETING,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.post.create({
    data,
  })

  await registerAuditAction('Se creó un nuevo post: ' + data.title)
  revalidatePath('/dashboard/marketing')

  return {
    error: false,
    success: 'Post creado exitosamente',
  }
}

export const updatePost = async (data: Prisma.PostUpdateInput, id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.MARKETING,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.post.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction('Se actualizó el post: ')
  revalidatePath('/dashboard/marketing')

  return {
    error: false,
    success: 'Post actualizado exitosamente',
  }
}
export const deletePost = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.MARKETING,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.post.delete({
    where: {
      id,
    },
  })

  await registerAuditAction('Se elimino el post: ' + id)
  revalidatePath('/dashboard/marketing')

  return {
    error: false,
    success: 'Post eliminado exitosamente',
  }
}
