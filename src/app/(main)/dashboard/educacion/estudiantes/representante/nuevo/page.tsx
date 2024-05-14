import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'
import RepresentativesForm from '../../components/forms/representatives-form'

export default async function Page() {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Agregar Representante</PageHeaderTitle>
      </PageHeader>
      <RepresentativesForm />
    </>
  )
}
