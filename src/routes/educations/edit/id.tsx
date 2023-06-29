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

const GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'] as const
const formSchema = z.object({
  course: z.string().nonempty({ message: 'Course is required' }),
  school: z.string().nonempty({ message: 'School is required' }),
  start_date: z.date(),
  end_date: z.date().or(z.string()),
  grade: z.string(),
  logo: z.string({ required_error: 'test' }).url({ message: 'Invalid URL' })
})

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type Form = PartialBy<z.infer<typeof formSchema>, 'start_date' | 'end_date'>

type Response =
  | {
      course: string
      school: string
      start_date: string
      end_date: string
      grade: string
      logo: string
    }
  | { message: string }

export function EditEducation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = useParams()
  const { data: education, isLoading } = useQuery({
    queryKey: ['education', id],
    queryFn: async () => {
      return fetch(`${config.VITE_BACKEND_URL}/resume/education/${id as string}`, {
        method: 'GET'
      }).then((res) => res.json() as Promise<Response>)
    },
    enabled: !!id
  })
  const { toast } = useToast()
  const addEducation = useMutation({
    mutationFn: (data: Required<Form>) => {
      const startDate = new Date(data.start_date)
      const startMonth = startDate.toLocaleString('default', { month: 'long' })
      const startYear = startDate.getFullYear()
      if (data.end_date === 'Present') {
        return fetch(`${config.VITE_BACKEND_URL}/resume/education`, {
          body: JSON.stringify({
            ...data,
            start_date: `${startMonth} ${startYear}`,
            end_date: data.end_date
          }),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }
      const endDate = new Date(data.end_date)
      const endMonth = endDate.toLocaleString('default', { month: 'long' })
      const endYear = endDate.getFullYear()
      return fetch(`${config.VITE_BACKEND_URL}/resume/education`, {
        body: JSON.stringify({
          ...data,
          start_date: `${startMonth} ${startYear}`,
          end_date: `${endMonth} ${endYear}`
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    async onSuccess(res) {
      if (res.ok) {
        void navigate({ to: '/' })
        toast({ title: 'Successfully added education' })
        return queryClient.invalidateQueries({ queryKey: ['education', id] })
      }

      toast({ title: 'Failed to add education' })
    },
    onError() {
      toast({ title: 'Failed to add education' })
    }
  })

  function onSubmit(data: Form) {
    if (data.start_date && data.end_date) {
      addEducation.mutate(data as Required<Form>)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!education) {
    return <div>Failed to fetch education</div>
  }

  if ('message' in education) {
    return <div>{education.message}</div>
  }

  const startMonth = education.start_date.split(' ')[0] as string
  const startYear = education.start_date.split(' ')[1] as string

  // Can be the value Present which would result in undefined
  const endMonth = education.end_date.split(' ')[0]
  const endYear = education.end_date.split(' ')[1]

  return (
    <Form
      onSubmit={onSubmit}
      isSubmitting={addEducation.isLoading}
      data={{
        ...education,
        start_date: new Date(Date.parse(`${startMonth} 1, ${startYear}`)),
        end_date: endMonth && endYear ? new Date(Date.parse(`${endMonth} 1, ${endYear}`)) : 'Present'
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
          <h1 className="text-4xl">Edit Education</h1>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-8">
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="inline-block w-24">Start Date:</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    {typeof field.value !== 'string' && (
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    )}
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field, formState }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel className="inline-block w-24">End Date:</FormLabel>
                    <label htmlFor="end-date-checkbox" className="flex items-center gap-2">
                      Present
                      <Checkbox
                        id="end-date-checkbox"
                        checked={field.value === 'Present'}
                        onCheckedChange={(e) => {
                          if (e) {
                            field.onChange('Present')
                            return
                          }
                          // Can't pass undefined or else validation will be out of sync according to react hook form docs
                          field.onChange(
                            formState.defaultValues?.end_date === 'Present'
                              ? new Date()
                              : formState.defaultValues?.end_date ?? new Date()
                          )
                        }}
                      />
                    </label>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            typeof field.value !== 'string' ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Present</span>
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={typeof field.value === 'string' ? undefined : field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade:</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GRADES.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
