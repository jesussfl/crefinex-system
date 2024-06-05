import { useFieldArray, useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/modules/common/components/form'
import { Input } from '@/modules/common/components/input/input'

import { useTransition } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/select/select'

import { PlusIcon, Trash } from 'lucide-react'
import { Button } from '@/modules/common/components/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/modules/common/components/accordion'

export const EvaluationFields = () => {
  const { setValue, watch, ...rest } = useFormContext()
  const [isPending, startTransition] = useTransition()
  const { fields, append, remove } = useFieldArray({
    name: 'evaluations',
    control: rest.control,
  })
  return (
    <div className="space-y-8">
      <Button
        variant="outline"
        className="w-full"
        onClick={(e) => {
          e.preventDefault()
          append({
            name: '',
            description: '',
            date: new Date(),
            phase: '',
            type: '',

            status: 'ACTIVA',
          })
        }}
      >
        <PlusIcon className="h-4 w-4" />
        Agregar Evaluación
      </Button>
      <Accordion type="single" collapsible className="w-full">
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-row gap-6 items-start">
            <AccordionItem
              key={field.id}
              value={`evaluations.${index}`}
              className="flex-1"
            >
              <AccordionTrigger className="w-full">
                {`Evaluación #${index + 1}`}
              </AccordionTrigger>
              <AccordionContent className="p-3">
                <FormField
                  control={rest.control}
                  name={`evaluations.${index}.status`}
                  rules={{
                    required: 'Campo requerido',
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado de la Evaluación</FormLabel>
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
                          <SelectItem value="ACTIVA">Activa</SelectItem>
                          <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                          <SelectItem value="CALIFICANDO">
                            Calificando
                          </SelectItem>
                          <SelectItem value="COMPLETADA">Completada</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={rest.control}
                  name={`evaluations.${index}.description`}
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
                  control={rest.control}
                  name={`evaluations.${index}.name`}
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
                  control={rest.control}
                  name={`evaluations.${index}.type`}
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
                  control={rest.control}
                  name={`evaluations.${index}.phase`}
                  rules={{
                    required: 'Campo requerido',
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Etapa de la Evaluación</FormLabel>
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
                  control={rest.control}
                  name={`evaluations.${index}.date`}
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
                              ? new Date(field.value)
                                  .toISOString()
                                  .split('T')[0]
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
              </AccordionContent>
            </AccordionItem>
            <Button variant="destructive" onClick={() => remove(index)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </Accordion>
    </div>
  )
}
