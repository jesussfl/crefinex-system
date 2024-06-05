'use client'

import { TableCell } from '@/modules/common/components/table/table'
import { Prisma } from '@prisma/client'
import ModalForm from '@/modules/common/components/modal-form'
import UserGradeForm from '../forms/user-grade-form'

type Students_Grades = Prisma.Student_GradesGetPayload<{
  include: { evaluation: true }
}>

type Props = {
  key: number
  id_student: number
  id_evaluation: number
}
export default function TableCellEmpty({
  key,
  id_evaluation,
  id_student,
}: Props) {
  return (
    <TableCell key={key}>
      <ModalForm
        triggerName="Agregar Calificación"
        triggerVariant="default"
        className="w-[400px]"
        closeWarning={false}
      >
        <UserGradeForm id_student={id_student} id_evaluation={id_evaluation} />
      </ModalForm>
    </TableCell>
  )
}
