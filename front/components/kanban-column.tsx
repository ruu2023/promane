// "use client"

// import type React from "react"

// import { TaskCard } from "./task-card"
// import type { Task } from "@/types/task"

// interface KanbanColumnProps {
//   title: string
//   tasks: Task[]
//   onDragStart: (task: Task) => void
//   onDragOver: (e: React.DragEvent) => void
//   onDrop: () => void
// }

// export function KanbanColumn({ title, tasks, onDragStart, onDragOver, onDrop }: KanbanColumnProps) {
//   return (
//     <div className="flex flex-col gap-3" onDragOver={onDragOver} onDrop={onDrop}>
//       {/* Column Header */}
//       <div className="flex items-center justify-between px-1">
//         <h2 className="text-sm font-semibold text-foreground">{title}</h2>
//         <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
//           {tasks.length}
//         </span>
//       </div>

//       {/* Column Content */}
//       <div className="flex min-h-[500px] flex-col gap-3 rounded-lg bg-[var(--color-column-bg)] p-3 border border-border">
//         {tasks.map((task) => (
//           <TaskCard key={task.id} task={task} onDragStart={() => onDragStart(task)} />
//         ))}
//       </div>
//     </div>
//   )
// }
