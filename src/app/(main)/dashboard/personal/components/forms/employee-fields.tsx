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
import { useEffect, useState } from 'react'
import { CldImage, CldUploadWidget } from 'next-cloudinary'
import { Button } from '@/modules/common/components/button'

import { Contract_Periods, Employee_Status } from '@prisma/client'
interface UploadedAssetData {
  public_id: string
  width: number
  height: number
  id: string
}

export const EmployeeFields = () => {
  const { control, setValue, watch, ...rest } = useFormContext()
  const [result, setResult] = useState<UploadedAssetData | null>(null)

  useEffect(() => {
    if (result) {
      setValue('employee_image', result.public_id)
    }
  }, [result, setValue])

  const handleDeleteImage = () => {
    setResult(null)
    setValue('employee_image', null)
  }
  return (
    <>
      <div className="flex items-start justify-between gap-5">
        <div className="flex flex-col gap-5">
          {/* SIGNED EXAMPLE */}
          <div className="flex flex-col gap-3">
            <FormLabel>Foto del empleado (Opcional):</FormLabel>
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
                  Subir Foto del Empleado
                </Button>
              )}
            </CldUploadWidget>
          </div>

          {result ? (
            <div className="flex gap-4">
              <CldImage
                src={watch('employee_image') || ''}
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
          name="status"
          rules={{
            required: 'El estado es requerido',
          }}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Estado del Empleado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(Employee_Status).map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-5 "></div>

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
              <FormLabel>Nombres del Empleado</FormLabel>
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
              <FormLabel>Apellidos del Empleado</FormLabel>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="V">Venezolano</SelectItem>
                  <SelectItem value="E">Extranjero</SelectItem>
                  <SelectItem value="P">Pasaporte</SelectItem>
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
              <FormLabel>Número de Documento:</FormLabel>
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
      <FormField
        control={control}
        name={`civil_status`}
        rules={{
          required: 'Campo requerido',
        }}
        render={({ field }) => (
          <FormItem className="flex-1 gap-4 justify-between">
            <FormLabel className="">Estado Civil</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Casado">Casado</SelectItem>
                <SelectItem value="Soltero">Soltero</SelectItem>
                <SelectItem value="Divorciado">Divorciado</SelectItem>
                <SelectItem value="Viudo">Viudo</SelectItem>
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="admission_date"
        rules={{
          required: 'Este campo es necesario',
        }}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Fecha de admisión </FormLabel>
            <FormControl>
              <Input
                type="date"
                id="fecha_admission"
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
      <div className="flex gap-4">
        <FormField
          control={control}
          name="start_date_contract"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Fecha de Inicio del Contrato</FormLabel>
              <FormDescription>Este campo es opcional</FormDescription>

              <FormControl>
                <Input
                  type="date"
                  id="start_date_contract"
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
          name="contract_period"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Periodo del Contrato </FormLabel>
              <FormDescription>
                Si no tiene contrato colocar indefinido
              </FormDescription>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(Contract_Periods).map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-4">
        <FormField
          control={control}
          name="birth_date"
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
          name="profession"
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
              <FormLabel>Profesion</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-4">
        <FormField
          control={control}
          name="work_position"
          rules={{
            required: 'Este campo es necesario',
            minLength: {
              value: 3,
              message: 'Debe tener al menos 3 caracteres',
            },
            maxLength: {
              value: 150,
              message: 'Debe tener un maximo de 150 caracteres',
            },
          }}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Cargo</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
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
      <div className="flex flex-1 gap-4">
        <FormField
          control={control}
          name="base_salary"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Salario Base en Bs</FormLabel>
              <FormDescription>Este campo es opcional</FormDescription>

              <FormControl>
                <Input type="number" {...field} value={field.value || ''} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="bonus"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Bonificación en BS</FormLabel>
              <FormDescription>Este campo es opcional</FormDescription>
              <FormControl>
                <Input type="number" {...field} value={field.value || ''} />
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
          render={({ field: { ref, ...field } }) => (
            <FormItem className="flex-1 gap-2">
              <FormLabel className="flex-1">{`Numero telefónico (Opcional):`}</FormLabel>
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
              <FormLabel>Correo electrónico:</FormLabel>
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
    </>
  )
}
