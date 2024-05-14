import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'
import { getRepresentativeById } from '../../lib/actions/representatives'
import RepresentativesForm from '../../components/forms/representatives-form'
import { useToast } from '@/modules/common/components/toast/use-toast'

export default async function Page({
  params: { representativeId },
}: {
  params: { representativeId: string }
}) {
  const representative = await getRepresentativeById(Number(representativeId))
  const { toast } = useToast()
  if (representative.error || !representative.data) {
    toast({
      description: representative.error,
      title: 'Error',
      variant: 'destructive',
    })
    return
  }

  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Editar representante</PageHeaderTitle>
      </PageHeader>
      <RepresentativesForm defaultValues={representative.data} />
    </>
  )
}
