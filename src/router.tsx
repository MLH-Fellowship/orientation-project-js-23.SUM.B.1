import { RootRoute, Route, Router } from '@tanstack/router'
import { AddEducation } from '@/routes/educations/add'
import { Root } from '@/routes/root'
import { Index } from '@/routes'
import { EditEducation } from './routes/educations/edit/id'
import { AddExperience } from './routes/experiences/add'
import { EditExperience } from './routes/experiences/edit/id'

const rootRoute = new RootRoute({
  component: Root
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index
})

const addEducationRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/educations/create',
  component: AddEducation
})

const editEducationRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/educations/edit/$id',
  component: EditEducation
})

const addExperienceRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/experiences/create',
  component: AddExperience
})

const editExperienceRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/experiences/edit/$id',
  component: EditExperience
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  addEducationRoute,
  editEducationRoute,
  addExperienceRoute,
  editExperienceRoute
])

export const router = new Router({ routeTree })

declare module '@tanstack/router' {
  interface Register {
    router: typeof router
  }
}
