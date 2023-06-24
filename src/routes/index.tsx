import { Link } from '@tanstack/router'

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
        <p>Education Placeholder</p>
        <Link
          to="/education/create"
          className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Add Education
        </Link>
      </div>
      <div className="flex flex-col gap-4 rounded bg-slate-800 p-4">
        <h2 className="text-2xl">Skills</h2>
        <p>Skill Placeholder</p>
        <Link
          to="/education/create"
          className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Add Skill
        </Link>
      </div>
      <button>Export</button>
    </div>
  )
}
