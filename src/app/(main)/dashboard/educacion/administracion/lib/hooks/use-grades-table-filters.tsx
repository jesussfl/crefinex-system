import { useEffect, useState } from 'react'
import { StudentWithGrades } from '../../components/grades-table/grades-table'
import { Evaluation } from '@prisma/client'

type Props = {
  studentsWithGrades: StudentWithGrades[]
  evaluations: Evaluation[]
}
export default function useGradesTableFilters({
  studentsWithGrades,
  evaluations,
}: Props) {
  const [selectedCourse, setSelectedCourse] = useState<number>()
  const [studentsByCourse, setStudentsByCourse] = useState<StudentWithGrades[]>(
    []
  )
  const [evaluationsByCourse, setEvaluationsByCourse] = useState<Evaluation[]>(
    []
  )
  const [searchText, setSearchText] = useState('')
  useEffect(() => {
    if (selectedCourse) {
      setStudentsByCourse(
        studentsWithGrades.filter(
          (student) => student.id_current_course === selectedCourse
        )
      )

      setEvaluationsByCourse(
        evaluations.filter(
          (evaluation) => evaluation.id_course === selectedCourse
        )
      )
    }
  }, [selectedCourse, studentsWithGrades, evaluations])
  return {
    selectedCourse,
    setSelectedCourse,
    searchText,
    setSearchText,
    studentsByCourse,
    evaluationsByCourse,
  }
}
