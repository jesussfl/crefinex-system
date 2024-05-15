import {
  Home,
  Users2,
  Settings,
  FolderSearch,
  HelpCircle,
  UserCircle,
  Book,
  BookUser,
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

  CONFIGURACION = 'CONFIGURACION',

  AYUDA = 'AYUDA',
  TODAS = 'TODAS',
}

export const SIDE_MENU_ITEMS: SideMenuItem[] = [
  {
    title: 'Inicio',
    path: '/dashboard',
    icon: Home,
  },
  {
    title: 'Educación',
    path: '/dashboard/educacion',
    icon: Book,
    submenu: true,
    submenuItems: [
      {
        title: 'Cursos',
        path: '/dashboard/educacion/cursos',
        icon: BookUser,
        requiredPermissions: [SECTION_NAMES.CURSOS, SECTION_NAMES.TODAS],
      },
      {
        title: 'Estudiantes',
        path: '/dashboard/educacion/estudiantes',
        icon: Users2,
        requiredPermissions: [SECTION_NAMES.ESTUDIANTES, SECTION_NAMES.TODAS],
      },
    ],
  },

  {
    title: 'Usuarios',
    path: '/dashboard/usuarios',
    icon: UserCircle,
    requiredPermissions: [SECTION_NAMES.USUARIOS, SECTION_NAMES.TODAS],
  },

  {
    title: 'Auditoria',
    path: '/dashboard/auditoria',
    icon: FolderSearch,
    requiredPermissions: [SECTION_NAMES.AUDITORIA, SECTION_NAMES.TODAS],
  },

  {
    title: 'Configuraciones',
    path: '/dashboard/configuracion',
    icon: Settings,
  },
  {
    title: 'Ayuda',
    path: '/dashboard/ayuda',
    icon: HelpCircle,
    requiredPermissions: [SECTION_NAMES.AYUDA, SECTION_NAMES.TODAS],
  },
]
