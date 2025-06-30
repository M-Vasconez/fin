"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"
import { DailyReport } from "@/components/daily-report"
import { WeeklyReport } from "@/components/weekly-report"
import { MonthlyReport } from "@/components/monthly-report"
import { YearlyReport } from "@/components/yearly-report"
import { useLanguage } from "@/contexts/language-context"
import { SettingsProvider } from "@/contexts/settings-context"

export function ReportsPageContent() {
  const { t } = useLanguage()

  return (
    <SettingsProvider>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{t("reports")}</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button size="sm">
              <DownloadIcon className="mr-2 h-4 w-4" />
              {t("export")}
            </Button>
          </div>
        </div>
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">{t("daily")}</TabsTrigger>
            <TabsTrigger value="weekly">{t("weekly")}</TabsTrigger>
            <TabsTrigger value="monthly">{t("monthly")}</TabsTrigger>
            <TabsTrigger value="yearly">{t("yearly")}</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("dailyReport")}</CardTitle>
                <CardDescription>{t("viewIncomeExpensesDaily")}</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <DailyReport />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="weekly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("weeklyReport")}</CardTitle>
                <CardDescription>{t("viewIncomeExpensesWeekly")}</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <WeeklyReport />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("monthlyReport")}</CardTitle>
                <CardDescription>{t("viewIncomeExpensesMonthly")}</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <MonthlyReport />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="yearly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("yearlyReport")}</CardTitle>
                <CardDescription>{t("viewIncomeExpensesYearly")}</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <YearlyReport />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsProvider>
  )
}
