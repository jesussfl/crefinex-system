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

import { Weighings } from '@prisma/client'
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

export type GradeFormType = {
  id_student: number
  id_evaluation: number
  grade: number
  weighing: Weighings
  observation?: string | null
  date_done: Date
}

type EditForm = {
  defaultValues: GradeFormType
  id: number
}

type CreateForm = {
  defaultValues?: undefined
  id?: undefined
}

type Props = {
  id_student: number
  id_evaluation: number
  close?: () => void
} & (EditForm | CreateForm)
const ponderationMap = {
  EXCELENTE: { range: '19-20', min: 19, max: 20 },
  MUY_BIEN: { range: '17-18', min: 17, max: 18 },
  BIEN: { range: '14-16', min: 14, max: 16 },
  REGULAR: { range: '10-13', min: 10, max: 13 },
  REPROBADO: { range: '9-1', min: 1, max: 9 },
}
export default function UserGradeForm({
  id_evaluation,
  id_student,
  defaultValues,
  id,
  close,
}: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const isEditEnabled = !!defaultValues
  const form = useForm<GradeFormType>({ defaultValues })
  const [isPending, startTransition] = React.useTransition()
  const [selectedWeighing, setSelectedWeighing] = React.useState<string | null>(
    null
  )
  const [gradeRange, setGradeRange] = React.useState<{
    min: number
    max: number
  } | null>(null)
  const onSubmit: SubmitHandler<GradeFormType> = async (values) => {
    // const studentIdsData = values.students.map((student) => student.id_student)
    startTransition(() => {
      if (!isEditEnabled) {
        createGradeByStudentAndEvaluation({
          ...values,
          id_student,
          id_evaluation,
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
              title: 'Calificación registrada',
              description: 'La calificación se ha registrado correctamente',
              variant: 'success',
            })

            router.push('/dashboard/educacion/administracion?')
          }
        })

        return
      }

      updateGradeByStudentAndEvaluation(values, id).then((data) => {
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
            title: 'Calificación actualizada',
            description: 'La calificación se ha actualizado correctamente',
            variant: 'success',
          })

          close?.()
          router.replace('/dashboard/educacion/administracion')
        }
      })
    })
  }

  return (
    <Form {...form}>
      <form
        style={{
          scrollbarGutter: 'stable both-edges',
        }}
        className="flex-1 p-4 gap-8 mb-12 space-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="mb-3 py-2 border-b border-border">
          <p className="text-sm font-semibold text-foreground">
            {isEditEnabled ? 'Editar Calificación' : 'Registrar Calificación'}
          </p>
        </div>

        <FormField
          control={form.control}
          name="date_done"
          rules={{
            required: 'Este campo es necesario',
          }}
          render={({ field }) => (
            <FormItem className="flex flex-row flex-1 items-center gap-4">
              <FormLabel className="flex-1">Fecha Realizada:</FormLabel>
              <FormControl className="flex-1">
                <Input
                  type="date"
                  id="date_done"
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
          control={form.control}
          name="weighing"
          rules={{
            required: 'Campo requerido',
          }}
          render={({ field }) => (
            <FormItem className="flex flex-row flex-1 items-center gap-2">
              <FormLabel className="flex-1">Ponderación</FormLabel>
              <Select
                onValueChange={(value: keyof typeof ponderationMap) => {
                  field.onChange(value)
                  setSelectedWeighing(value)
                  setGradeRange(
                    ponderationMap[value] ? ponderationMap[value] : null
                  )
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(ponderationMap).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {key.replace('_', ' ')} ({value.range})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="grade"
          rules={{
            required: 'Este campo es necesario',
            min: {
              value: gradeRange?.min || 0,
              message: `La nota debe ser al menos ${gradeRange?.min}`,
            },
            max: {
              value: gradeRange?.max || 100,
              message: `La nota no puede ser mayor que ${gradeRange?.max}`,
            },
          }}
          render={({ field }) => (
            <FormItem className="flex flex-row flex-1 items-center gap-4">
              <FormLabel className="flex-1">Nota</FormLabel>
              <FormControl className="flex-1">
                <Input
                  type="number"
                  {...field}
                  value={selectedWeighing ? field.value : ''}
                  disabled={!selectedWeighing}
                  min={gradeRange?.min}
                  max={gradeRange?.max}
                  onChange={(value) => {
                    field.onChange(parseFloat(value.target.value))
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`observation`}
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
        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-2">
          <Button variant="default" type="submit">
            Guardar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
