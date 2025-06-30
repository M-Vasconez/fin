"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoalsOverview } from "./goals-overview"
import { GoalsList } from "./goals-list"
import { AddGoalForm } from "./add-goal-form"
import { useLanguage } from "@/contexts/language-context"
import { Target } from "lucide-react"

export function GoalsPageContent() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-6 w-6 md:h-8 md:w-8" />
            {t("goals")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("manageGoalsDescription")}</p>
        </div>
        <AddGoalForm />
      </div>

      <GoalsOverview />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">{t("allGoals")}</TabsTrigger>
          <TabsTrigger value="active">{t("activeGoals")}</TabsTrigger>
          <TabsTrigger value="completed">{t("completedGoals")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("allGoals")}</CardTitle>
              <CardDescription>{t("manageGoalsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <GoalsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("activeGoals")}</CardTitle>
              <CardDescription>{t("goalsOnTrack")}</CardDescription>
            </CardHeader>
            <CardContent>
              <GoalsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("completedGoals")}</CardTitle>
              <CardDescription>{t("completedGoals")}</CardDescription>
            </CardHeader>
            <CardContent>
              <GoalsList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
