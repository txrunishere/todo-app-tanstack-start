import { prisma } from '@/db/prisma'
import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TodosTable } from '@/components/todos-table'

const todosServerFn = createServerFn({ method: 'GET' }).handler(() => {
  return prisma.todo.findMany()
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: () => {
    return todosServerFn()
  },
})

function Home() {
  const todos = Route.useLoaderData()
  const totalTodos = todos.length
  const completedTodos = todos.filter((todo) => todo.isCompleted).length

  return (
    <div className="min-h-screen mx-auto container p-8 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Todo List</h1>
          {totalTodos > 0 && (
            <Badge variant={'outline'}>
              {completedTodos} of {totalTodos} todos completed
            </Badge>
          )}
        </div>
        <div>
          <Button size="sm" asChild>
            <Link to="/todos/new">
              <Plus /> Add Todo
            </Link>
          </Button>
        </div>
      </div>

      <TodosTable todos={todos} />
    </div>
  )
}
