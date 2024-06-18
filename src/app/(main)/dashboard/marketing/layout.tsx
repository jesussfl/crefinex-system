import { validateSectionsAndPermissions } from '@/lib/data/validate-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { redirect } from 'next/navigation'
import { PostStoreProvider } from './lib/providers'
export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthorized = await validateSectionsAndPermissions({
    sections: [SECTION_NAMES.MARKETING],
  })

  if (!isAuthorized) {
    redirect('/dashboard')
  }
  return <> {children} </>
}
