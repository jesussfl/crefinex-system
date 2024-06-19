// 'use client'
// import * as React from 'react'

// import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
// import { Button } from '@/modules/common/components/button'
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/modules/common/components/form'
// import { DialogFooter } from '@/modules/common/components/dialog/dialog'
// import { useToast } from '@/modules/common/components/toast/use-toast'

// import { useRouter } from 'next/navigation'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/modules/common/components/select/select'

// import { updateManyStudentStatusByCourse } from '@/app/(main)/dashboard/educacion/estudiantes/lib/actions/students'
// import { Student, Student_Status, Students_Courses } from '@prisma/client'
// import { DataTable } from '@/modules/common/components/table/data-table'
// import {
//   StudentByCourseType,
//   studentsByCourseColumns,
// } from './columns/students-by-course-columns'
// type StudentsRelation = Omit<
//   Students_Courses,
//   'id_course' | 'id' | 'fecha_creacion' | 'ultima_actualizacion'
// >
// // type User = Prisma.UsuarioGetPayload<{ include: { rol: true } }>
// type FormValues = {
//   students: StudentsRelation[]
//   status: Student_Status
// }
// interface Props {
//   id: number
//   students: StudentByCourseType[]
//   selectedStudents?: number[]
//   close?: () => void
// }

// export default function ChangeStudentStateForm({ id, students, selectedStudents, close }: Props) {
//   const { toast } = useToast()
//   const router = useRouter()

//   const form = useForm<FormValues>({})
//   const [isPending, startTransition] = React.useTransition()

//   const [serials, setSerials] = React.useState<Student[]>([])
//   const [selectedRowIdentifiers, setSelectedRowIdentifiers] = React.useState<{
//     [key: number]: boolean
//   }>({})
//   const [selectedData, setSelectedData] = React.useState<Student[]>([])
//   React.useEffect(() => {
//     if (selectedStudents) {
//       const renglones = defaultValues.renglones
//       // @ts-ignore
//       const renglonesData = renglones.map((item) => item.renglon) //TODO: revisar el tipado
//       const selections = renglones.reduce(
//         (acc, item) => {
//           acc[item.id_renglon] = true
//           return acc
//         },
//         {} as { [key: number]: boolean }
//       )
//       setSelectedRowIdentifiers(selections)
//       setSelectedRowIdentifiers(renglonesData)
//     }
//   }, [defaultValues])

//   const onSubmit: SubmitHandler<FormValues> = async (values) => {
//     const studentIdsData = values.students.map((student) => student.id_student)
//     startTransition(() => {
//       updateManyStudentStatusByCourse(values.status, studentIdsData, id).then(
//         (data) => {
//           if (data?.success) {
//             toast({
//               title: 'Estudiante actualizado',
//               description: 'El estudiante se ha actualizado correctamente',
//               variant: 'success',
//             })

//             if (close) {
//               close()
//             } else {
//               router.back()
//             }
//           }
//         }
//       )
//     })
//   }

//   return (
//     <Form {...form}>
//       <form
//         style={{
//           scrollbarGutter: 'stable both-edges',
//         }}
//         className="flex-1 overflow-y-auto px-8 gap-8 mb-36"
//         onSubmit={form.handleSubmit(onSubmit)}
//       >
//         <FormField
//           control={form.control}
//           name="status"
//           rules={{
//             required: 'El nivel es requerida',
//           }}
//           render={({ field }) => (
//             <FormItem className="flex-1">
//               <FormLabel>Estado del o los estudiantes</FormLabel>
//               <Select
//                 onValueChange={field.onChange}
//                 defaultValue={field.value || ''}
//               >
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Seleccionar..." />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   <SelectItem value="Culminado">Culminado</SelectItem>
//                   <SelectItem value="Desertor">Desertor</SelectItem>
//                   <SelectItem value="Cursando">Cursando</SelectItem>
//                   <SelectItem value="Preinscrito">Preinscrito</SelectItem>
//                   <SelectItem value="No_Admitido">No admitido</SelectItem>
//                 </SelectContent>
//               </Select>

//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <div className="flex flex-col gap-4">
//           <FormDescription>
//             Selecciona los estudiantes para relacionarlos con el curso
//           </FormDescription>

//           <DataTable
//             columns={studentsByCourseColumns}
//             data={students}
//             onSelectedRowsChange={setSelectedData}
//             isColumnFilterEnabled={false}
//             selectedData={selectedRowIdentifiers}
//             setSelectedData={setSelectedRowIdentifiers}
//           />
//         </div>
//         <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-8">
//           <Button variant="default" type="submit">
//             Guardar
//           </Button>
//         </DialogFooter>
//       </form>
//     </Form>
//   )
// }
