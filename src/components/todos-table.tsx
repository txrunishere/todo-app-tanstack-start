import type { Todo } from '@/generated/prisma/browser'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Edit, ListCheckIcon, Plus, Trash } from 'lucide-react'
import { Button } from './ui/button'
import { Link, useRouter } from '@tanstack/react-router'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import z from 'zod'
import { prisma } from '@/db/prisma'

const deleteTodoServerFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string().min(1, 'ID is required') }))
  .handler(async ({ data: { id } }) => {
    await prisma.todo.delete({
      where: {
        id,
      },
    })

    return { error: false }
  })

const toggleTodoServerFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string().min(1, 'ID is required'),
      isCompleted: z.boolean(),
    }),
  )
  .handler(async ({ data }) => {
    const { id, isCompleted } = data

    await prisma.todo.update({
      where: {
        id,
      },
      data: {
        isCompleted,
      },
    })
  })

export const TodosTable = ({ todos }: { todos: Todo[] }) => {
  const deleteTodo = useServerFn(deleteTodoServerFn)
  const toggleTodo = useServerFn(toggleTodoServerFn)
  const router = useRouter()

  if (todos.length === 0) {
    return (
      <Empty className="border max-w-4xl mx-auto">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ListCheckIcon />
          </EmptyMedia>
          <EmptyTitle>No Todos</EmptyTitle>
          <EmptyDescription>Try adding a new todo</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="secondary" size="sm">
            <Link to="/todos/new">
              <Plus />
              Add Todo
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Task</TableHead>
          <TableHead>Created On</TableHead>
          <TableHead className="w-0"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {todos.map((todo) => (
          <TableRow
            key={todo.id}
            onClick={async (e) => {
              const target = e.target as HTMLElement
              if (
                target.tagName === 'BUTTON' ||
                target.closest('button') ||
                target.tagName === 'A' ||
                target.closest('a')
              )
                return

              await toggleTodo({
                data: { id: todo.id, isCompleted: !todo.isCompleted },
              })
              router.invalidate()
            }}
          >
            <TableCell>
              <Checkbox checked={todo.isCompleted} />
            </TableCell>
            <TableCell
              className={cn('font-medium', todo.isCompleted && 'line-through')}
            >
              {todo.name}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {todo.created_at.toLocaleDateString()}
            </TableCell>
            <TableCell className="flex items-center gap-2">
              <Button size="sm" variant="secondary" asChild>
                <Link to={`/todos/$id/edit`} params={{ id: todo.id }}>
                  <Edit />
                </Link>
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={async () => {
                  await deleteTodo({ data: { id: todo.id } })
                  router.invalidate()
                }}
              >
                <Trash />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
