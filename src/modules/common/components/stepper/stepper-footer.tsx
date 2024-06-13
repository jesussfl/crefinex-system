import { Loader2 } from 'lucide-react'
import { Button } from '../button'
import { DialogFooter } from '../dialog/dialog'
import { useFormContext } from 'react-hook-form'
import { useStepper } from './use-stepper'
import { useTransition } from 'react'

export default function StepperFooter() {
  const { activeStep, prevStep, nextStep } = useStepper()
  const { formState, trigger } = useFormContext()
  const [isPending, startTransition] = useTransition()
  const handleNextStep = () => {
    startTransition(async () => {
      const isValid = await trigger()
      if (isValid) {
        nextStep()
      }
    })
  }
  return (
    <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-4">
      {Object.keys(formState.errors).length > 0 && (
        <p className="text-sm font-medium text-destructive">
          Corrige los campos en rojo
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Paso {activeStep + 1} de {'4'}
      </p>
      <Button
        variant="outline"
        disabled={activeStep === 0}
        onClick={(e) => {
          e.preventDefault()
          prevStep()
        }}
      >
        Volver
      </Button>

      <Button
        disabled={isPending}
        onClick={(e) => {
          if (activeStep === 3) return

          e.preventDefault()

          handleNextStep()
        }}
      >
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : activeStep === 3 ? (
          'Guardar'
        ) : (
          'Siguiente'
        )}
      </Button>
    </DialogFooter>
  )
}
