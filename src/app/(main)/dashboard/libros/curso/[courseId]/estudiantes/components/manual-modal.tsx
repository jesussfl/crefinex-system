'use client'
import { Input } from '@/modules/common/components/input/input'
import { useEffect, useState } from 'react'
import { cn } from '@/utils/utils'
import { useFormContext } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import { Box, Brush, Trash } from 'lucide-react'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'

// import { RenglonType } from '@/types/types'
import { Calendar } from '@/modules/common/components/calendar'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import ModalForm from '@/modules/common/components/modal-form'

import ChangeStudentStateForm from './forms/student-states-form'
import { StudentByCourseType } from './forms/columns/students-by-course-columns'
// import { DateTimePicker } from '@/modules/common/components/date-time-picker'
// import { DateTimePicker } from '@/modules/common/components/date-time-picker'
interface Props {
  id: number
  students: StudentByCourseType[]
}
export const ManualModalStudentsStates = ({ id, students }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toogleModal = () => setIsModalOpen(!isModalOpen)
  return (
    <ModalForm
      triggerName={`Cambiar estados de estudiantes`}
      closeWarning={false}
      open={isModalOpen}
      customToogleModal={toogleModal}
    >
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="text-md">Lista de Estudiantes</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangeStudentStateForm
            id={id}
            students={students}
            close={toogleModal}
          />
        </CardContent>
      </Card>
    </ModalForm>
  )
}
