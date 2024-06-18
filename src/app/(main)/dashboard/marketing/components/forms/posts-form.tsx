'use client'
import { useEffect, useState, useTransition } from 'react'

import { useForm, SubmitHandler, useFormContext } from 'react-hook-form'
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
import { Employee, Post, Post_States } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import 'react-phone-input-2/lib/style.css'

import { Input } from '@/modules/common/components/input/input'
import { CldImage, CldUploadWidget } from 'next-cloudinary'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import { format } from 'date-fns'
import { createPost, updatePost } from '../../lib/actions/post-actions'

type EditForm = {
  defaultValues: Post
  postId: number
}
type CreateForm = {
  defaultValues?: undefined
  postId?: undefined
}
type FormValues = Post

type Props = EditForm | CreateForm
interface UploadedAssetData {
  public_id: string
  width: number
  height: number
  id: string
}
export default function PostsForm({ defaultValues, postId }: Props) {
  const { toast } = useToast()
  const router = useRouter()

  const { control, setValue, formState, trigger, ...rest } =
    useForm<FormValues>({
      defaultValues,
      mode: 'all',
    })

  const [isPending, startTransition] = useTransition()

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<UploadedAssetData | null>(null)

  useEffect(() => {
    if (result) {
      setValue('image', result.public_id)
    }
  }, [result, setValue])

  const handleDeleteImage = () => {
    setResult(null)
    setValue('image', null)
  }
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const isEditing = !!defaultValues

    if (!isEditing) {
      createPost(values).then((data) => {
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
            title: 'Post creado',
            description: 'El post se ha creado correctamente',
            variant: 'success',
          })
          router.back()
        }
      })
      return
    }
    updatePost(values, postId).then((data) => {
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
          title: 'Post actualizado',
          description: 'El post se ha actualizado correctamente',
          variant: 'success',
        })
      }
      router.back()
    })
  }
  return (
    <div
      style={{
        scrollbarGutter: 'stable both-edges',
      }}
      className="flex-1 overflow-y-auto gap-8"
    >
      <Form
        {...{
          control,
          setValue,
          formState,
          trigger,
          ...rest,
        }}
      >
        <form onSubmit={rest.handleSubmit(onSubmit)}>
          <div className="px-24 space-y-4 mb-36">
            <div className="flex flex-row gap-5">
              <div className="flex flex-col gap-3">
                <FormLabel>Portada del post (Opcional):</FormLabel>
                <CldUploadWidget
                  config={{}}
                  options={{
                    sources: ['local'],
                    multiple: false,
                    language: 'es',
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
                      Subir Portada del Post
                    </Button>
                  )}
                </CldUploadWidget>
              </div>

              {result || rest.watch('image') ? (
                <div className="flex gap-4">
                  <CldImage
                    src={rest.watch('image') || ''}
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
            <div className="flex gap-3">
              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Estado del Post </FormLabel>

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
                        {Object.keys(Post_States).map((key) => (
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
              <FormField
                control={control}
                name={`date`}
                rules={{
                  required: true,
                }}
                render={({ field }) => {
                  return (
                    <FormItem className="flex-1">
                      <FormLabel>Fecha de Publicación</FormLabel>

                      <Input
                        type="datetime-local"
                        id="date"
                        {...field}
                        value={
                          field.value
                            ? format(
                                new Date(field.value),
                                "yyyy-MM-dd'T'HH:mm"
                              )
                            : ''
                        }
                        onBlur={() => {
                          trigger('date')
                        }}
                        onChange={(e) => {
                          if (!e.target.value) {
                            //@ts-ignore
                            setValue('date', null)
                            return
                          }

                          setValue('date', new Date(e.target.value))
                        }}
                        className="w-full"
                      />

                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
            <FormField
              control={control}
              name="title"
              rules={{
                maxLength: {
                  value: 150,
                  message: 'Debe tener un maximo de 150 caracteres',
                },
              }}
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Título del Post</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    Es necesario que el titulo del post sea corto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              rules={{
                required: 'Este campo es necesario',
                minLength: {
                  value: 10,
                  message: 'Debe tener al menos 10 carácteres',
                },
                maxLength: {
                  value: 1500,
                  message: 'Debe tener un máximo de 1500 carácteres',
                },
              }}
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <textarea
                      id="description"
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
              control={control}
              name="copy"
              rules={{
                required: 'Este campo es necesario',
                minLength: {
                  value: 10,
                  message: 'Debe tener al menos 10 carácteres',
                },
                maxLength: {
                  value: 1500,
                  message: 'Debe tener un máximo de 1500 carácteres',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Copy</FormLabel>
                  <FormControl>
                    <textarea
                      id="copy"
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
              control={control}
              name="hashtags"
              rules={{
                required: 'Este campo es necesario',
                minLength: {
                  value: 10,
                  message: 'Debe tener al menos 10 carácteres',
                },
                maxLength: {
                  value: 400,
                  message: 'Debe tener un máximo de 400 carácteres',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hashtags</FormLabel>
                  <FormControl>
                    <textarea
                      id="hashtags"
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

          <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-3">
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
    </div>
  )
}
