import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/modules/common/components/form'
import { Input } from '@/modules/common/components/input/input'

import { useEffect, useState, useTransition } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import PhoneInput from 'react-phone-input-2'
import { CldImage, CldUploadWidget } from 'next-cloudinary'
import { Button } from '@/modules/common/components/button'
import { Switch } from '@/modules/common/components/switch/switch'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
interface UploadedAssetData {
  public_id: string
  width: number
  height: number
  id: string
}
export const RepresentativeFields = ({ index }: { index: number }) => {
  const { setValue, watch, ...rest } = useFormContext()
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<UploadedAssetData | null>(null)
  useEffect(() => {
    if (result) {
      setValue(
        `representatives.${index}.representative_image`,
        result.public_id
      )
    }
  }, [result, setValue, index])

  const handleDeleteImage = () => {
    setResult(null)
    setValue(`representatives.${index}.representative_image`, null)
  }
  return (
    <>
      <div className="flex flex-row gap-5">
        <div className="flex flex-col gap-3">
          <FormLabel>Foto del representante</FormLabel>
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
                Subir Foto del Representante
              </Button>
            )}
          </CldUploadWidget>
        </div>

        {result ||
        watch('representatives.' + index + '.representative_image') ? (
          <div className="flex gap-4">
            <CldImage
              src={
                watch('representatives.' + index + '.representative_image') ||
                ''
              }
              width={200}
              height={200}
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
        control={rest.control}
        name={`representatives.${index}.relationship`}
        rules={{
          required: 'Campo requerido',
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Parentesco del Representante</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Padre">Padre</SelectItem>
                <SelectItem value="Madre">Madre</SelectItem>
                <SelectItem value="Tio">Tio</SelectItem>
                <SelectItem value="Tia">Tia </SelectItem>
                <SelectItem value="Abuelo">Abuelo</SelectItem>
                <SelectItem value="Abuela">Abuela</SelectItem>
                <SelectItem value="Hermano">Hermano</SelectItem>
                <SelectItem value="Hermana">Hermana</SelectItem>
                <SelectItem value="Primo">Primo</SelectItem>
                <SelectItem value="Prima">Prima</SelectItem>

                <SelectItem value="Tutor Legal">Tutor Legal</SelectItem>
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-1 gap-4">
        <FormField
          control={rest.control}
          name={`representatives.${index}.names`}
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
              <FormLabel>Nombres del Representante</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={rest.control}
          name={`representatives.${index}.lastNames`}
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
              <FormLabel>Apellidos del Representante</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex flex-1 gap-4">
        <FormField
          control={rest.control}
          name={`representatives.${index}.id_document_type`}
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
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={rest.control}
          name={`representatives.${index}.id_document_number`}
          rules={{
            required: 'Este campo es necesario',
            minLength: {
              value: 3,
              message: 'Debe tener al menos 2 caracteres',
            },
            maxLength: {
              value: 25,
              message: 'Debe tener un maximo de 25 caracteres',
            },
          }}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Número de Documento</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-4">
        <FormField
          control={rest.control}
          name={`representatives.${index}.birthDate`}
          rules={{
            required: 'Este campo es necesario',
          }}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Fecha de Nacimiento</FormLabel>
              <FormControl>
                <FormField
                  control={rest.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Fecha de Nacimiento (Opcional):</FormLabel>
                      <FormControl>
                        <DatePicker
                          placeholderText="Seleccionar fecha"
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
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={rest.control}
          name={`representatives.${index}.gender`}
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
          control={rest.control}
          name={`representatives.${index}.country`}
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
          control={rest.control}
          name={`representatives.${index}.state`}
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
          control={rest.control}
          name={`representatives.${index}.city`}
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
        control={rest.control}
        name={`representatives.${index}.address`}
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
      <FormField
        control={rest.control}
        name={`representatives.${index}.phone_number`}
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
      <div className="flex gap-4">
        <FormField
          control={rest.control}
          name={`representatives.${index}.is_working`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-sm">¿Trabaja actualmente?</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={rest.control}
          name={`representatives.${index}.work_position`}
          disabled={!watch(`representatives.${index}.is_working`)}
          rules={{
            required:
              watch(`representatives.${index}.is_working`) &&
              'Este campo es requerido',
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
              <FormLabel>Posición laboral</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={rest.control}
        disabled={!watch(`representatives.${index}.is_working`)}
        name={`representatives.${index}.work_address`}
        rules={{
          required:
            watch(`representatives.${index}.is_working`) &&
            'Este campo es requerido',
          minLength: {
            value: 3,
            message: 'Debe tener al menos 3 caracteres',
          },
          maxLength: {
            value: 200,
            message: 'Debe tener un maximo de 200 caracteres',
          },
        }}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Dirección de trabajo (opcional):</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-1 gap-4">
        <FormField
          control={rest.control}
          name={`representatives.${index}.civil_status`}
          rules={{
            required: 'Campo requerido',
          }}
          render={({ field }) => (
            <FormItem className="flex-1 gap-4 justify-between">
              <FormLabel className="">Estado Civil del Representante</FormLabel>
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
          control={rest.control}
          name={`representatives.${index}.email`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Correo electrónico (opcional):</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  {...field}
                  value={field.value || ''}
                  disabled={isPending}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-1 gap-4">
        <FormField
          control={rest.control}
          name={`representatives.${index}.facebook`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Usuario de Facebook (opcional):</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={rest.control}
          name={`representatives.${index}.instagram`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Usuario de Instagram (opcional):</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-1 gap-4">
        <FormField
          control={rest.control}
          name={`representatives.${index}.tiktok`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Usuario de Tiktok (opcional):</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={rest.control}
          name={`representatives.${index}.youtube`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Usuario de Youtube (opcional):</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
