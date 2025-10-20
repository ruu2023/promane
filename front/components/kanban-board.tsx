// "use client"

// import type React from "react"

// import { useState } from "react"
// import { KanbanColumn } from "./kanban-column"
// import type { Task } from "@/types/task"

// const initialTasks: Task[] = [
//   {
//     id: "1",
//     title: "Implement user authentication",
//     priority: "high",
//     assignee: { name: "Sarah Chen", avatar: "SC" },
//     dueDate: "Oct 28",
//     comments: 5,
//     labels: 2,
//     status: "backlog",
//   },
//   {
//     id: "2",
//     title: "Design dashboard mockups",
//     priority: "medium",
//     assignee: { name: "Alex Morgan", avatar: "AM" },
//     dueDate: "Oct 25",
//     comments: 3,
//     labels: 1,
//     status: "backlog",
//   },
//   {
//     id: "3",
//     title: "Set up CI/CD pipeline",
//     priority: "high",
//     assignee: { name: "Jordan Lee", avatar: "JL" },
//     dueDate: "Oct 30",
//     comments: 8,
//     labels: 3,
//     status: "in-progress",
//   },
//   {
//     id: "4",
//     title: "API integration for payments",
//     priority: "high",
//     assignee: { name: "Taylor Kim", avatar: "TK" },
//     dueDate: "Nov 2",
//     comments: 12,
//     labels: 2,
//     status: "in-progress",
//   },
//   {
//     id: "5",
//     title: "Update documentation",
//     priority: "low",
//     assignee: { name: "Morgan Davis", avatar: "MD" },
//     dueDate: "Oct 27",
//     comments: 2,
//     labels: 1,
//     status: "review",
//   },
//   {
//     id: "6",
//     title: "Fix mobile responsive issues",
//     priority: "medium",
//     assignee: { name: "Casey Park", avatar: "CP" },
//     dueDate: "Oct 26",
//     comments: 6,
//     labels: 2,
//     status: "review",
//   },
//   {
//     id: "7",
//     title: "Database schema optimization",
//     priority: "medium",
//     assignee: { name: "Riley Smith", avatar: "RS" },
//     dueDate: "Oct 20",
//     comments: 4,
//     labels: 1,
//     status: "done",
//   },
//   {
//     id: "8",
//     title: "User onboarding flow",
//     priority: "high",
//     assignee: { name: "Jamie Wilson", avatar: "JW" },
//     dueDate: "Oct 22",
//     comments: 9,
//     labels: 3,
//     status: "done",
//   },
// ]

// export function KanbanBoard() {
//   const [tasks, setTasks] = useState<Task[]>(initialTasks)
//   const [draggedTask, setDraggedTask] = useState<Task | null>(null)

//   const columns = [
//     { id: "backlog", title: "Backlog", status: "backlog" as const },
//     { id: "in-progress", title: "In Progress", status: "in-progress" as const },
//     { id: "review", title: "Review", status: "review" as const },
//     { id: "done", title: "Done", status: "done" as const },
//   ]

//   const handleDragStart = (task: Task) => {
//     setDraggedTask(task)
//   }

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault()
//   }

//   const handleDrop = (status: Task["status"]) => {
//     if (!draggedTask) return

//     setTasks(tasks.map((task) => (task.id === draggedTask.id ? { ...task, status } : task)))
//     setDraggedTask(null)
//   }

//   return (
//     <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
//       {columns.map((column) => (
//         <KanbanColumn
//           key={column.id}
//           title={column.title}
//           tasks={tasks.filter((task) => task.status === column.status)}
//           onDragStart={handleDragStart}
//           onDragOver={handleDragOver}
//           onDrop={() => handleDrop(column.status)}
//         />
//       ))}
//     </div>
//   )
// }
