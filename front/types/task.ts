export interface Task {
  id: string
  title: string
  priority: "high" | "medium" | "low"
  assignee: {
    name: string
    avatar: string
  }
  dueDate: string
  comments: number
  labels: number
  status: "backlog" | "in-progress" | "review" | "done"
}
