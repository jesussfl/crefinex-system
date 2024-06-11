'use client'
import { useState, useTransition } from 'react'

import { useForm, SubmitHandler, useFormContext } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import { Form } from '@/modules/common/components/form'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { useToast } from '@/modules/common/components/toast/use-toast'
import { Employee } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import 'react-phone-input-2/lib/style.css'

import { EmployeeFields } from './employee-fields'
import { Step, Stepper, useStepper } from '@/modules/common/components/stepper'
import {
  createEmployee,
  updateEmployee,
} from '../../lib/actions/employee-actions'

type EditForm = {
  defaultValues: Employee
  employeeId: number
}
type CreateForm = {
  defaultValues?: undefined
  employeeId?: undefined
}
type FormValues = Employee

type Props = EditForm | CreateForm

export default function EmployeesForm({ defaultValues, employeeId }: Props) {
  const { toast } = useToast()
  const router = useRouter()

  const { control, setValue, formState, trigger, ...rest } =
    useForm<FormValues>({
      defaultValues,
      mode: 'all',
    })

  const steps = [
    {
      label: 'Datos del Empleado',
      description: 'Agrega la información del empleado',
    },
  ]

  const [isPending, startTransition] = useTransition()

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const isEditing = !!defaultValues

    startTransition(() => {
      if (!isEditing) {
        createEmployee(values).then((data) => {
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
              title: 'Empleado creado',
              description: 'El empleado se ha creado correctamente',
              variant: 'success',
            })

            router.back()
          }
        })

        return
      }

      updateEmployee(values, employeeId).then((data) => {
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
            title: 'Empleado actualizado',
            description: 'El empleado se ha actualizado correctamente',
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
                      <EmployeeFields />
                    </Step>
                  )
                }
                return <Step key={stepProps.label} {...stepProps}></Step>
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
        Paso {activeStep + 1} de {'1'}
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
          if (activeStep === 0) return

          e.preventDefault()

          handleNextStep()
        }}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : activeStep === 0 ? (
          'Guardar'
        ) : (
          'Siguiente'
        )}
      </Button>
    </DialogFooter>
  )
}
