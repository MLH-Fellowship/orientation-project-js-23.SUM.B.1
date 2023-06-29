import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useNavigate, useParams } from '@tanstack/router'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form as FormProvider } from '@/components/ui/form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'

const backendUrl = import.meta.env['VITE_BACKEND_URL'] as string

const formSchema = z.object({
  name: z.string().min(1),
  proficiency: z.string().regex(/^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)%$/, { message: 'Invalid proficiency' }),
  logo: z.string({ required_error: 'test' }).url({ message: 'Invalid URL' })
})
type Form = z.infer<typeof formSchema>

type Response = Promise<z.infer<typeof formSchema> | { Error: string }>

export function EditSkill() {
  const navigate = useNavigate()
  const skillId = useParams()
  const { data: skill, isLoading } = useQuery({
    queryKey: ['skill', skillId],
    queryFn: async () => {
      return fetch(`${backendUrl}/resume/skill/${skillId as string}`).then((res) => res.json() as Response)
    },
    enabled: !!skillId
  })
  const { toast } = useToast()
  const addSkill = useMutation({
    mutationFn: (data: Required<Form>) => {
      return fetch(`${backendUrl}/resume/skill`, {
        body: JSON.stringify({
          ...data
        }),
        method: 'PUT'
      })
    },
    onSuccess(res) {
      if (res.ok) {
        void navigate({ to: '/' })
        toast({ title: 'Successfully updated skill' })
        return
      }

      toast({ title: 'Failed to updated skill' })
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
    return <div>Failed to fetch skill</div>
  }

  if ('Error' in skill) {
    return <div>{skill.Error}</div>
  }

  return <Form onSubmit={onSubmit} isSubmitting={addSkill.isLoading} data={skill} />
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
    },
    values: {
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
                  <FormLabel>Name</FormLabel>
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
              Create
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
