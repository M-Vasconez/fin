"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useGoals } from "@/contexts/goals-context"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"
import { useAccounts } from "@/contexts/accounts-context"
import { getGoalStatus, getProgressPercentage, getDaysRemaining, goalCategories } from "@/lib/goals"
import { EditGoalForm } from "./edit-goal-form"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { Edit, Trash2, Calendar, Target } from "lucide-react"

export function GoalsList() {
  const { goals, deleteGoal } = useGoals()
  const { t } = useLanguage()
  const { formatCurrency, formatDate } = useSettings()
  const { accounts } = useAccounts()
  const [editingGoal, setEditingGoal] = useState<string | null>(null)
  const [deletingGoal, setDeletingGoal] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "inProgress":
        return "bg-blue-500"
      case "overdue":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default" as const
      case "inProgress":
        return "secondary" as const
      case "overdue":
        return "destructive" as const
      default:
        return "outline" as const
    }
  }

  if (goals.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t("noGoals")}</h3>
          <p className="text-muted-foreground text-center max-w-md">{t("noGoalsDescription")}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const status = getGoalStatus(goal)
          const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount)
          const daysRemaining = getDaysRemaining(goal.targetDate)
          const account = accounts.find((acc) => acc.id === goal.accountId)
          const category = goalCategories.find((cat) => cat.value === goal.category)

          return (
            <Card key={goal.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category?.icon}</span>
                    <div>
                      <CardTitle className="text-base">{goal.name}</CardTitle>
                      <CardDescription className="text-sm">{t(goal.category)}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditingGoal(goal.id)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingGoal(goal.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{t("progress")}</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between items-center text-sm">
                    <span>{formatCurrency(goal.currentAmount)}</span>
                    <span className="text-muted-foreground">
                      {t("of")} {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(goal.targetDate)}</span>
                    {status === "overdue" ? (
                      <Badge variant="destructive" className="text-xs">
                        {Math.abs(daysRemaining)} {t("daysOverdue")}
                      </Badge>
                    ) : status === "completed" ? (
                      <Badge variant="default" className="text-xs">
                        {t("completed")}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {daysRemaining} {t("daysLeft")}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant={getStatusVariant(status)} className="text-xs">
                      {t(status)}
                    </Badge>
                    {account && <span className="text-xs text-muted-foreground">{account.name}</span>}
                  </div>
                </div>

                {goal.description && <p className="text-sm text-muted-foreground line-clamp-2">{goal.description}</p>}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {editingGoal && <EditGoalForm goalId={editingGoal} onClose={() => setEditingGoal(null)} />}

      {deletingGoal && (
        <DeleteConfirmationDialog
          open={!!deletingGoal}
          onOpenChange={() => setDeletingGoal(null)}
          onConfirm={() => {
            if (deletingGoal) {
              deleteGoal(deletingGoal)
              setDeletingGoal(null)
            }
          }}
          title={t("deleteGoal")}
          description={t("deleteGoalConfirm")}
        />
      )}
    </>
  )
}
