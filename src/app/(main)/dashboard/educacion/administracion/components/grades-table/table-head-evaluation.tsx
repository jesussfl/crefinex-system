'use client'

import { Button } from '@/modules/common/components/button'
import { TableHead } from '@/modules/common/components/table/table'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { Evaluation } from '@prisma/client'
import { deleteEvaluation } from '../../lib/actions/evaluation-actions'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/common/components/popover/popover'
import { DeleteDialog } from '@/modules/common/components/delete-dialog'
import {
  AlertDialog,
  AlertDialogTrigger,
} from '@/modules/common/components/alert-dialog'

type Props = {
  evaluation: Evaluation
}
export default function TableHeadEvaluation({ evaluation }: Props) {
  return (
    <TableHead>
      <div className="flex gap-4">
        <Popover>
          <PopoverTrigger>
            <Button variant="outline">{evaluation.name}</Button>
          </PopoverTrigger>
          <PopoverContent className={`w-50 p-2`}>
            <AlertDialog>
              <AlertDialogTrigger>Eliminar</AlertDialogTrigger>
              <DeleteDialog
                title={`Estás seguro de eliminar la evaluación ${evaluation.name}?`}
                description={`Se eliminará la evaluación ${evaluation.name}`}
                actionMethod={() => deleteEvaluation(evaluation.id)}
                sectionName={SECTION_NAMES.ADMINISTRACION_ACADEMICA}
              />
            </AlertDialog>
          </PopoverContent>
        </Popover>
      </div>
    </TableHead>
  )
}
