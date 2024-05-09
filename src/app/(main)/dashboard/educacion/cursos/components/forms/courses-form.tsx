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
import { Modalities } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { createCourse } from '../../lib/actions'
import { format } from 'date-fns'

type FormValues = {
  title: string
  description: string
  start_date?: Date
  end_date?: Date
  modality: Modalities
  price?: number
  image?: string
}
interface Props {
  defaultValues?: FormValues
}

export default function CoursesForm({ defaultValues }: Props) {
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
        //@ts-ignore
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
              description: 'El estudiante se ha creado correctamente',
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
                value: 200,
                message: 'Debe tener un máximo de 200 carácteres',
              },
            }}
            render={({ field }) => (
              <FormItem className="">
                <div className="flex flex-col gap-1">
                  <FormLabel>Descripción</FormLabel>
                  {/* <FormDescription>
                      Redacta  por el cual se está despachando el
                      material, renglones, etc...
                    </FormDescription> */}
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

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="modality"
            rules={{
              required: 'La modalidad es requerida',
            }}
            render={({ field }) => (
              <FormItem className="flex flex-1 items-center gap-4 justify-between">
                <FormLabel className="mb-3">Modalidad del curso</FormLabel>
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
                    <SelectItem value="Presencial">Presencial</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`start_date`}
            render={({ field }) => {
              return (
                <FormItem className="flex flex-row flex-1 items-center gap-5 ">
                  <div className="w-[20rem]">
                    <FormLabel>Fecha de Inicio</FormLabel>
                    <FormDescription>
                      Selecciona la fecha en la que comenzará el curso
                    </FormDescription>
                  </div>
                  <div className="flex-1 w-full">
                    <Input
                      type="datetime-local"
                      id="start_date"
                      {...field}
                      value={
                        field.value
                          ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm")
                          : ''
                      }
                      onBlur={() => {
                        form.trigger('start_date')
                      }}
                      onChange={(e) => {
                        if (!e.target.value) {
                          form.resetField('end_date')
                          return
                        }

                        form.setValue('end_date', new Date(e.target.value))
                      }}
                      className="w-full"
                    />

                    <FormMessage />
                  </div>
                </FormItem>
              )
            }}
          />
          <FormField
            control={form.control}
            name={`end_date`}
            render={({ field }) => {
              return (
                <FormItem className="flex flex-row flex-1 items-center gap-5 ">
                  <div className="w-[20rem]">
                    <FormLabel>Fecha de Culminación</FormLabel>
                    <FormDescription>
                      Selecciona la fecha en la que terminará el curso
                    </FormDescription>
                  </div>
                  <div className="flex-1 w-full">
                    <Input
                      type="datetime-local"
                      id="end_date"
                      {...field}
                      value={
                        field.value
                          ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm")
                          : ''
                      }
                      onBlur={() => {
                        form.trigger('end_date')
                      }}
                      onChange={(e) => {
                        if (!e.target.value) {
                          form.resetField('end_date')
                          return
                        }

                        form.setValue('end_date', new Date(e.target.value))
                      }}
                      className="w-full"
                    />

                    <FormMessage />
                  </div>
                </FormItem>
              )
            }}
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
