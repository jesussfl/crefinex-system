'use client'
import * as React from 'react'

import { useForm, SubmitHandler } from 'react-hook-form'
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

import { useRouter } from 'next/navigation'

import { Evaluation, Weighings } from '@prisma/client'
import { Input } from '@/modules/common/components/input/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'
import {
  createGradeByStudentAndEvaluation,
  updateGradeByStudentAndEvaluation,
} from '../../lib/actions'
import { EvaluationFields } from '../../../cursos/components/forms/evaluation-fields'
import { createEvaluation } from '../../lib/actions/evaluation-actions'

type EditForm = {
  defaultValues: Evaluation
  id: number
}

type CreateForm = {
  defaultValues?: undefined
  id?: undefined
}

type Props = {
  id_course: number

  close?: () => void
} & (EditForm | CreateForm)

export default function EvaluationForm({
  id_course,
  defaultValues,
  id,
  close,
}: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditEnabled = !!defaultValues
  const form = useForm<Evaluation>({ defaultValues })
  const [isPending, startTransition] = React.useTransition()

  const onSubmit: SubmitHandler<Evaluation> = async (values) => {
    // const studentIdsData = values.students.map((student) => student.id_student)
    startTransition(() => {
      if (!isEditEnabled) {
        createEvaluation({
          ...values,
          id_course,
        }).then((data) => {
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
              title: 'Evaluación registrada',
              description: 'La evaluación se ha registrado correctamente',
              variant: 'success',
            })

            router.push('/dashboard/educacion/administracion?')
            close?.()
          }
        })

        return
      }

      //   updateGradeByStudentAndEvaluation(values, id).then((data) => {
      //     if (data?.error) {
      //       toast({
      //         title: 'Parece que hubo un problema',
      //         description: data.error,
      //         variant: 'destructive',
      //       })

      //       return
      //     }

      //     if (data?.success) {
      //       toast({
      //         title: 'Calificación actualizada',
      //         description: 'La calificación se ha actualizado correctamente',
      //         variant: 'success',
      //       })

      //       close?.()
      //       router.replace('/dashboard/educacion/administracion')
      //     }
      //   })
    })
  }

  return (
    <Form {...form}>
      <form
        style={{
          scrollbarGutter: 'stable both-edges',
        }}
        className="flex-1 p-4 px-4 gap-8 mb-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="mb-3 py-4 border-b border-border">
          <p className="text-sm font-semibold text-foreground">
            {isEditEnabled ? 'Editar Evaluación' : 'Registrar Evaluación'}
          </p>
        </div>

        <FormField
          control={form.control}
          name={`status`}
          rules={{
            required: 'Campo requerido',
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado de la Evaluación</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACTIVA">Activa</SelectItem>
                  <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                  <SelectItem value="CALIFICANDO">Calificando</SelectItem>
                  <SelectItem value="COMPLETADA">Completada</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`description`}
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
          name={`name`}
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
              <FormLabel>Titulo de la Evaluación</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`type`}
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
              <FormLabel>Tipo de Evaluación</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`phase`}
          rules={{
            required: 'Campo requerido',
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etapa de la Evaluación</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Al_Finalizar">
                    Al Finalizar el curso
                  </SelectItem>
                  <SelectItem value="Durante_El_Curso">
                    Durante el Curso
                  </SelectItem>
                  <SelectItem value="Antes_Del_Curso">
                    Antes del Curso
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`date`}
          rules={{
            required: 'Este campo es necesario',
          }}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Fecha Tentativa</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  id="date"
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
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="default" type="submit" className="w-full mt-5">
          Guardar
        </Button>
        {/* <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-2"></DialogFooter> */}
      </form>
    </Form>
  )
}
