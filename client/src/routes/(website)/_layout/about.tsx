import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(website)/_layout/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center my-4">About Us</h1>
      <p className="text-lg text-gray-700">
        Welcome to our website! We are dedicated to providing high-quality content and services that help you achieve your goals. Our team of experts works hard to ensure that you have the best experience possible.
      </p>
      <p className="text-lg text-gray-700 mt-4">
        Founded in [Year], we have always prioritized customer satisfaction and continuous improvement. Whether you’re here to learn, shop, or explore, we’re excited to have you with us!
      </p>
      <p className="text-lg text-gray-700 mt-4">
        Feel free to browse around and reach out if you have any questions or feedback. We’re always here to help!
      </p>
    </div>
  )
}
