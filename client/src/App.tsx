import React, { useState } from "react";
import axios from "axios";
interface Todo {
  id: number;
  task: string;
  due_date: string;
}

const App: React.FC = () => {
  // State to manage the list of todos
  const [todos, setTodos] = useState<Todo[]>([]);
  // State to manage the input values
  const [task, setTask] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");

  const getAll = () => {
    axios.get("http://localhost:5000/all").then((res): void => {
      setTodos(res.data);
    });
  };

  const addItem = async () => {
    if (task.trim() !== "") {
      try {
        const response = await axios.post("http://localhost:5000/add", {
          task: task,
          due_date: dueDate,
        });
        const newTodo: Todo = response.data;
        setTodos([...todos, newTodo]);
        setTask("");
        setDueDate("");
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const removeTodo = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${id}`);
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error removing todo:", error);
    }
  };

  const updateTodo = async (id: number, updatedTodo: Todo) => {
    try {
      await axios.put(`http://localhost:5000/update/${id}`, updatedTodo);
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, ...updatedTodo } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="mb-4">
        <input
          type="text"
          className="w-full border border-gray-300 rounded py-2 px-3 mr-2 focus:outline-none focus:border-blue-500"
          placeholder="Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input
          type="date"
          className="border border-gray-300 rounded py-2 px-3 mr-2 my-2 focus:outline-none focus:border-blue-500"
          placeholder="Due Date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addItem}
        >
          Add
        </button>
        <button
          className="bg-red-500 text-white mx-2 px-4 py-2 rounded"
          onClick={getAll}
        >
          Show
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between border-b border-gray-300 py-2"
          >
            <span>{todo.task}</span>
            <span>{todo.due_date}</span>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => removeTodo(todo.id)}
            >
              Remove
            </button>
            <button
              className="text-yellow-500 hover:text-yellow-500"
              onClick={() =>
                updateTodo(todo.id, { ...todo, task: task })
              }
            >
              Update
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
