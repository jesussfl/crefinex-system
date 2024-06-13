'use client'
import { useTransition } from 'react'

import { Button } from '@/modules/common/components/button'
import { Form } from '@/modules/common/components/form'
import { useToast } from '@/modules/common/components/toast/use-toast'
import { Documentos_Identidad, Genders } from '@prisma/client'
import { Loader2, PlusIcon, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import 'react-phone-input-2/lib/style.css'
import { createStudent, updateStudent } from '../../lib/actions/students'

import { Step, Stepper } from '@/modules/common/components/stepper'
import StepperFooter from '@/modules/common/components/stepper/stepper-footer'
import { StudentFormType } from '@/types/types'
import { ExtraInfoForm } from './extra-info-form'
import { MainRepresentativeFields } from './main-representative-form'
import { RepresentativeFields } from './representative-fields'
import { steps } from './steps'
import { StudentFields } from './student-fields'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/modules/common/components/accordion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/modules/common/components/alert-dialog'

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

  const [isPending, startTransition] = useTransition()
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const isEditing = !!defaultValues

    if (!isEditing) {
      startTransition(() => {
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
      })

      return
    }

    startTransition(() => {
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
        {isPending && (
          <div className="flex justify-center items-center fixed inset-0 bg-black/60 z-50">
            <Loader2 className="animate-spin" size={88} color="white" />
          </div>
        )}
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

                if (index === 1) {
                  return (
                    <Step key={stepProps.label} {...stepProps}>
                      <Button
                        variant="default"
                        size={'lg'}
                        className="absolute bottom-[100px] right-[50px] z-50"
                        onClick={(e) => {
                          e.preventDefault()
                          toast({
                            title: 'Parentesco agregado',
                            variant: 'default',
                          })
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
                            facebook: '',
                            instagram: '',
                            tiktok: '',
                            youtube: '',
                            work_position: '',
                            is_working: false,
                            civil_status: '',
                          })
                        }}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Agregar Parentesco
                      </Button>
                      <Accordion type="single" collapsible className="w-full">
                        {fields.map((field, index) => {
                          return (
                            <AccordionItem
                              key={field.id}
                              value={String(index)}
                              className="space-y-4"
                            >
                              <AccordionTrigger className="bg-secondary rounded-md px-4 flex justify-between">
                                Datos del Parentesco #{index + 1}
                              </AccordionTrigger>
                              <AccordionContent className="space-y-4 p-8 border rounded-md">
                                <AlertDialog>
                                  <div className="flex w-full justify-end">
                                    <AlertDialogTrigger className="flex justify-end">
                                      <Trash className="h-4 w-4 mr-2" />
                                      Eliminar Parentesco
                                    </AlertDialogTrigger>
                                  </div>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Estás seguro que deseas eliminar este
                                        parentesco
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Los datos que has ingresado se perderán
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancelar
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => {
                                          remove(index)
                                          setValue('id_main_representative', '')
                                          toast({
                                            title: 'Parentesco eliminado',
                                            description:
                                              'El parentesco se ha eliminado correctamente',
                                            variant: 'default',
                                          })
                                        }}
                                      >
                                        Eliminar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>

                                <RepresentativeFields index={index} />
                              </AccordionContent>
                            </AccordionItem>
                          )
                        })}
                      </Accordion>
                    </Step>
                  )
                }

                if (index === 2) {
                  return (
                    <Step key={stepProps.label} {...stepProps}>
                      <MainRepresentativeFields />
                    </Step>
                  )
                }

                if (index === 3) {
                  return (
                    <Step key={stepProps.label} {...stepProps}>
                      <ExtraInfoForm />
                    </Step>
                  )
                }
              })}
              <StepperFooter />
            </Stepper>
          </div>
        </form>
      </Form>
    </div>
  )
}
