"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useGoals } from "@/contexts/goals-context"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"
import { getGoalStatus, getProgressPercentage, getDaysRemaining } from "@/lib/goals"
import { Target, TrendingUp, Calendar, CheckCircle } from "lucide-react"

export function GoalsOverview() {
  const { goals } = useGoals()
  const { t } = useLanguage()
  const { formatCurrency } = useSettings()

  const totalGoalsValue = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const completedGoals = goals.filter((goal) => getGoalStatus(goal) === "completed").length
  const activeGoals = goals.filter((goal) => getGoalStatus(goal) === "inProgress").length

  const averageProgress =
    goals.length > 0
      ? goals.reduce((sum, goal) => sum + getProgressPercentage(goal.currentAmount, goal.targetAmount), 0) /
        goals.length
      : 0

  const upcomingDeadlines = goals.filter((goal) => {
    const daysRemaining = getDaysRemaining(goal.targetDate)
    return daysRemaining > 0 && daysRemaining <= 30 && getGoalStatus(goal) !== "completed"
  }).length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("totalGoalsValue")}</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalGoalsValue)}</div>
          <p className="text-xs text-muted-foreground">
            {goals.length} {t("goals").toLowerCase()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("totalSaved")}</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalSaved)}</div>
          <div className="mt-2">
            <Progress value={totalGoalsValue > 0 ? (totalSaved / totalGoalsValue) * 100 : 0} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalGoalsValue > 0 ? Math.round((totalSaved / totalGoalsValue) * 100) : 0}% {t("of")}{" "}
            {t("totalGoalsValue").toLowerCase()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("averageProgress")}</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(averageProgress)}%</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {completedGoals} {t("completed").toLowerCase()}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {activeGoals} {t("inProgress").toLowerCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("upcomingDeadlines")}</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingDeadlines}</div>
          <p className="text-xs text-muted-foreground">{t("within30Days")}</p>
        </CardContent>
      </Card>
    </div>
  )
}
