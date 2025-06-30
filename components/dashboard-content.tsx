"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"
import { DateFilter } from "@/components/date-filter"
import type { DateFilter as DateFilterType } from "@/components/date-filter"
import { getDateRange, isDateInRange } from "@/lib/date-utils"
import { mockTransactions } from "@/lib/mock-data"
import { Overview } from "@/components/overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { IncomeCategoryChart } from "@/components/income-category-chart"
import { ExpenseCategoryChart } from "@/components/expense-category-chart"
import { SpendingTrendsChart } from "@/components/spending-trends-chart"
import { FinancialInsights } from "@/components/financial-insights"
import { MobileDashboardContent } from "@/components/mobile-dashboard-content"
import { useMobile } from "@/hooks/use-mobile"

export function DashboardContent() {
  const { t } = useLanguage()
  const { formatCurrency } = useSettings()
  const [dateFilter, setDateFilter] = useState<DateFilterType>("thisMonth")
  const isMobile = useMobile()

  // Filter transactions based on selected date range
  const filteredTransactions = useMemo(() => {
    const { start, end } = getDateRange(dateFilter)
    return mockTransactions.filter((transaction) => isDateInRange(transaction.date, start, end))
  }, [dateFilter])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const income = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const expenses = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
    const balance = income - expenses
    const savingsRate = income > 0 ? (balance / income) * 100 : 0

    return { income, expenses, balance, savingsRate }
  }, [filteredTransactions])

  // Prepare chart data grouped by month or day based on filter
  const chartData = useMemo(() => {
    const groupedData: { [key: string]: { income: number; expenses: number } } = {}

    filteredTransactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      let key: string

      // Group by day for short periods, by month for longer periods
      if (dateFilter === "today" || dateFilter === "last7Days") {
        key = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      } else if (dateFilter === "last30Days" || dateFilter === "last90Days") {
        key = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      } else {
        key = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      }

      if (!groupedData[key]) {
        groupedData[key] = { income: 0, expenses: 0 }
      }

      if (transaction.type === "income") {
        groupedData[key].income += transaction.amount
      } else {
        groupedData[key].expenses += transaction.amount
      }
    })

    return Object.entries(groupedData)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())
  }, [filteredTransactions, dateFilter])

  // Show mobile version on small screens
  if (isMobile) {
    return <MobileDashboardContent />
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t("dashboard")}</h2>
        <div className="flex items-center space-x-2">
          <DateFilter value={dateFilter} onChange={setDateFilter} />
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("analytics")}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("totalBalance")}</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${summaryStats.balance >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {formatCurrency(summaryStats.balance)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {dateFilter === "allTime" ? t("allTime") : t("forSelectedPeriod")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("totalIncome")}</CardTitle>
                <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-500">{formatCurrency(summaryStats.income)}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredTransactions.filter((t) => t.type === "income").length} {t("transactions")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("totalExpenses")}</CardTitle>
                <ArrowDownIcon className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-rose-500">{formatCurrency(summaryStats.expenses)}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredTransactions.filter((t) => t.type === "expense").length} {t("transactions")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("savingsRate")}</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${summaryStats.savingsRate >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {summaryStats.savingsRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {summaryStats.savingsRate >= 0 ? t("positiveSavings") : t("spendingMoreThanEarning")}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>{t("overview")}</CardTitle>
                <CardDescription>{t("viewIncomeExpenses")}</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={chartData} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>{t("recentTransactions")}</CardTitle>
                <CardDescription>{t("latestFinancialActivities")}</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions transactions={filteredTransactions.slice(-5)} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>{t("incomeByCategory")}</CardTitle>
                <CardDescription>{t("breakdownIncomeSources")}</CardDescription>
              </CardHeader>
              <CardContent>
                <IncomeCategoryChart transactions={filteredTransactions} />
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>{t("expensesByCategory")}</CardTitle>
                <CardDescription>{t("whereMoneyGoing")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseCategoryChart transactions={filteredTransactions} />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("spendingTrends")}</CardTitle>
                <CardDescription>{t("trackSpendingPatterns")}</CardDescription>
              </CardHeader>
              <CardContent>
                <SpendingTrendsChart transactions={filteredTransactions} dateFilter={dateFilter} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("financialInsights")}</CardTitle>
                <CardDescription>{t("personalizedRecommendations")}</CardDescription>
              </CardHeader>
              <CardContent>
                <FinancialInsights transactions={filteredTransactions} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
