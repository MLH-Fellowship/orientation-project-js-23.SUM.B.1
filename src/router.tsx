import { RootRoute, Route, Router } from '@tanstack/router'
import { AddEducation } from '@/routes/education/add'
import { Root } from '@/routes/root'
import { Index } from '@/routes'
import { EditEducation } from './routes/education/edit'

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
  path: '/education/create',
  component: AddEducation
})

const editEducationRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/education/edit/$id',
  component: EditEducation
})

const routeTree = rootRoute.addChildren([indexRoute, addEducationRoute, editEducationRoute])

export const router = new Router({ routeTree })

declare module '@tanstack/router' {
  interface Register {
    router: typeof router
  }
}
