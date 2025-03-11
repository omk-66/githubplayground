import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(website)/_layout/contect')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>CONTECT page</div>
}
