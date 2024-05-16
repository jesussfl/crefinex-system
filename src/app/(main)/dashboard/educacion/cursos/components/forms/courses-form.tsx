'use client'
import { useCallback, useEffect, useState, useTransition } from 'react'

import {
  useForm,
  SubmitHandler,
  useFormState,
  useFieldArray,
} from 'react-hook-form'
import { Button, buttonVariants } from '@/modules/common/components/button'
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
import { Input } from '@/modules/common/components/input/input'
import {
  Courses,
  Modalities,
  Prisma,
  Student,
  Students_Courses,
} from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Loader2, Plus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { createCourse, updateCourse } from '../../lib/actions'
import { format } from 'date-fns'
import ModalForm from '@/modules/common/components/modal-form'
import { DataTable } from '@/modules/common/components/table/data-table'
import { columns } from '../../../estudiantes/columns'
import {
  CardDescription,
  CardTitle,
} from '@/modules/common/components/card/card'
import Link from 'next/link'
import { cn } from '@/utils/utils'
import { SelectedStudentsColumns } from '../columns/selected-students-columns'

type StudentsRelation = Omit<
  Students_Courses,
  'id_course' | 'id' | 'fecha_creacion' | 'ultima_actualizacion'
>

type FormValues = Omit<
  Courses,
  'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  students: StudentsRelation[]
}
interface Props {
  defaultValues?: FormValues
  students: Student[]
}

