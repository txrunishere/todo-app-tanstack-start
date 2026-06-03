import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TodoForm } from '@/components/todo-form'

export const Route = createFileRoute('/todos/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto space-y-18 p-8">
      <Button asChild variant="link">
        <Link to="/">
          <ArrowLeft /> Todo List
        </Link>
      </Button>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Todo</CardTitle>
          <CardDescription>
            Create a new task to add to your list
          </CardDescription>
        </CardHeader>

        <CardContent>
          <TodoForm todo={null} />
        </CardContent>
      </Card>
    </div>
  )
}
