// import { useFieldArray, useFormContext } from 'react-hook-form'
// import {
//   FormInstructions,
//   FormInstructionsDescription,
//   FormInstructionsTitle,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
//   FormDescription,
// } from '@/modules/common/components/form'
// import { Input } from '@/modules/common/components/input/input'
// import { Combobox } from '@/modules/common/components/combobox'

// import { Loader2 } from 'lucide-react'
// import { useTransition, useState, useEffect } from 'react'

// import Link from 'next/link'
// import { Button, buttonVariants } from '@/modules/common/components/button'
// import { cn } from '@/utils/utils'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/modules/common/components/select/select'
// import { format } from 'date-fns'
// import PhoneInput from 'react-phone-input-2'
// import { FormValues } from './courses-form'
// import { Courses, Schedule } from '@prisma/client'

// export const CourseSchedulesInput = () => {
//   const {control} = useFormContext()
//   const { fields, append, remove } = useFieldArray<FormValues>({
//     control: control,
//     name: `schedules`,
//   })
//   const [isPending, startTransition] = useTransition()

//   return (
//     <>
//       {fields.map((field, index) => (
//         <>
//           <div className="flex gap-4">
//             <FormField
//               key={field.id}
//               control={form.control}
//               name={`schedules.${index}.day`}
//               rules={{
//                 required: 'Este campo es requerido',
//               }}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Dia</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value || ''}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Seleccionar..." />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="Lunes">Lunes</SelectItem>
//                       <SelectItem value="Martes">Martes</SelectItem>
//                       <SelectItem value="Miercoles">Miercoles</SelectItem>
//                       <SelectItem value="Jueves">Jueves</SelectItem>
//                       <SelectItem value="Viernes">Viernes</SelectItem>
//                       <SelectItem value="Sabado">Sabado</SelectItem>
//                       <SelectItem value="Domingo">Domingo</SelectItem>
//                     </SelectContent>
//                   </Select>

//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               key={field.id}
//               control={form.control}
//               name={`schedules.${index}.start`}
//               rules={{
//                 required: 'Este campo es requerido',
//               }}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>¿A qué hora inicia?</FormLabel>
//                   <Input type="time" {...field} />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               key={field.id}
//               control={form.control}
//               name={`schedules.${index}.end`}
//               rules={{
//                 required: 'Este campo es requerido',
//               }}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>¿A qué hora termina?</FormLabel>
//                   <Input type="time" {...field} />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </>
//       ))}
//       <Button variant={'outline'} onClick={append}>
//         Agregar
//       </Button>
//     </>
//   )
// }
