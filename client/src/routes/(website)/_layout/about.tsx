import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(website)/_layout/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    ABOUT page
  </div>
}
