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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import { CaretSortIcon } from '@radix-ui/react-icons'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/modules/common/components/command/command'
import { ScrollArea } from '@/modules/common/components/scroll-area/scroll-area'
import { CheckIcon, Loader2 } from 'lucide-react'
import { cn } from '@/utils/utils'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'

export const ExtraInfoForm = () => {
  const { control, setValue, watch, ...rest } = useFormContext()

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-md">
            Representante autorizado para retirar al estudiante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name={`secondary_representative.relationship`}
            rules={{
              required: 'Campo requerido',
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parentesco</FormLabel>
                <FormDescription>
                  Este representante también está autorizado de retirar al
                  estudiante
                </FormDescription>
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
              control={control}
              name={`secondary_representative.names`}
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
              control={control}
              name={`secondary_representative.last_names`}
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
              control={control}
              name={`secondary_representative.id_document_type`}
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
              control={control}
              name={`secondary_representative.id_document_number`}
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
            <FormField
              control={control}
              name={`secondary_representative.phone_number`}
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
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-md">
            Representante para llamar en caso de emergencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name={`emergency_representative.relationship`}
            rules={{
              required: 'Campo requerido',
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Parentesco del representante de emergencia
                </FormLabel>
                <FormDescription>
                  Se podrá llamar a este representante
                </FormDescription>
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
              control={control}
              name={`emergency_representative.names`}
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
              control={control}
              name={`emergency_representative.last_names`}
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
              control={control}
              name={`emergency_representative.id_document_type`}
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
              control={control}
              name={`emergency_representative.id_document_number`}
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
          <FormField
            control={control}
            name={`emergency_representative.phone_number`}
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
        </CardContent>
      </Card>
    </>
  )
}
