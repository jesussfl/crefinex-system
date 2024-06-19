'use client'
import { useEffect, useState, useTransition } from 'react'

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
import { Input } from '@/modules/common/components/input/input'
import {
  Courses,
  Evaluation,
  Prisma,
  Schedule,
  Student,
  Students_Courses,
} from '@prisma/client'
import { useRouter } from 'next/navigation'
import { CheckIcon, Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { createCourse, updateCourse } from '../../lib/actions'
import { cn } from '@/utils/utils'
import { ComboboxData } from '@/types/types'
import { getLevelsByModality } from '../../lib/actions/level-actions'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/modules/common/components/command/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { EvaluationFields } from './evaluation-fields'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
type StudentsRelation = Omit<
  Students_Courses,
  'id_course' | 'id' | 'fecha_creacion' | 'ultima_actualizacion'
>
type SchedulesRelation = Omit<Schedule, 'id' | 'course_id'>
type EvaluationsRelation = Omit<Evaluation, 'id' | 'course_id'>

export type FormValues = Omit<
  Courses,
  'id' | 'fecha_creacion' | 'ultima_actualizacion'
> & {
  schedules: SchedulesRelation[]
  evaluations: EvaluationsRelation[]
  // students: StudentsRelation[]
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
    mode: 'onSubmit',
    defaultValues,
  })

  const {
    fields,
    append: addSchedule,
    remove: removeSchedule,
  } = useFieldArray<FormValues>({
    control: form.control,
    name: `schedules`,
  })
  const [isPending, startTransition] = useTransition()
  const [levels, setLevels] = useState<ComboboxData[]>()
  const modality = form.watch('modality')

  useEffect(() => {
    getLevelsByModality(modality).then((data) => {
      const transformedData = data?.map((level) => ({
        value: level.id,
        label: `Nivel ${level.order} - ${level.name} `,
      }))

      setLevels(transformedData)
    })
  }, [modality])

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
              description: 'El curso se ha creado correctamente',
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
        className="flex-1 overflow-y-auto p-6 gap-12 mb-36"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col px-24 gap-3">
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
                value: 2000,
                message: 'Debe tener un máximo de 2000 carácteres',
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
                <FormDescription>
                  Tiene un maximo de 2000 carácteres
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="objective"
            rules={{
              maxLength: {
                value: 350,
                message: 'Debe tener un maximo de 350 carácteres',
              },
            }}
            render={({ field }) => (
              <FormItem className="mb-8">
                <FormLabel>Objetivo del Curso</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="syllabus"
            rules={{
              maxLength: {
                value: 2000,
                message: 'Debe tener un máximo de 2000 carácteres',
              },
            }}
            render={({ field }) => (
              <FormItem className="">
                <div className="flex flex-col gap-1">
                  <FormLabel>¿Qué aprenderás en el curso?</FormLabel>
                </div>
                <FormControl>
                  <textarea
                    id="what-you-will-learn"
                    rows={3}
                    className=" w-full rounded-md border-0 p-1.5 text-foreground bg-background ring-1  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Tiene un maximo de 2000 carácteres
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col ">
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
                    onValueChange={(value) => {
                      field.onChange(value)
                      //@ts-ignore
                      form.setValue('level_id', undefined)
                    }}
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
            {modality ? (
              <FormField
                control={form.control}
                name="level_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel:</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? levels?.find(
                                  (level) => level.value === field.value
                                )?.label
                              : 'Seleccionar nivel...'}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="PopoverContent">
                        <Command>
                          <CommandInput
                            placeholder="Buscar nivel..."
                            className="h-9"
                          />
                          <CommandEmpty>
                            No se encontaron resultados.
                          </CommandEmpty>
                          <CommandGroup>
                            {!levels ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              levels.map((level) => (
                                <CommandItem
                                  value={level.label}
                                  key={level.value}
                                  onSelect={() => {
                                    form.setValue('level_id', level.value, {
                                      shouldDirty: true,
                                    })
                                  }}
                                >
                                  {level.label}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      level.value === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))
                            )}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
          </div>

          <div className="flex flex-row flex-1 gap-5 ">
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
                    <DatePicker
                      placeholderText="Seleccionar fecha..."
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
                      locale={es}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
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
                    <DatePicker
                      placeholderText="Seleccionar fecha..."
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
                      locale={es}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Precio del curso en Dolares</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(value) => field.onChange(Number(value))}
                      value={field.value || undefined}
                    />
                  </FormControl>
                  <FormMessage />

                  <FormDescription>Este campo es opcional</FormDescription>
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-8 mt-4">
            <div className="flex flex-col gap-2">
              <FormLabel>Agrega horarios a este curso (Opcional):</FormLabel>
              <Button
                variant={'outline'}
                onClick={(e) => {
                  e.preventDefault()
                  addSchedule({
                    day: 'Lunes',
                    start: '',
                    end: '',
                  })
                }}
              >
                Agregar
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-center">
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`schedules.${index}.day`}
                  rules={{
                    required: 'Este campo es requerido',
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia</FormLabel>
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
                          <SelectItem value="Lunes">Lunes</SelectItem>
                          <SelectItem value="Martes">Martes</SelectItem>
                          <SelectItem value="Miercoles">Miercoles</SelectItem>
                          <SelectItem value="Jueves">Jueves</SelectItem>
                          <SelectItem value="Viernes">Viernes</SelectItem>
                          <SelectItem value="Sabado">Sabado</SelectItem>
                          <SelectItem value="Domingo">Domingo</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`schedules.${index}.start`}
                  rules={{
                    required: 'Este campo es requerido',
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>¿A qué hora inicia?</FormLabel>
                      <Input type="time" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`schedules.${index}.end`}
                  rules={{
                    required: 'Este campo es requerido',
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>¿A qué hora termina?</FormLabel>
                      <Input type="time" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  key={field.id}
                  variant={'destructive'}
                  onClick={(e) => {
                    e.preventDefault()
                    removeSchedule(index)
                  }}
                >
                  Eliminar
                </Button>
              </div>
            ))}

            <EvaluationFields />
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
