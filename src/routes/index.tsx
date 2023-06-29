import { config } from '@/config'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/router'

interface Education {
  course: string
  school: string
  start_date: string
  end_date: string
  grade: string
  logo: string
}
interface Skill {
  id: number
  name: string
  proficiency: string
  logo: string
}

interface Experience {
  title: string
  company: string
  start_date: string
  end_date: string
  description: string
  logo: string
}

export function Index() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-stretch gap-4">
      <h1 className="mt-9 text-4xl">Resume Builder</h1>
      <div className="flex flex-col gap-4 rounded-md bg-slate-800 p-4">
        <h2 className="text-2xl">Experience</h2>
        <ExperiencesList />
        <Link
          to="/experiences/create"
          className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90">
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
        <SkillsList />
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

function ExperiencesList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      return fetch(`${config.VITE_BACKEND_URL}/resume/experience`, { mode: 'cors', method: 'GET' }).then(
        (res) => res.json() as Promise<Experience[]>
      )
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
      {data.map((data, index) => (
        <li
          key={index + 1}
          className="relative after:[&:not(:last-child)]:absolute after:[&:not(:last-child)]:-bottom-3 after:[&:not(:last-child)]:left-0 after:[&:not(:last-child)]:h-[2px] after:[&:not(:last-child)]:w-full after:[&:not(:last-child)]:translate-y-1/2 after:[&:not(:last-child)]:rounded-md after:[&:not(:last-child)]:bg-slate-500 after:[&:not(:last-child)]:content-['']">
          <Link
            to="/experiences/edit/$id"
            className="block rounded-md p-4 hover:bg-slate-700/20"
            params={{ id: (index + 1).toString() }}>
            <div className="grid grid-cols-2 grid-rows-2 justify-between gap-2">
              <h3 className="truncate">{data.title}</h3>
              <span className="text-right">
                {data.start_date} - {data.end_date}
              </span>
              <span>{data.description}</span>
              <span className="text-right">{data.company}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function EducationsList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['educations'],
    queryFn: async () => {
      return fetch(`${config.VITE_BACKEND_URL}/resume/education`).then((res) => res.json() as Promise<Education[]>)
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
      {data.map((data, index) => (
        <li
          key={index + 1}
          className="relative after:[&:not(:last-child)]:absolute after:[&:not(:last-child)]:-bottom-3 after:[&:not(:last-child)]:left-0 after:[&:not(:last-child)]:h-[2px] after:[&:not(:last-child)]:w-full after:[&:not(:last-child)]:translate-y-1/2 after:[&:not(:last-child)]:rounded-md after:[&:not(:last-child)]:bg-slate-500 after:[&:not(:last-child)]:content-['']">
          <Link
            className="block rounded-md p-4 hover:bg-slate-700/20"
            to="/educations/edit/$id"
            params={{ id: (index + 1).toString() }}>
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

function SkillsList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      return fetch(`${backendUrl}/resume/skill`).then((res) => res.json() as Promise<Skill[]>)
    }
  })

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>Something went wrong</p>
  }

  if (data.length === 0) {
    return <p>Skill placeholder</p>
  }

  return (
    <ul className="grid gap-6">
      {data.map((data) => (
        <li
          key={data.id}
          className="relative after:[&:not(:last-child)]:absolute after:[&:not(:last-child)]:-bottom-3 after:[&:not(:last-child)]:left-0 after:[&:not(:last-child)]:h-[2px] after:[&:not(:last-child)]:w-full after:[&:not(:last-child)]:translate-y-1/2 after:[&:not(:last-child)]:rounded-md after:[&:not(:last-child)]:bg-slate-500 after:[&:not(:last-child)]:content-['']">
          <Link to="/skills/edit/$id" params={{ id: data.id.toString() }}>
            <div className="grid grid-cols-2 grid-rows-2 justify-between gap-2">
              <h3 className="truncate">{data.name}</h3>
              <span className="text-right">{data.proficiency}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
