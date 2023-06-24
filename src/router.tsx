import { RootRoute, Route, Router } from '@tanstack/router'
import { AddEducation } from '@/routes/education/add'
import { Root } from '@/routes/root'
import { Index } from '@/routes'

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

const routeTree = rootRoute.addChildren([indexRoute, addEducationRoute])

export const router = new Router({ routeTree })

declare module '@tanstack/router' {
  interface Register {
    router: typeof router
  }
}