export default function CoursesForm({ defaultValues, students }: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditEnabled = !!defaultValues
  const form = useForm<FormValues>({
    defaultValues,
  })
  const { append, remove } = useFieldArray<FormValues>({
    control: form.control,
    name: `students`,
  })
  const [isPending, startTransition] = useTransition()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedData, setSelectedData] = useState<Student[]>([])
  const [selectedItems, setSelectedItems] = useState<{
    [key: number]: boolean
  }>({})

  useEffect(() => {
    if (isEditEnabled) {
      const students = defaultValues.students
      //@ts-ignore
      const studentsData = students.map((student) => student.student) //TODO: revisar el tipado
      const studentsSelected = students.reduce(
        (acc, student) => {
          acc[student.id_student] = true
          return acc
        },
        {} as { [key: number]: boolean }
      )

      setSelectedItems(studentsSelected)
      setSelectedData(studentsData)
    }
  }, [isEditEnabled, defaultValues])

  const handleTableSelect = useCallback(
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

  const deleteItem = (index: number) => {
    setSelectedData((prev) => {
      return prev.filter((item) => {
        const nuevoObjeto = { ...selectedItems }
        if (item.id === selectedData[index].id) {
          delete nuevoObjeto[item.id]
          setSelectedItems(nuevoObjeto)
        }
        return item.id !== selectedData[index].id
      })
    })
    remove(index)
  }

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const isEditing = !!defaultValues

    startTransition(() => {
      if (!isEditing) {
        createCourse(values).then((data) => {
          if (data?.error) {
            toast({
              title: 'Parece que hubo un problema',
              description: data.error,
              variant: 'destructive',
            })

            return
          }

          if (data?.success) {
            toast({
              title: 'Curso creado',
              description: 'El estudiante se ha creado correctamente',
              variant: 'success',
            })

            router.back()
          }
        })

        return
      }
      //@ts-ignore
      updateCourse(values, defaultValues.id).then((data) => {
        if (data?.error) {
          toast({
            title: 'Parece que hubo un problema',
            description: data.error,
            variant: 'destructive',
          })

          return
        }

        if (data?.success) {
          toast({
            title: 'Curso actualizado',
            description: 'El curso se ha creado correctamente',
            variant: 'success',
          })

          router.back()
        }

        return
      })
    })
  }

  return (
    <Form {...form}>
      <form
        style={{
          scrollbarGutter: 'stable both-edges',
        }}
        className="flex-1 overflow-y-auto p-6 gap-8 mb-36"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="px-24">
          <FormField
            control={form.control}
            name="title"
            rules={{
              required: 'Este campo es necesario',
              minLength: {
                value: 3,
                message: 'Debe tener al menos 3 caracteres',
              },
              maxLength: {
                value: 150,
                message: 'Debe tener un maximo de 150 carácteres',
              },
            }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Título del Curso</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            rules={{
              maxLength: {
                value: 200,
                message: 'Debe tener un máximo de 200 carácteres',
              },
            }}
            render={({ field }) => (
              <FormItem className="">
                <div className="flex flex-col gap-1">
                  <FormLabel>Descripción</FormLabel>
                </div>
                <FormControl>
                  <textarea
                    id="descripcion"
                    rows={3}
                    className=" w-full rounded-md border-0 p-1.5 text-foreground bg-background ring-1  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-5 ">
            <FormField
              control={form.control}
              name="level"
              rules={{
                required: 'El nivel es requerida',
              }}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Nivel del curso</FormLabel>
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
                      <SelectItem value="Inteligencia Emocional - Nivel 1">
                        Inteligencia Emocional - Nivel 1
                      </SelectItem>
                      <SelectItem value="El Dinero - Nivel 2">
                        El Dinero - Nivel 2
                      </SelectItem>
                      <SelectItem value="Finanzas Personales - Nivel 3">
                        Finanzas Personales - Nivel 3
                      </SelectItem>
                      <SelectItem value="El Ahorro - Nivel 4">
                        El Ahorro - Nivel 4
                      </SelectItem>
                      <SelectItem value="El Banco - Nivel 5">
                        El Banco - Nivel 5
                      </SelectItem>
                      <SelectItem value="Emprendimiento Personal - Nivel 6">
                        Emprendimiento Personal - Nivel 6
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modality"
              rules={{
                required: 'La modalidad es requerida',
              }}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Modalidad del curso</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Presencial">Presencial</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-row flex-1 items-center gap-5 ">
            <FormField
              control={form.control}
              name="start_date"
              rules={{
                required: 'Este campo es necesario',
              }}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Fecha de Inicio</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      id="start_date"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) => {
                        field.onChange(new Date(e.target.value))
                      }}
                      className="w-full"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              rules={{
                required: 'Este campo es necesario',
              }}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Fecha de Culminación</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      id="end_date"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) => {
                        field.onChange(new Date(e.target.value))
                      }}
                      className="w-full"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-1 flex-row gap-8 items-center justify-between">
            <FormDescription className="w-[20rem]">
              Selecciona los estudiantes que pertenecen a este curso
            </FormDescription>
            <ModalForm
              triggerName="Seleccionar Estudiantes"
              closeWarning={false}
              // customToogleModal={toogleModal}
            >
              <div className="flex flex-col gap-4 p-8">
                <CardTitle>
                  Selecciona los estudiantes que pertenecen a este curso
                </CardTitle>
                <CardDescription>
                  Selecciona los estudiantes que pertenecen a este curso, luego
                  puedes agregarlos a la lista Si no encuentras el estudiante
                  que buscas, puedes registrarlo
                  <Link
                    href="/dashboard/educacion/estudiantes/estudiante/nuevo"
                    className={cn(buttonVariants({ variant: 'link' }), 'mx-4')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Estudiante
                  </Link>
                </CardDescription>

                <DataTable
                  columns={columns}
                  data={students}
                  onSelectedRowsChange={handleTableSelect}
                  isColumnFilterEnabled={false}
                  selectedData={selectedItems}
                  setSelectedData={setSelectedItems}
                />
              </div>
            </ModalForm>
          </div>
          <div className="flex flex-col my-5">
            <p className="text-md font-bold">Estudiantes Seleccionados</p>
            <DataTable
              columns={SelectedStudentsColumns}
              data={selectedData}
              isColumnFilterEnabled={false}
            />
          </div>
        </div>

        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-8">
          <Button variant="default" type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Guardar'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
