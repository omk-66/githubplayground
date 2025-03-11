import Hero from '@/components/sections/hero/default'
import Pricing from '@/components/sections/pricing/default'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(website)/_layout/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Hero />
    <Pricing />
  </div>
}
