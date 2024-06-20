'use client'
import * as React from 'react'

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
import { Book } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createBook, updateBook } from '../../lib/actions/book-actions'
// import { createSystem, updateSystem } from '../../lib/actions/systems'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
registerLocale('es', es)
import 'react-datepicker/dist/react-datepicker.css'
interface Props {
  defaultValues?: Book
}

type FormValues = Book

export default function BooksForm({ defaultValues }: Props) {
  const { toast } = useToast()
  const isEditEnabled = !!defaultValues
  const router = useRouter()
  const form = useForm<FormValues>({
    defaultValues,
  })
  const { isDirty, dirtyFields } = useFormState({ control: form.control })
  const [isPending, startTransition] = React.useTransition()

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    startTransition(() => {
      if (!isEditEnabled) {
        createBook(values).then((data) => {
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
              title: 'Libro creado',
              description: 'El libro se ha creado correctamente',
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

      updateBook(values, defaultValues.id).then((data) => {
        if (data?.success) {
          toast({
            title: 'Libro actualizado',
            description: 'El libro se ha actualizado correctamente',
            variant: 'success',
          })
        }
        router.back()
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
                value: 200,
                message: 'Debe tener un maximo de 200 caracteres',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="synopsis"
            rules={{
              maxLength: {
                value: 600,
                message: 'Debe tener un máximo de 600 carácteres',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sinopsis</FormLabel>
                <FormControl>
                  <textarea
                    id="synopsis"
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
          <div className="flex flex-row gap-5">
            <FormField
              control={form.control}
              name="page_count"
              rules={{
                required: 'El número de paginas es requerido',
              }}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>N° de paginas</FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="completion_percentage"
              rules={{
                required: 'Este campo es requerido',
              }}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Estado del Libro en porcentaje</FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      max={100}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              rules={{
                required: 'Este campo es requerido',
              }}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Precio (Opcional): </FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || undefined}
                      onChange={(value) =>
                        field.onChange(Number(value.target.value))
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publication_date"
              render={({ field }) => (
                <FormItem className="flex flex-col flex-1">
                  <FormLabel>Fecha de Publicación</FormLabel>
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
          </div>
          <div className="flex flex-row gap-5">
            <FormField
              control={form.control}
              name="photoshop_files_url"
              rules={{
                maxLength: {
                  value: 300,
                  message: 'Debe tener un maximo de 300 caracteres',
                },
              }}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    Url de archivos en Photoshop (Opcional):
                  </FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="PDF_file_url"
              rules={{
                maxLength: {
                  value: 300,
                  message: 'Debe tener un maximo de 300 caracteres',
                },
              }}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Url de PDF (Opcional):</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="illustrations_url"
              rules={{
                maxLength: {
                  value: 300,
                  message: 'Debe tener un maximo de 300 caracteres',
                },
              }}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Url de ilustraciones (Opcional):</FormLabel>
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
            name="creation_notes"
            rules={{
              maxLength: {
                value: 2000,
                message: 'Debe tener un máximo de 2000 carácteres',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas</FormLabel>
                <FormControl>
                  <textarea
                    id="creation_notes"
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
