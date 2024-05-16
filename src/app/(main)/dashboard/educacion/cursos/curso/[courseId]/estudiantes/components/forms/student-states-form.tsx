'use client'
import * as React from 'react'

import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { useToast } from '@/modules/common/components/toast/use-toast'

import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'

import { updateManyStudentStatusByCourse } from '@/app/(main)/dashboard/educacion/estudiantes/lib/actions/students'
import { Student, Student_Status, Students_Courses } from '@prisma/client'
import ModalForm from '@/modules/common/components/modal-form'
import { CardTitle } from '@/modules/common/components/card/card'
import { DataTable } from '@/modules/common/components/table/data-table'
import { columns } from '@/app/(main)/dashboard/educacion/estudiantes/columns'
type StudentsRelation = Omit<
  Students_Courses,
  'id_course' | 'id' | 'fecha_creacion' | 'ultima_actualizacion'
>
// type User = Prisma.UsuarioGetPayload<{ include: { rol: true } }>
type FormValues = {
  students: StudentsRelation[]
  status: Student_Status
}
interface Props {
  id: number
  students: Student[]
  close?: () => void
}

export default function ChangeStudentStateForm({ id, students, close }: Props) {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<FormValues>({})
  const [isPending, startTransition] = React.useTransition()
  const { append, remove } = useFieldArray<FormValues>({
    control: form.control,
    name: `students`,
  })
  const [selectedData, setSelectedData] = React.useState<Student[]>([])
  const [selectedItems, setSelectedItems] = React.useState<{
    [key: number]: boolean
  }>({})

  const handleTableSelect = React.useCallback(
    (lastSelectedRow: any) => {
      if (lastSelectedRow) {
        append({
          id_student: lastSelectedRow.id,
          status: null,
        })
        setSelectedData((prev) => {
          if (prev.find((item) => item.id === lastSelectedRow.id)) {
            const index = prev.findIndex(
              (item) => item.id === lastSelectedRow.id
            )
            remove(index)
            return prev.filter((item) => item.id !== lastSelectedRow.id)
          } else {
            return [...prev, lastSelectedRow]
          }
        })
      }
    },
    [append, remove]
  )

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const studentIdsData = values.students.map((student) => student.id_student)
    startTransition(() => {
      updateManyStudentStatusByCourse(values.status, studentIdsData, id).then(
        (data) => {
          if (data?.success) {
            toast({
              title: 'Estudiante actualizado',
              description: 'El estudiante se ha actualizado correctamente',
              variant: 'success',
            })

            if (close) {
              close()
            } else {
              router.back()
            }
          }
        }
      )
    })
  }

  return (
    <Form {...form}>
      <form
        style={{
          scrollbarGutter: 'stable both-edges',
        }}
        className="flex-1 overflow-y-auto px-8 gap-8 mb-36"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="status"
          rules={{
            required: 'El nivel es requerida',
          }}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Estado del o los estudiantes</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Culminado">Culminado</SelectItem>
                  <SelectItem value="Desertor">Desertor</SelectItem>
                  <SelectItem value="Cursando">Cursando</SelectItem>
                  <SelectItem value="Preinscrito">Preinscrito</SelectItem>
                  <SelectItem value="No_Admitido">No admitido</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-4">
          <FormDescription>
            Selecciona los estudiantes que pertenecen a este curso
          </FormDescription>

          <DataTable
            columns={columns}
            data={students}
            onSelectedRowsChange={handleTableSelect}
            isColumnFilterEnabled={false}
            selectedData={selectedItems}
            setSelectedData={setSelectedItems}
          />
        </div>
        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-8">
          <Button variant="default" type="submit">
            Guardar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
