export interface Goal {
  id: string
  name: string
  description?: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  category: GoalCategory
  accountId: string
  createdAt: string
  updatedAt: string
}

export type GoalCategory = "travel" | "emergency" | "vehicle" | "home" | "education" | "investment" | "other"

export type GoalStatus = "completed" | "inProgress" | "overdue" | "notStarted"

export const goalCategories: { value: GoalCategory; label: string; icon: string }[] = [
  { value: "travel", label: "Travel", icon: "✈️" },
  { value: "emergency", label: "Emergency Fund", icon: "🚨" },
  { value: "vehicle", label: "Vehicle", icon: "🚗" },
  { value: "home", label: "Home", icon: "🏠" },
  { value: "education", label: "Education", icon: "🎓" },
  { value: "investment", label: "Investment", icon: "📈" },
  { value: "other", label: "Other", icon: "💰" },
]

export function getGoalStatus(goal: Goal): GoalStatus {
  const today = new Date()
  const targetDate = new Date(goal.targetDate)
  const progress = (goal.currentAmount / goal.targetAmount) * 100

  if (progress >= 100) {
    return "completed"
  }

  if (targetDate < today) {
    return "overdue"
  }

  if (goal.currentAmount > 0) {
    return "inProgress"
  }

  return "notStarted"
}

export function getDaysRemaining(targetDate: string): number {
  const today = new Date()
  const target = new Date(targetDate)
  const diffTime = target.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function getProgressPercentage(currentAmount: number, targetAmount: number): number {
  return Math.min((currentAmount / targetAmount) * 100, 100)
}

// Mock data for development
export const mockGoals: Goal[] = [
  {
    id: "1",
    name: "Emergency Fund",
    description: "Save for unexpected expenses",
    targetAmount: 10000,
    currentAmount: 3500,
    targetDate: "2024-12-31",
    category: "emergency",
    accountId: "1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Vacation to Europe",
    description: "Trip to Paris and Rome",
    targetAmount: 5000,
    currentAmount: 2100,
    targetDate: "2024-08-15",
    category: "travel",
    accountId: "2",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "3",
    name: "New Car",
    description: "Down payment for new vehicle",
    targetAmount: 15000,
    currentAmount: 8500,
    targetDate: "2024-06-30",
    category: "vehicle",
    accountId: "1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-25T00:00:00Z",
  },
]
