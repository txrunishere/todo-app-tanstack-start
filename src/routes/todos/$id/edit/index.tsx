import { Button } from '@/components/ui/button'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TodoForm } from '@/components/todo-form'
import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/db/prisma'

const getTodoServer = createServerFn()
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data: { id } }) => {
    const todo = await prisma.todo.findUnique({
      where: { id },
    })

    if (!todo) {
      throw notFound()
    }

    return todo
  })

export const Route = createFileRoute('/todos/$id/edit/')({
  component: RouteComponent,
  loader: ({ params }) => getTodoServer({ data: { id: params.id } }),
})

function RouteComponent() {
  const todo = Route.useLoaderData()

  return (
    <div className="container mx-auto space-y-18 p-8">
      <Button asChild variant="link">
        <Link to="/">
          <ArrowLeft /> Todo List
        </Link>
      </Button>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Todo</CardTitle>
          <CardDescription>Update your task details</CardDescription>
        </CardHeader>

        <CardContent>
          <TodoForm todo={todo} />
        </CardContent>
      </Card>
    </div>
  )
}
