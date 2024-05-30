import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/modules/common/components/form'
import { Input } from '@/modules/common/components/input/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import PhoneInput from 'react-phone-input-2'
import { Switch } from '@/modules/common/components/switch/switch'
import { useEffect, useState } from 'react'
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
import { CldImage, CldUploadWidget } from 'next-cloudinary'
import { Button } from '@/modules/common/components/button'
import { CheckIcon, Loader2 } from 'lucide-react'
import { ComboboxData } from '@/types/types'
import { getLevelsByModality } from '../../../cursos/lib/actions/level-actions'
import { getSchedulesByLevelAndModality } from '../../../cursos/lib/actions'
import { Documentos_Identidad } from '@prisma/client'
interface UploadedAssetData {
  public_id: string
  width: number
  height: number
  id: string
}

export const StudentFields = () => {
  const { control, setValue, watch, ...rest } = useFormContext()
  const [schedules, setSchedules] = useState<ComboboxData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<UploadedAssetData | null>(null)
  const [courses, setCourses] = useState<ComboboxData[]>([])
  const [levels, setLevels] = useState<ComboboxData[]>([])
  const [hasExtraActivity, setHasExtraActivity] = useState(false)
  const extraActivities = watch('extracurricular_activities')
  const level = watch('level_id')
  const modality = watch('modalidad')

  useEffect(() => {
    setHasExtraActivity(!!extraActivities)
  }, [extraActivities])

  useEffect(() => {
    setIsLoading(true)
    getLevelsByModality(modality).then((data) => {
      const transformedData = data?.map((level) => ({
        value: level.id,
        label: `Nivel ${level.order} - ${level.name} `,
      }))

      setLevels(transformedData)
    })
    setIsLoading(false)
  }, [modality])

  useEffect(() => {
    setIsLoading(true)

    getSchedulesByLevelAndModality(level, modality).then((data) => {
      const transformedSchedules = data.map((schedule) => {
        return {
          value: schedule.course_id,
          label: `${schedule.day} (${schedule.start} - ${schedule.end})`,
        }
      })
      setSchedules(transformedSchedules)
    })
    setIsLoading(false)
  }, [level, modality, setValue])

  useEffect(() => {
    if (result) {
      setValue('student_image', result.public_id)
    }
  }, [result, setValue])

  const handleDeleteImage = () => {
    setResult(null)
    setValue('student_image', null)
  }
  return (
    <>
      <div className="flex items-start justify-between gap-5">
        <div className="flex flex-col gap-5">
          {/* SIGNED EXAMPLE */}
          <div className="flex flex-col gap-3">
            <FormLabel>Foto del estudiante</FormLabel>
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
          </div>

          {result ? (
            <div className="flex gap-4">
              <CldImage
                src={watch('student_image') || ''}
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
            <FormItem className="flex-1">
              <FormLabel>Estado del Estudiante</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
      </div>
      <div className="flex gap-5 ">
        <FormField
          control={control}
          name="modalidad"
          rules={{
            required: 'Este campo es requerido',
          }}
          render={({ field }) => (
            <FormItem className="flex-1">
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

        <FormField
          control={control}
          name="level_id"
          render={({ field }) => (
            <FormItem className="flex-1">
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
                        ? levels?.find((level) => level.value === field.value)
                            ?.label
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
                    <CommandEmpty>No se encontaron resultados.</CommandEmpty>
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
      </div>

      <FormField
        control={control}
        name="id_current_course"
        rules={{
          required: 'Este campo es requerido',
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Horario del curso:</FormLabel>

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
                    <CommandEmpty>No se encontaron resultados.</CommandEmpty>
                    <CommandGroup>
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        schedules.map((schedule) => (
                          <CommandItem
                            value={schedule.label}
                            key={schedule.value}
                            onSelect={() => {
                              setValue('id_current_course', schedule.value, {
                                shouldDirty: true,
                              })
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
          </FormItem>
        )}
      />
      <div className="flex flex-1 gap-4">
        <FormField
          control={control}
          name="names"
          rules={{
            required: 'Este campo es necesario',
            minLength: {
              value: 3,
              message: 'Debe tener al menos 3 caracteres',
            },
            maxLength: {
              value: 100,
              message: 'Debe tener un maximo de 100 caracteres',
            },
          }}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Nombres del Estudiante</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lastNames"
          rules={{
            required: 'Este campo es necesario',
            minLength: {
              value: 3,
              message: 'Debe tener al menos 3 caracteres',
            },
            maxLength: {
              value: 100,
              message: 'Debe tener un maximo de 100 caracteres',
            },
          }}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Apellidos del Estudiante</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex flex-1 gap-4">
        <FormField
          control={control}
          name="id_document_type"
          rules={{
            required: 'Campo requerido',
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Documento de Identidad</FormLabel>
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
                  <SelectItem value="V">Venezolano</SelectItem>
                  <SelectItem value="E">Extranjero</SelectItem>
                  <SelectItem value="P">Pasaporte</SelectItem>
                  <SelectItem value="Partida_Nacimiento">
                    Partida de Nacimiento
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="id_document_number"
          disabled={
            watch('id_document_type') === 'Partida_Nacimiento' ||
            !watch('id_document_type')
          }
          rules={{
            required: 'Este campo es necesario',
            validate: (value) => {
              const documentType = watch('id_document_type')
              if (documentType === 'V' || documentType === 'E') {
                return (
                  /^\d{7,10}$/.test(value) ||
                  'Debe ser un número de 7 a 10 dígitos'
                )
              }
              if (documentType === 'P') {
                return (
                  /^[a-zA-Z0-9]{5,15}$/.test(value) ||
                  'Debe tener entre 5 y 15 caracteres alfanuméricos'
                )
              }
              return true
            },
          }}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Número de Documento</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ''}
                  onKeyDown={(e) => {
                    const documentType = watch('id_document_type')
                    const allowedKeys = [
                      'Backspace',
                      'Tab',
                      'ArrowLeft',
                      'ArrowRight',
                      'Delete',
                    ]
                    if (allowedKeys.includes(e.key)) {
                      return
                    }
                    if (documentType === 'V' || documentType === 'E') {
                      if (!/^\d$/.test(e.key)) {
                        e.preventDefault()
                      }
                    } else if (documentType === 'P') {
                      if (!/^[a-zA-Z0-9]$/.test(e.key)) {
                        e.preventDefault()
                      }
                    }
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex gap-4">
        <FormField
          control={control}
          name="birthDate"
          rules={{
            required: 'Este campo es necesario',
          }}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Fecha de Nacimiento</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  id="birthDate"
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
                  max={new Date().toISOString().split('T')[0]}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="gender"
          rules={{
            required: 'Campo requerido',
          }}
          render={({ field }) => (
            <FormItem className="flex-1 gap-4 justify-between">
              <FormLabel className="">Sexo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Femenino">Femenino</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-1 gap-4">
        <FormField
          control={control}
          name="country"
          rules={{
            required: 'Este campo es necesario',
            minLength: {
              value: 3,
              message: 'Debe tener al menos 3 caracteres',
            },
            maxLength: {
              value: 100,
              message: 'Debe tener un maximo de 100 caracteres',
            },
          }}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Pais</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="state"
          rules={{
            required: 'Este campo es necesario',
            minLength: {
              value: 3,
              message: 'Debe tener al menos 3 caracteres',
            },
            maxLength: {
              value: 100,
              message: 'Debe tener un maximo de 100 caracteres',
            },
          }}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="city"
          rules={{
            required: 'Este campo es necesario',
            minLength: {
              value: 3,
              message: 'Debe tener al menos 3 caracteres',
            },
            maxLength: {
              value: 100,
              message: 'Debe tener un maximo de 100 caracteres',
            },
          }}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Ciudad</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="address"
        rules={{
          required: 'Este campo es necesario',
          minLength: {
            value: 3,
            message: 'Debe tener al menos 3 caracteres',
          },
          maxLength: {
            value: 100,
            message: 'Debe tener un maximo de 100 caracteres',
          },
        }}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Dirección</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex  gap-5">
        <FormField
          control={control}
          name={`phone_number`}
          rules={{
            required: 'Este campo es requerido',
          }}
          render={({ field: { ref, ...field } }) => (
            <FormItem className="flex-1 gap-2">
              <FormLabel className="flex-1">{`Numero telefónico:`}</FormLabel>
              <div className="">
                <FormControl>
                  <PhoneInput
                    country={'ve'}
                    // placeholder="Ingresa tu numero telefónico"
                    {...field}
                    masks={{
                      ve: '....-...-....',
                    }}
                    onChange={(value: string, data: any) => {
                      const phoneNumber = value.split(data.dialCode)[1]
                      const formattedPhoneNumber = `+${
                        data.dialCode
                      }-${phoneNumber.slice(0, 4)}-${phoneNumber.slice(
                        4,
                        7
                      )}-${phoneNumber.slice(7)}`
                      field.onChange(formattedPhoneNumber)
                    }}
                    countryCodeEditable={false}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-4 items-center">
        <FormLabel>¿Tiene alguna actividad extra-curricular?</FormLabel>
        <FormDescription>No</FormDescription>
        <Switch
          checked={hasExtraActivity}
          onCheckedChange={(value) => {
            if (value) {
              setHasExtraActivity(true)
            } else {
              setValue('extracurricular_activities', null, {
                shouldDirty: true,
              })
              setHasExtraActivity(false)
            }
          }}
        />
        <FormDescription>Si</FormDescription>
      </div>
      {hasExtraActivity && (
        <>
          <FormField
            control={control}
            name="extracurricular_activities"
            rules={{
              required: 'Este campo es necesario',
              minLength: {
                value: 10,
                message: 'Debe tener al menos 10 carácteres',
              },
              maxLength: {
                value: 200,
                message: 'Debe tener un máximo de 200 carácteres',
              },
            }}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Actividad Extracurricular</FormLabel>
                <FormControl>
                  <textarea
                    id="extracurricular_activities"
                    rows={3}
                    className=" w-full rounded-md border-0 p-1.5 text-foreground bg-background ring-1  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...field}
                    onChange={(e) => {
                      if (rest.formState.errors[field.name]) {
                        rest.clearErrors(field.name)
                      }
                      setValue(field.name, e.target.value, {
                        shouldDirty: true,
                      })
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </>
  )
}
