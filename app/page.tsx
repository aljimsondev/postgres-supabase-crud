'use client';

import QueryProvider from '@/components/providers/QueryProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Todo as TodoType } from '@/lib/database/schema';
import { useQuery } from '@tanstack/react-query';
import { SQLWrapper } from 'drizzle-orm';
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import { addTodo } from './_actions/add-todo.action';
import { deleteTodo } from './_actions/delete-todo.action';
import { getTodos } from './_actions/get-todos.action';
import { updateTodo } from './_actions/update-todo.action';

export default function Home() {
  return (
    <QueryProvider>
      <Todo />
    </QueryProvider>
  );
}

function Todo() {
  const [newTodo, setNewTodo] = useState('');
  const {
    data = [],
    isFetching,
    refetch,
  } = useQuery({
    queryFn: () => getTodos(),
    queryKey: [],
  });
  const [selectedTodo, setSelectedTodo] = useState<TodoType | null>(null);

  const handleTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!newTodo) return;

      const result = await addTodo(newTodo);

      // after new todo is added enable refetch to fetch new data added
      if (result) {
        setNewTodo('');
        refetch();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDeleteTodo = async (id: number | SQLWrapper) => {
    try {
      const deletedTodo = await deleteTodo(id);

      if (deletedTodo) {
        // reload the todos
        refetch(); // refresh todos
        alert('Todo deleted successfully!');
      }
    } catch (e) {
      if (e instanceof Error) {
        return alert(e.message);
      }
      console.warn(e);
    }
  };

  const handleUpdateTodo = async (
    id: number | SQLWrapper,
    updatedTodo: string,
  ) => {
    try {
      const result = await updateTodo(id, updatedTodo);

      if (result) {
        refetch();
        setSelectedTodo(null); // reset the selected todo;
        alert('Todo updated successfully!');
      }
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
      console.warn(e);
    }
  };

  return (
    <main className="container mx-auto py-8">
      <Card>
        <CardContent>
          <CardHeader className="relative items-center px-0">
            <CardTitle>Todos</CardTitle>
          </CardHeader>
          <form className="mt-4" method="POST" onSubmit={handleSubmit}>
            <div className="flex items-center gap-4">
              <Input
                value={newTodo}
                onChange={handleTextChange}
                placeholder="Add new todo..."
              />
              <Button type="submit">Add Todo</Button>
            </div>
          </form>
          <ul>
            {data.map((todo) => {
              return (
                <TodoField
                  edit={selectedTodo?.id === todo.id}
                  key={todo.id}
                  todo={todo}
                  handleDeleteTodo={handleDeleteTodo}
                  setEditSelection={setSelectedTodo}
                  handleUpdateTodo={handleUpdateTodo}
                />
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}

function TodoField({
  todo,
  edit = false,
  handleDeleteTodo,
  setEditSelection,
  handleUpdateTodo,
}: {
  todo: TodoType;
  edit: boolean;
  handleDeleteTodo: (id: number | SQLWrapper) => void;
  setEditSelection: Dispatch<SetStateAction<TodoType | null>>;
  handleUpdateTodo: (
    id: number | SQLWrapper,
    updatedTodo: string,
  ) => Promise<void>;
}) {
  const [updatedTodo, setUpdatedTodo] = useState<string>(todo.todo);

  return (
    <div key={todo.id} className="p-4 flex items-center justify-between gap-2">
      {edit ? (
        <Input
          value={updatedTodo}
          onChange={(e) => setUpdatedTodo(e.target.value)}
        />
      ) : (
        <p>{todo.todo}</p>
      )}
      {edit ? (
        <div className="flex items-center gap-2">
          <Button onClick={() => handleUpdateTodo(todo.id, updatedTodo)}>
            Save
          </Button>
          <Button variant="outline" onClick={() => setEditSelection(null)}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button onClick={() => setEditSelection(todo)}>Edit</Button>
          <Button
            variant="destructive"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
