'use client'
import { useEffect, useState, useTransition } from 'react'

import { useForm, SubmitHandler, useFormState } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { useToast } from '@/modules/common/components/toast/use-toast'
import { Input } from '@/modules/common/components/input/input'
import {
  Documentos_Identidad,
  Genders,
  Modalities,
  Student,
  Student_Status,
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
import { createStudent, updateStudent } from '../../lib/actions/students'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/modules/common/components/accordion'
import { RepresentativeFields } from './representative-fields'
import { getSchedulesByLevelAndModality } from '../../../cursos/lib/actions'
import { ComboboxData, RepresentativeFormType } from '@/types/types'
import { StudentFields } from './student-fields'
import { getDirtyValues } from '@/utils/helpers/get-dirty-values'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import { cn } from '@/utils/utils'
import { CaretSortIcon } from '@radix-ui/react-icons'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/modules/common/components/command/command'
import { ScrollArea } from '@/modules/common/components/scroll-area/scroll-area'
import { CldImage, CldUploadButton, CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { getLevelsByModality } from '../../../cursos/lib/actions/level-actions'
interface UploadedAssetData {
  public_id: string
  width: number
  height: number
  id: string
}
export type StudentFormType = {
  names: string
  lastNames: string
  birthDate: Date
  current_status: Student_Status

  id_current_course: number
  modalidad: Modalities
  gender: Genders

  phone_number?: string | null
  email?: string | null

  address?: string | null
  country: string
  city: string
  state: string
  level_id: number
  extracurricular_activities?: string | null

  id_document_type: Documentos_Identidad
  id_document_number?: string | null
  id_document_image?: string | null
  student_image?: string | null

  representative: RepresentativeFormType | null | undefined
}
type EditForm = {
  defaultValues: StudentFormType
  studentId: number
}
type CreateForm = {
  defaultValues?: undefined
  studentId?: undefined
}
type FormValues = StudentFormType

type Props = EditForm | CreateForm
type SelectOption = {
  value: number
  label: string
}

export default function StudentsForm({ defaultValues, studentId }: Props) {
  const { toast } = useToast()
  const router = useRouter()

  const { control, setValue, ...rest } = useForm<FormValues>({
    defaultValues,
    mode: 'onSubmit',
  })
  const { dirtyFields } = useFormState({ control })
  const [isPending, startTransition] = useTransition()
  const [schedules, setSchedules] = useState<SelectOption[]>([])
  const [result, setResult] = useState<UploadedAssetData | null>(null)
  const [courses, setCourses] = useState<SelectOption[]>([])
  const [levels, setLevels] = useState<SelectOption[]>([])
  const [isImageDeleted, setIsImageDeleted] = useState<boolean>(false)
  const level = rest.watch('level_id')
  const modality = rest.watch('modalidad')

  useEffect(() => {
    getLevelsByModality(modality).then((data) => {
      const transformedData = data?.map((level) => ({
        value: level.id,
        label: `Nivel ${level.order} - ${level.name} `,
      }))

      setLevels(transformedData)
    })
  }, [modality])
  useEffect(() => {
    getSchedulesByLevelAndModality(level, modality).then((data) => {
      const transformedSchedules = data.map((schedule) => {
        return {
          value: schedule.course_id,
          label: `${schedule.day} (${schedule.start} - ${schedule.end})`,
        }
      })
      setSchedules(transformedSchedules)
    })
  }, [level, modality, setValue])
  useEffect(() => {
    if (result) {
      setValue('student_image', result.public_id)
    }
  }, [result, setValue])
  const handleDeleteImage = () => {
    setResult(null)
    setValue('student_image', null)
    setIsImageDeleted(true)
  }
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const isEditing = !!defaultValues

    startTransition(() => {
      if (!isEditing) {
        createStudent({ ...values, modalidad: modality }).then((data) => {
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
              title: 'Estudiante creado',
              description: 'El estudiante se ha creado correctamente',
              variant: 'success',
            })

            router.back()
          }
        })

        return
      }

      // if (!isDirty) {
      //   toast({
      //     title: 'No se han detectado cambios',
      //   })

      //   return
      // }

      //@ts-ignore

      updateStudent(values, studentId).then((data) => {
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
            title: 'Estudiante actualizado',
            description: 'El estudiante se ha actualizado correctamente',
            variant: 'success',
          })
        }
        router.back()
      })
    })
  }

  return (
    <Form
      {...{
        control,
        setValue,
        ...rest,
      }}
    >
      <form
        style={{
          scrollbarGutter: 'stable both-edges',
        }}
        className="flex-1 overflow-y-auto p-6 gap-8 mb-36"
        onSubmit={rest.handleSubmit(onSubmit)}
      >
        <div className="px-24">
          <div>
            <div className="flex flex-col gap-5 mb-5">
              {/* SIGNED EXAMPLE */}
              <CldUploadWidget
                options={{
                  sources: ['local'],
                  multiple: false,
                }}
                signatureEndpoint="/api/sign-image"
                onSuccess={(result) => {
                  setResult(result?.info as UploadedAssetData)
                }}
              >
                {({ open }) => (
                  <Button
                    variant={'default'}
                    onClick={(e) => {
                      e.preventDefault()
                      open()
                    }}
                  >
                    Subir Foto del Estudiante
                  </Button>
                )}
              </CldUploadWidget>

              {result ? (
                <div className="flex gap-4">
                  <CldImage
                    src={rest.watch('student_image') || ''}
                    width={result.width}
                    height={result.height}
                    alt="Uploaded Image"
                  />
                  <Button
                    variant={'destructive'}
                    onClick={(e) => {
                      e.preventDefault()
                      handleDeleteImage()
                    }}
                  >
                    Eliminar Imagen
                  </Button>
                </div>
              ) : null}
            </div>
            <FormField
              control={control}
              name="current_status"
              rules={{
                required: 'Tipo de documento es requerido',
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado del Estudiante</FormLabel>
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
                      <SelectItem value="Cursando">Cursando</SelectItem>
                      <SelectItem value="Rezagado">Rezagado</SelectItem>
                      <SelectItem value="Pre-inscrito">Pre-inscrito</SelectItem>
                      <SelectItem value="Inscrito">Inscrito</SelectItem>
                      <SelectItem value="Reservado">Reservado</SelectItem>
                      <SelectItem value="Culminado">Culminado</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col ">
              <FormField
                control={control}
                name="modalidad"
                rules={{
                  required: 'Este campo es requerido',
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modalidad</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        //@ts-ignore
                        setValue('level_id', undefined)
                        //@ts-ignore
                        setValue('id_current_course', undefined)
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
                  control={control}
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
                                      setValue('level_id', level.value, {
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

            <FormField
              control={control}
              name="id_current_course"
              rules={{
                required: 'Este campo es requerido',
              }}
              render={({ field }) => (
                <FormItem className="flex flex-1 justify-between gap-4 items-center">
                  <FormLabel>Horario del curso:</FormLabel>
                  <div className="w-[70%]">
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
                              ? schedules.find(
                                  (schedule) => schedule.value === field.value
                                )?.label
                              : 'Seleccionar horario'}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="PopoverContent">
                        <Command>
                          <CommandInput
                            placeholder="Buscar horario..."
                            className="h-9"
                          />
                          <ScrollArea className="max-h-56">
                            <CommandEmpty>
                              No se encontaron resultados.
                            </CommandEmpty>
                            <CommandGroup>
                              {isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                schedules.map((schedule) => (
                                  <CommandItem
                                    value={schedule.label}
                                    key={schedule.value}
                                    onSelect={() => {
                                      setValue(
                                        'id_current_course',
                                        schedule.value,
                                        {
                                          shouldDirty: true,
                                        }
                                      )
                                    }}
                                  >
                                    {schedule.label}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        schedule.value === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                ))
                              )}
                            </CommandGroup>
                          </ScrollArea>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Datos del Estudiante</AccordionTrigger>
                <AccordionContent>
                  <StudentFields />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Datos del Representante</AccordionTrigger>
                <AccordionContent>
                  <RepresentativeFields />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-4">
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
