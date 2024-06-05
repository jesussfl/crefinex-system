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
  studentData: Students_Grades
}
export default function TableCellFilled({ key, studentData }: Props) {
  return (
    <TableCell key={key}>
      <div>
        <div>{`Ponderación: ${studentData.weighing}`}</div>
        <div>{`Calificación: ${studentData.grade}`}</div>
        <div>{`Observación: ${studentData.observation}`}</div>
        <ModalForm
          triggerName="Editar Calificación"
          triggerVariant="outline"
          className="w-[400px]"
          closeWarning={false}
        >
          <UserGradeForm
            id={studentData.id}
            defaultValues={{
              observation: studentData?.observation,
              grade: studentData.grade,
              weighing: studentData.weighing,
              date_done: studentData.date_done,
              id_evaluation: studentData.id_evaluation,
              id_student: studentData.id_student,
            }}
            id_student={studentData.id_student}
            id_evaluation={studentData.id_evaluation}
          />
        </ModalForm>
      </div>
    </TableCell>
  )
}
