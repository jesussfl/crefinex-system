import {
  Home,
  Users2,
  Settings,
  FolderSearch,
  HelpCircle,
  UserCircle,
  Book,
  BookUser,
  PencilRuler,
  BookOpen,
  UserCog2,
} from 'lucide-react'
import { SideMenuItem } from '@/types/types'

/**
 * Object array which represents the items in a side menu.
 * Each object in the array has properties such as title (the display name of the menu item), path (the URL path associated with the menu item),
 * and icon (the icon to display next to the menu item).
 * Some of the menu items also have a submenu property, indicating that they have sub-menu items.
 * The sub-menu items are defined in the submenuItems property, which is also an array of objects with similar properties.
 * 
 * @type {SideMenuItem[]}
 * @memberof SideMenuItem
 * @example
 * const sideMenuItems = [
 *   {
 *     title: 'Home',
 *     path: '/',
 *     icon: <Home size={DEFAULT_ICON_SIZE} />,
 *   },
 }
 ]
 */

export enum SECTION_NAMES {
  INICIO = 'INICIO',
  CURSOS = 'CURSOS',
  EDUCACION = 'EDUCACION',
  PERSONAL = 'PERSONAL',
  USUARIOS = 'USUARIOS',
  ESTUDIANTES = 'ESTUDIANTES',
  AUDITORIA = 'AUDITORIA',
  ADMINISTRACION_ACADEMICA = 'ADMINISTRACION_ACADEMICA',
  CONFIGURACION = 'CONFIGURACION',
  LIBROS = 'LIBROS',
  AYUDA = 'AYUDA',
  TODAS = 'TODAS',
}

export const SIDE_MENU_ITEMS: SideMenuItem[] = [
  {
    title: 'Inicio',
    path: '/dashboard',
    identifier: SECTION_NAMES.INICIO,
    icon: Home,
  },
  {
    title: 'Educación',
    path: '/dashboard/educacion',
    identifier: SECTION_NAMES.EDUCACION,
    icon: Book,
    submenu: true,
    submenuItems: [
      {
        title: 'Administración',
        path: '/dashboard/educacion/administracion',
        identifier: SECTION_NAMES.ADMINISTRACION_ACADEMICA,
        icon: PencilRuler,
        requiredPermissions: [
          SECTION_NAMES.ADMINISTRACION_ACADEMICA,
          SECTION_NAMES.TODAS,
        ],
      },
      {
        title: 'Cursos',
        path: '/dashboard/educacion/cursos',
        identifier: SECTION_NAMES.CURSOS,
        icon: BookUser,
        requiredPermissions: [SECTION_NAMES.CURSOS, SECTION_NAMES.TODAS],
      },
      {
        title: 'Estudiantes',
        path: '/dashboard/educacion/estudiantes',
        identifier: SECTION_NAMES.ESTUDIANTES,
        icon: Users2,
        requiredPermissions: [SECTION_NAMES.ESTUDIANTES, SECTION_NAMES.TODAS],
      },
    ],
  },

  {
    title: 'Personal',
    path: '/dashboard/personal',
    identifier: SECTION_NAMES.PERSONAL,
    icon: UserCog2,
    requiredPermissions: [SECTION_NAMES.PERSONAL, SECTION_NAMES.TODAS],
  },
  {
    title: 'Usuarios',
    path: '/dashboard/usuarios',
    identifier: SECTION_NAMES.USUARIOS,
    icon: UserCircle,
    requiredPermissions: [SECTION_NAMES.USUARIOS, SECTION_NAMES.TODAS],
  },
  {
    title: 'Libros',
    path: '/dashboard/libros',
    identifier: SECTION_NAMES.LIBROS,
    icon: BookOpen,
    requiredPermissions: [SECTION_NAMES.LIBROS, SECTION_NAMES.TODAS],
  },
  {
    title: 'Auditoria',
    path: '/dashboard/auditoria',
    identifier: SECTION_NAMES.AUDITORIA,
    icon: FolderSearch,
    requiredPermissions: [SECTION_NAMES.AUDITORIA, SECTION_NAMES.TODAS],
  },

  {
    title: 'Respaldo',
    identifier: SECTION_NAMES.CONFIGURACION,
    path: '/dashboard/configuracion',
    icon: Settings,
    requiredPermissions: [SECTION_NAMES.CONFIGURACION, SECTION_NAMES.TODAS],
  },
  {
    title: 'Ayuda',
    identifier: SECTION_NAMES.AYUDA,
    path: '/dashboard/ayuda',
    icon: HelpCircle,
    requiredPermissions: [SECTION_NAMES.AYUDA, SECTION_NAMES.TODAS],
  },
]
