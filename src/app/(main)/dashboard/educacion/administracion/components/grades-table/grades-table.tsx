// components/AttendanceTable.tsx
'use client'
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/modules/common/components/table/table'
import { Evaluation, Prisma } from '@prisma/client'
import { ComboboxData } from '@/types/types'
import useGradesTableFilters from '../../lib/hooks/use-grades-table-filters'
import TableFilters from './table-filters'
import TableCellFilled from './table-cell-filled'
import TableCellEmpty from './table-cell-empty'
import TableHeadEvaluation from './table-head-evaluation'

export type StudentWithGrades = Prisma.StudentGetPayload<{
  include: {
    grades: {
      include: {
        evaluation: true
      }
    }
  }
}>
type Props = {
  studentsWithGrades: StudentWithGrades[]
  evaluations: Evaluation[]
  courses: ComboboxData[]
}
export default function GradesTable({
  studentsWithGrades,
  evaluations,
  courses,
}: Props) {
  const [searchText, setSearchText] = useState('')
  const {
    selectedCourse,
    setSelectedCourse,
    studentsByCourse,
    evaluationsByCourse,
  } = useGradesTableFilters({ studentsWithGrades, evaluations })

  return (
    <div className="flex flex-col gap-8">
      <TableFilters
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        courses={courses}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Estudiantes</TableHead>
            {evaluationsByCourse.map((evaluation) => (
              <TableHeadEvaluation
                key={evaluation.id}
                evaluation={evaluation}
              />
            ))}
            <TableHead>Promedio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentsByCourse.map((student) => (
            <TableRow key={student.id}>
              <TableCell
                style={{
                  display: 'flex',
                  width: '200px',
                }}
                className="font-semibold"
              >{`${student?.names} ${student?.lastNames} ${student.id_document_number}`}</TableCell>

              {evaluationsByCourse.map((evaluation) => {
                const studentData = student.grades.find(
                  (grade) =>
                    grade.evaluation.id === evaluation.id &&
                    selectedCourse === grade.evaluation.id_course
                )

                if (!studentData)
                  return (
                    <TableCellEmpty
                      key={evaluation.id}
                      id_evaluation={evaluation.id}
                      id_student={student.id}
                    />
                  )

                return (
                  <TableCellFilled
                    key={evaluation.id}
                    studentData={studentData}
                  />
                )
              })}

              <TableCell>
                {(() => {
                  const grades = student.grades.map((grade) => grade.grade)
                  const totalGrades = grades.reduce(
                    (acc, grade) => acc + grade,
                    0
                  )
                  const average = grades.length
                    ? (totalGrades / grades.length).toFixed(2)
                    : 0
                  return average
                })()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
