'use client'
import { useState } from 'react'

import { Input } from '@/modules/common/components/input/input'
import { CheckIcon, Loader2 } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import { Button } from '@/modules/common/components/button'
import { cn } from '@/utils/utils'
import { ComboboxData } from '@/types/types'
import { CaretSortIcon } from '@radix-ui/react-icons'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/modules/common/components/command/command'
import ModalForm from '@/modules/common/components/modal-form'
import EvaluationForm from '../../forms/evaluation-form'
import { StudentWithGrades } from '../grades-table'

type Props = {
  selectedCourse?: number
  setSelectedCourse: (value: number) => void
  setSearchText: (value: string) => void
  searchText: string
  studentsByCourse: StudentWithGrades[]
  courses: ComboboxData[]
}
export default function TableFilters({
  selectedCourse,
  setSelectedCourse,

  setSearchText,
  searchText,
  courses,
}: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-start items-center gap-4">
        <div className="flex-1">
          <p className="text-sm">Buscar:</p>

          <Input
            type="text"
            placeholder="Buscar por cédula o nombre"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="flex-1">
          <p className="text-sm">Nivel:</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  'w-full justify-between',
                  !courses && 'text-muted-foreground'
                )}
              >
                {selectedCourse
                  ? courses?.find((course) => course.value === selectedCourse)
                      ?.label
                  : 'Seleccionar nivel...'}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="PopoverContent">
              <Command>
                <CommandInput placeholder="Buscar nivel..." className="h-9" />
                <CommandEmpty>No se encontaron resultados.</CommandEmpty>
                <CommandGroup>
                  {!courses ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    courses.map((course) => (
                      <CommandItem
                        value={course.label}
                        key={course.value}
                        onSelect={() => {
                          setSelectedCourse(course.value)
                        }}
                      >
                        {course.label}
                        <CheckIcon
                          className={cn(
                            'ml-auto h-4 w-4',
                            course.value === selectedCourse
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          {/* <FormMessage /> */}
        </div>
      </div>
      <div className="w-100">
        <ModalForm
          triggerName="Agregar evaluación"
          triggerVariant="default"
          className="w-[400px]"
          closeWarning={false}
        >
          {/*@ts-ignore */}
          <EvaluationForm id_course={selectedCourse} />
        </ModalForm>
      </div>
    </div>
  )
}
