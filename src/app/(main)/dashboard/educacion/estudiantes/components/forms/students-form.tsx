'use client'
import { useEffect, useRef, useState, useTransition } from 'react'

import {
  useForm,
  SubmitHandler,
  useFormState,
  useFieldArray,
  useFormContext,
} from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import { Form } from '@/modules/common/components/form'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { useToast } from '@/modules/common/components/toast/use-toast'
import {
  Documentos_Identidad,
  Genders,
  Modalities,
  Student_Status,
} from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Loader2, PlusIcon } from 'lucide-react'
import { createStudent, updateStudent } from '../../lib/actions/students'
import 'react-phone-input-2/lib/style.css'

import { RepresentativeFields } from './representative-fields'
import { RepresentativeFormType } from '@/types/types'
import { StudentFields } from './student-fields'
import { Step, Stepper, useStepper } from '@/modules/common/components/stepper'

export type StudentFormType = {
  names: string
  lastNames: string
  birthDate: Date
  current_status: Student_Status

  id_current_course: number
  modalidad: Modalities
  gender: Genders

  phone_number?: string | null
  email?: string | null

  address?: string | null
  country: string
  city: string
  state: string
  level_id: number
  extracurricular_activities?: string | null

  id_document_type: Documentos_Identidad
  id_document_number?: string | null
  id_document_image?: string | null
  student_image?: string | null

  representatives: RepresentativeFormType[]
}
type EditForm = {
  defaultValues: StudentFormType
  studentId: number
}
type CreateForm = {
  defaultValues?: undefined
  studentId?: undefined
}
type FormValues = StudentFormType

type Props = EditForm | CreateForm

export default function StudentsForm({ defaultValues, studentId }: Props) {
  const { toast } = useToast()
  const router = useRouter()

  const { control, setValue, formState, trigger, ...rest } =
    useForm<FormValues>({
      defaultValues,
      mode: 'all',
    })
  const { fields, append, remove } = useFieldArray({
    name: 'representatives',
    control,
  })
  const steps = [
    {
      label: 'Datos del Estudiante',
      description: 'Agrega la información del estudiante',
    },
    {
      label: 'Representantes',
      description: 'Agrega los representantes del estudiante',
    },
  ]

  const [isPending, startTransition] = useTransition()

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const isEditing = !!defaultValues

    startTransition(() => {
      if (!isEditing) {
        createStudent(values).then((data) => {
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
              title: 'Estudiante creado',
              description: 'El estudiante se ha creado correctamente',
              variant: 'success',
            })

            router.back()
          }
        })

        return
      }

      updateStudent(studentId, values).then((data) => {
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
            title: 'Estudiante actualizado',
            description: 'El estudiante se ha actualizado correctamente',
            variant: 'success',
          })
        }
        router.back()
      })
    })
  }

  return (
    <div
      style={{
        scrollbarGutter: 'stable both-edges',
      }}
      className="flex-1 overflow-y-auto p-6 gap-8 mb-36"
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
          <div className="px-24 space-y-8">
            <Stepper
              variant="circle-alt"
              initialStep={0}
              steps={steps}
              onClickStep={(step, setStep) => {
                setStep(step)
              }}
              scrollTracking={true}
            >
              {steps.map((stepProps, index) => {
                if (index === 0) {
                  return (
                    <Step key={stepProps.label} {...stepProps}>
                      <StudentFields />
                    </Step>
                  )
                }
                return (
                  <Step key={stepProps.label} {...stepProps}>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={(e) => {
                        e.preventDefault()
                        append({
                          names: '',
                          lastNames: '',
                          birthDate: new Date(),
                          gender: Genders.Masculino,
                          phone_number: '',
                          email: '',
                          address: '',
                          country: '',
                          city: '',
                          state: '',
                          id_document_type: Documentos_Identidad.V,
                          id_document_number: '',
                          id_document_image: '',
                          relationship: '',
                        })
                      }}
                    >
                      <PlusIcon className="h-4 w-4" />
                      Agregar Representante
                    </Button>

                    {fields.map((field, index) => {
                      return (
                        <div key={field.id} className="space-y-4">
                          <div className="flex justify-between">
                            <p>Datos del Representante #{index + 1}</p>
                            <Button
                              variant="destructive"
                              onClick={(e) => {
                                e.preventDefault()
                                remove(index)
                              }}
                            >
                              Eliminar representante
                            </Button>
                          </div>
                          <div className="space-y-4">
                            <RepresentativeFields index={index} />
                          </div>
                        </div>
                      )
                    })}
                  </Step>
                )
              })}
              <MyStepperFooter
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </Stepper>
          </div>
        </form>
      </Form>
    </div>
  )
}

function MyStepperFooter({
  isLoading,
  setIsLoading, // scrollToTop,
}: {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  // scrollToTop: () => void
}) {
  const { activeStep, prevStep, nextStep } = useStepper()
  const { formState, trigger } = useFormContext()

  const handleNextStep = async () => {
    setIsLoading(true)
    const isValid = await trigger()
    if (isValid) {
      nextStep()
      // scrollToTop()
    }

    setIsLoading(false)
  }
  return (
    <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-8">
      {Object.keys(formState.errors).length > 0 && (
        <p className="text-sm font-medium text-destructive">
          Corrige los campos en rojo
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Paso {activeStep} de {'2'}
      </p>
      <Button
        variant="outline"
        disabled={activeStep === 0}
        onClick={(e) => {
          e.preventDefault()
          prevStep()
          // scrollToTop()
        }}
      >
        Volver
      </Button>

      <Button
        disabled={isLoading}
        onClick={(e) => {
          if (activeStep === 1) return

          e.preventDefault()

          handleNextStep()
        }}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : activeStep === 1 ? (
          'Guardar'
        ) : (
          'Siguiente'
        )}
      </Button>
    </DialogFooter>
  )
}
