import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/router'

interface Education {
  id: number
  course: string
  school: string
  start_date: string
  end_date: string
  grade: string
  logo: string
}

const backendUrl = import.meta.env['VITE_BACKEND_URL'] as string

export function Index() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-stretch gap-4">
      <h1 className="mt-9 text-4xl">Resume Builder</h1>
      <div className="flex flex-col gap-4 rounded-md bg-slate-800 p-4">
        <h2 className="text-2xl">Experience</h2>
        <p>Experience Placeholder</p>
        <Link className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Add Experience
        </Link>
      </div>
      <div className="flex flex-col gap-4 rounded bg-slate-800 p-4">
        <h2 className="text-2xl">Education</h2>
        <EducationsList />
        <Link
          to="/educations/create"
          className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Add Education
        </Link>
      </div>
      <div className="flex flex-col gap-4 rounded bg-slate-800 p-4">
        <h2 className="text-2xl">Skills</h2>
        <p>Skill Placeholder</p>
        <Link 
        to="/skills/create"
        className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Add Skill
        </Link>
      </div>
      <button>Export</button>
    </div>
  )
}

function EducationsList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['educations'],
    queryFn: async () => {
      return fetch(`${backendUrl}/resume/education`).then((res) => res.json() as Promise<Education[]>)
    }
  })

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>Something went wrong</p>
  }

  if (data.length === 0) {
    return <p>Education placeholder</p>
  }

  return (
    <ul className="grid gap-6">
      {data.map((data) => (
        <li
          key={data.id}
          className="relative after:[&:not(:last-child)]:absolute after:[&:not(:last-child)]:-bottom-3 after:[&:not(:last-child)]:left-0 after:[&:not(:last-child)]:h-[2px] after:[&:not(:last-child)]:w-full after:[&:not(:last-child)]:translate-y-1/2 after:[&:not(:last-child)]:rounded-md after:[&:not(:last-child)]:bg-slate-500 after:[&:not(:last-child)]:content-['']">
          <Link to="/educations/edit/$id" params={{ id: data.id.toString() }}>
            <div className="grid grid-cols-2 grid-rows-2 justify-between gap-2">
              <h3 className="truncate">{data.school}</h3>
              <span className="text-right">
                {data.start_date} - {data.end_date}
              </span>
              <span>{data.course}</span>
              <span className="text-right">{data.grade}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
