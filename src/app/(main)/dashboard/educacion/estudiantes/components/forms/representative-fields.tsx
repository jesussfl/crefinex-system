import { useFormContext } from 'react-hook-form'
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
import PhoneInput from 'react-phone-input-2'
export const RepresentativeFields = () => {
  const form = useFormContext()
  const [isPending, startTransition] = useTransition()

  return (
    <>
      <FormField
        control={form.control}
        name="representative.relationship"
        rules={{
          required: 'Campo requerido',
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Parentesco del Representante</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Padre">Padre</SelectItem>
                <SelectItem value="Madre">Madre</SelectItem>
                <SelectItem value="Tio">Tio</SelectItem>
                <SelectItem value="Tia">Tia </SelectItem>
                <SelectItem value="Abuelo">Abuelo</SelectItem>
                <SelectItem value="Abuela">Abuela</SelectItem>
                <SelectItem value="Hermano">Hermano</SelectItem>
                <SelectItem value="Hermana">Hermana</SelectItem>
                <SelectItem value="Primo">Primo</SelectItem>
                <SelectItem value="Prima">Prima</SelectItem>

                <SelectItem value="Tutor Legal">Tutor Legal</SelectItem>
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-1 gap-4">
        <FormField
          control={form.control}
          name="representative.names"
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
              <FormLabel>Nombres del Representante</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="representative.lastNames"
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
              <FormLabel>Apellidos del Representante</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex flex-1 gap-4">
        <FormField
          control={form.control}
          name="representative.id_document_type"
          rules={{
            required: 'Campo requerido',
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Documento de Identidad</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="V">Venezolano</SelectItem>
                  <SelectItem value="E">Extranjero</SelectItem>
                  <SelectItem value="P">Pasaporte</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="representative.id_document_number"
          rules={{
            required: 'Este campo es necesario',
            minLength: {
              value: 3,
              message: 'Debe tener al menos 2 caracteres',
            },
            maxLength: {
              value: 25,
              message: 'Debe tener un maximo de 25 caracteres',
            },
          }}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Número de Documento</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="representative.birthDate"
          rules={{
            required: 'Este campo es necesario',
          }}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Fecha de Nacimiento</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  id="birthDate"
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
          name="representative.gender"
          rules={{
            required: 'Campo requerido',
          }}
          render={({ field }) => (
            <FormItem className="flex-1 gap-4 justify-between">
              <FormLabel className="">Sexo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Femenino">Femenino</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-1 gap-4">
        <FormField
          control={form.control}
          name="representative.country"
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
              <FormLabel>Pais</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="representative.state"
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
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="representative.city"
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
              <FormLabel>Ciudad</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="representative.address"
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
            <FormLabel>Dirección</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`representative.phone_number`}
        rules={{
          required: 'Este campo es requerido',
        }}
        render={({ field: { ref, ...field } }) => (
          <FormItem className="flex-1 gap-2">
            <FormLabel className="flex-1">{`Numero telefónico:`}</FormLabel>
            <div className="">
              <FormControl>
                <PhoneInput
                  country={'ve'}
                  // placeholder="Ingresa tu numero telefónico"
                  {...field}
                  masks={{
                    ve: '....-...-....',
                  }}
                  onChange={(value: string, data: any) => {
                    const phoneNumber = value.split(data.dialCode)[1]
                    const formattedPhoneNumber = `+${
                      data.dialCode
                    }-${phoneNumber.slice(0, 4)}-${phoneNumber.slice(
                      4,
                      7
                    )}-${phoneNumber.slice(7)}`
                    field.onChange(formattedPhoneNumber)
                  }}
                  countryCodeEditable={false}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="representative.work_address"
        rules={{
          required: 'Este campo es necesario',
          minLength: {
            value: 3,
            message: 'Debe tener al menos 3 caracteres',
          },
          maxLength: {
            value: 200,
            message: 'Debe tener un maximo de 200 caracteres',
          },
        }}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Dirección de trabajo</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="representative.email"
        //@ts-ignore
        render={({ field }) => (
          <FormItem>
            <FormLabel>Correo electrónico</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="john.doe@example.com"
                {...field}
                value={field.value || ''}
                disabled={isPending}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
