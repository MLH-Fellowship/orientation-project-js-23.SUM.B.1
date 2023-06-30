import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form as FormProvider } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { config } from '@/config'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { SelectValue } from '@radix-ui/react-select'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/router'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import z from 'zod'
const formSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  proficiency: z.string().regex(/^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)%$/, { message: 'Invalid proficiency' }),
  logo: z.string({ required_error: 'test' }).url({ message: 'Invalid URL' })
})

type Form = z.infer<typeof formSchema>

type Response =
  | {
      name: string
      proficiency: string
      logo: string
    }
  | { message: string }

export function EditSkill() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = useParams()
  const { data: skill, isLoading } = useQuery({
    queryKey: ['skill', id],
    queryFn: async () => {
      return fetch(`${config.VITE_BACKEND_URL}/resume/skill/${id as string}`, {
        method: 'GET'
      }).then((res) => res.json() as Promise<Response>)
    },
    enabled: !!id
  })
  const { toast } = useToast()
  const addSkill = useMutation({
    mutationFn: (data: Required<Form>) => {
      return fetch(`${config.VITE_BACKEND_URL}/resume/skill/${id as string}`, {
        body: JSON.stringify({
          ...data
        }),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    async onSuccess(res) {
      if (res.ok) {
        void navigate({ to: '/' })
        toast({ title: 'Successfully updated skill' })
        return queryClient.invalidateQueries({ queryKey: ['skill', id] })
      }

      toast({ title: 'Failed to update skill' })
    },
    onError() {
      toast({ title: 'Failed to update skill' })
    }
  })

  function onSubmit(data: Form) {
    addSkill.mutate(data as Required<Form>)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!skill) {
    return <div>Failed to fetch the skill</div>
  }

  if ('message' in skill) {
    return <div>{skill.message}</div>
  }

  return (
    <Form
      onSubmit={onSubmit}
      isSubmitting={addSkill.isLoading}
      data={{
        ...skill
      }}
    />
  )
}

function Form({
  data,
  onSubmit,
  isSubmitting
}: {
  onSubmit: (data: Form) => void
  isSubmitting: boolean
  data: z.infer<typeof formSchema>
}) {
  const navigate = useNavigate()
  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data
    }
  })
  return (
    <div className="flex flex-col gap-4 sm:pt-9">
      <FormProvider {...form}>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8 rounded-md border-2 border-input p-8">
          <h1 className="text-4xl">Edit Skill</h1>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
           
            <FormField
              control={form.control}
              name="proficiency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proficiency:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo (URL):</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4">
            <Button onClick={() => void navigate({ to: '/' })} className="w-fit" variant="destructive" type="button">
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Update
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
