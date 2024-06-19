import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/modules/common/components/form'

import { Button } from '@/modules/common/components/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import { CaretSortIcon } from '@radix-ui/react-icons'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/modules/common/components/command/command'
import { ScrollArea } from '@/modules/common/components/scroll-area/scroll-area'
import { CheckIcon, Loader2 } from 'lucide-react'
import { cn } from '@/utils/utils'

export const MainRepresentativeFields = () => {
  const { control, setValue, watch, ...rest } = useFormContext()

  const representatives = watch('representatives').map(
    (representative: any) => {
      const transformedData = {
        value: representative.id_document_number,
        label: representative.names,
      }

      return transformedData
    }
  )
  return (
    <>
      <FormField
        control={control}
        name="id_main_representative"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Seleccione el Representante Legal (Opcional):</FormLabel>
            <FormDescription>
              Esta lista es de los parentescos agregados en el paso 2
            </FormDescription>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      'w-full justify-between',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value
                      ? representatives.find(
                          (representative: any) =>
                            representative.value === field.value
                        )?.label
                      : 'Seleccionar representante'}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="PopoverContent">
                <Command>
                  <CommandInput
                    placeholder="Buscar representante..."
                    className="h-9"
                  />
                  <ScrollArea className="max-h-56">
                    <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                    <CommandGroup>
                      {!representatives ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        representatives.map((representative: any) => (
                          <CommandItem
                            value={representative.label}
                            key={representative.value}
                            onSelect={() => {
                              setValue(
                                'id_main_representative',
                                representative.value,
                                {
                                  shouldDirty: true,
                                }
                              )
                            }}
                          >
                            {representative.label}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                representative.value === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                  </ScrollArea>
                </Command>
              </PopoverContent>
            </Popover>

            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
