'use client'
import { useTransition } from 'react'

import { useForm, SubmitHandler, useFormState } from 'react-hook-form'
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
import { Documentos_Identidad, Representative, Student } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { CalendarIcon, Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { createStudent } from '../../lib/actions/students'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import { Calendar } from '@/modules/common/components/calendar'
import { cn } from '@/utils/utils'
import { format } from 'date-fns'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { handleEmailValidation } from '@/utils/helpers/validate-email'
import { createRepresentative } from '../../lib/actions/representatives'
interface Props {
  defaultValues?: Representative
}

type FormValues = Representative

export default function RepresentativesForm({ defaultValues }: Props) {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<FormValues>({
    defaultValues,
  })
  const { isDirty, dirtyFields } = useFormState({ control: form.control })
  const [isPending, startTransition] = useTransition()

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const isEditing = !!defaultValues

    startTransition(() => {
      if (!isEditing) {
        createRepresentative(values).then((data) => {
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
              title: 'Representante creado',
              description: 'El representante se ha creado correctamente',
              variant: 'success',
            })

            router.back()
          }
        })

        return
      }

      if (!isDirty) {
        toast({
          title: 'No se han detectado cambios',
        })

        return
      }

      //   const dirtyValues = getDirtyValues(dirtyFields, values) as FormValues

      //   updateCategory(defaultValues.id, dirtyValues).then((data) => {
      //     if (data?.success) {
      //       toast({
      //         title: 'Accesorio actualizado',
      //         description: 'El accesorio se ha actualizado correctamente',
      //         variant: 'success',
      //       })
      //     }
      //     router.back()
      //   })
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
          <div className="flex flex-1 gap-4">
            <FormField
              control={form.control}
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
                  <FormLabel>Nombres del Representante</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
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
              control={form.control}
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
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id_document_number"
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
              control={form.control}
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
                          ? format(new Date(field.value), 'yyyy-MM-dd')
                          : ''
                      }
                      onBlur={() => {
                        form.trigger('birthDate')
                      }}
                      onChange={(e) => {
                        if (!e.target.value) {
                          //@ts-ignore
                          form.setValue('birthDate', null)
                          return
                        }

                        form.setValue('birthDate', new Date(e.target.value))
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
              name="gender"
              rules={{
                required: 'Campo requerido',
              }}
              render={({ field }) => (
                <FormItem className="flex-1 gap-4 justify-between">
                  <FormLabel className="">Género</FormLabel>
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
              control={form.control}
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
              control={form.control}
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
          </div>
          <FormField
            control={form.control}
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
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Correo electrónico</FormLabel>
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
