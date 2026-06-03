import { Input } from '@/components/ui/input'
import { prisma } from '@/db/prisma'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { useRef, useState } from 'react'
import { z } from 'zod'
import { redirect } from '@tanstack/react-router'
import type { Todo } from '@/generated/prisma/browser'

const addTodoServerFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ task: z.string().min(1, 'Task cannot be empty') }))
  .handler(async ({ data }) => {
    await prisma.todo.create({
      data: {
        name: data.task,
        isCompleted: false,
      },
    })

    throw redirect({ to: '/' })
  })

const editTodoServerFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string().min(1, 'ID is required'),
      task: z.string().min(1, 'Task cannot be empty'),
    }),
  )
  .handler(async ({ data }) => {
    await prisma.todo.update({
      where: { id: data.id },
      data: {
        name: data.task,
      },
    })

    throw redirect({ to: '/' })
  })

export const TodoForm = ({ todo }: { todo: Todo | null }) => {
  const todoInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const addTodo = useServerFn(addTodoServerFn)
  const editTodo = useServerFn(editTodoServerFn)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (todoInputRef.current && todoInputRef.current.value.trim() !== '') {
      setLoading(true)

      try {
        if (!todo || !todo.id || todo === null) {
          await addTodo({ data: { task: todoInputRef.current.value } })
        } else {
          await editTodo({
            data: { id: todo.id, task: todoInputRef.current.value },
          })
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          autoFocus
          id="task"
          placeholder="Buy groceries"
          type="text"
          ref={todoInputRef}
          aria-label="Task"
          disabled={loading}
          defaultValue={todo?.name}
        />
      </form>
    </div>
  )
}
