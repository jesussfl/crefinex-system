'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'

export const getAllBooks = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const books = await prisma.book.findMany()

  return books
}

export const getBookById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const book = await prisma.book.findUnique({
    where: {
      id,
    },
  })

  if (!book) {
    throw new Error('Book not found')
  }
  return book
}

export const createBook = async (data: Prisma.BookCreateInput) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.LIBROS,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.book.create({
    data,
  })

  await registerAuditAction('Se creó un nuevo libro: ' + data.title)
  revalidatePath('/dashboard/libros')

  return {
    error: false,
    success: 'Libro creado exitosamente',
  }
}

export const updateBook = async (data: Prisma.BookUpdateInput, id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.LIBROS,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.book.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction('Se actualizó el libro: ')
  revalidatePath('/dashboard/libros')

  return {
    error: false,
    success: 'Libro actualizado exitosamente',
  }
}
export const deleteBook = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.LIBROS,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.book.delete({
    where: {
      id,
    },
  })

  await registerAuditAction('Se elimino el libro: ' + id)
  revalidatePath('/dashboard/libros')

  return {
    error: false,
    success: 'Libro eliminado exitosamente',
  }
}
