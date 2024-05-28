import PageForm from '@/modules/layout/components/page-form'

import FormatSelector from '@/modules/common/components/format-selector'
import { getDataToExportPreInscription } from '../../lib/actions/students'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const guideData = await getDataToExportPreInscription(Number(id))

  return (
    <PageForm title="Exportar" backLink="/dashboard/educaciones/estudiantes">
      <div className="flex flex-col gap-4 justify-center items-center">
        <FormatSelector data={guideData} type="pre-inscripcion" />
      </div>
    </PageForm>
  )
}
