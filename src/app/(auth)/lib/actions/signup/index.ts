'use server'

import * as z from 'zod'
import bcrypt from 'bcryptjs'

import { RegisterSchema } from '@/utils/schemas'
import { getUserByEmail } from '@/lib/data/get-user-byEmail'

import { prisma } from '@/lib/prisma'

export const signup = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, password, name, adminPassword } = validatedFields.data

  if (adminPassword !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    return {
      error: 'Contraseña de administrador incorrecta',
      field: 'adminPassword',
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: 'Este correo ya está registrado', field: 'email' }
  }

  try {
    await prisma.$transaction(async (prisma) => {
      // Parte 1: Contar Usuarios
      const users_count = await prisma.usuario.count()

      // Determinar el rol y su descripción basados en el conteo de usuarios
      const rolData = {
        rol: users_count === 0 ? 'Administrador' : 'Básico',
        descripcion:
          users_count === 0
            ? 'Permitir acceso a todas las funcionalidades'
            : 'Acceso limitado a algunas funcionalidades',
      }

      // Parte 2: Crear o Conectar Rol
      const rol = await prisma.rol.upsert({
        where: { rol: rolData.rol },
        update: {},
        create: rolData,
      })

      // Si es el primer usuario, crear o conectar permiso
      let permiso
      if (users_count === 0) {
        permiso = await prisma.permiso.upsert({
          where: { key: 'TODAS:FULL' },
          update: {},
          create: {
            permiso: 'Acceso de superusuario',
            key: 'TODAS:FULL',
            descripcion: 'Allows access to all features',
          },
        })

        await prisma.roles_Permisos.create({
          data: {
            rol_nombre: rol.rol,
            permiso_key: permiso.key,
            active: true,
          },
        })
      }

      // Parte 4: Asignar Rol y Permiso al Usuario
      await prisma.usuario.create({
        data: {
          nombre: name,
          email,
          contrasena: hashedPassword,
          rol: {
            connect: {
              id: rol.id,
            },
          },
        },
      })
    })

    console.log('Usuario creado exitosamente')
    return { success: 'Registrado correctamente' }
  } catch (error) {
    console.error('Error al crear el usuario:', error)
  } finally {
    await prisma.$disconnect()
  }
}

type SignupByFacialID = {
  email: string
  facialID: string
  adminPassword: string
  name: string
}
export const signupByFacialID = async ({
  email,
  facialID,
  adminPassword,
  name,
}: SignupByFacialID) => {
  const existingUser = await getUserByEmail(email)
  const eixstingUserByFacialID = await prisma.usuario.findUnique({
    where: {
      facialID,
    },
  })

  if (existingUser || eixstingUserByFacialID) {
    return {
      error: 'Esta persona ya está registrada',
      field: 'email',
    }
  }

  try {
    await prisma.$transaction(async (prisma) => {
      // Parte 1: Contar Usuarios
      const users_count = await prisma.usuario.count()

      // Determinar el rol y su descripción basados en el conteo de usuarios
      const rolData = {
        rol: users_count === 0 ? 'Administrador' : 'Básico',
        descripcion:
          users_count === 0
            ? 'Permitir acceso a todas las funcionalidades'
            : 'Acceso limitado a algunas funcionalidades',
      }

      // Parte 2: Crear o Conectar Rol
      const rol = await prisma.rol.upsert({
        where: { rol: rolData.rol },
        update: {},
        create: rolData,
      })

      // Si es el primer usuario, crear o conectar permiso
      let permiso
      if (users_count === 0) {
        permiso = await prisma.permiso.upsert({
          where: { key: 'FULL-TODAS' },
          update: {},
          create: {
            permiso: 'Acceso de superusuario',
            key: 'FULL-TODAS',
            descripcion: 'Allows access to all features',
          },
        })

        await prisma.roles_Permisos.create({
          data: {
            rol_nombre: rol.rol,
            permiso_key: permiso.key,
            active: true,
          },
        })
      }

      // Parte 4: Asignar Rol y Permiso al Usuario
      await prisma.usuario.create({
        data: {
          nombre: name,
          email,
          facialID,
          rol: {
            connect: {
              id: rol.id,
            },
          },
        },
      })
    })

    console.log('Usuario creado exitosamente')
  } catch (error) {
    console.error('Error al crear el usuario:', error)
  } finally {
    await prisma.$disconnect()
  }
}

export const getAllUsers = async () => {
  try {
    const users = await prisma.usuario.findMany()
    return users
  } catch (error) {
    console.log(error, 'ERROOR')
    return null
  }
}
