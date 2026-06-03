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
import { Link } from '@tanstack/react-router'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export const TodosTable = ({ todos }: { todos: Todo[] }) => {
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
          <TableRow key={todo.id}>
            <TableCell>
              <Checkbox />
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
              <Button size="sm" variant="destructive">
                <Trash />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
