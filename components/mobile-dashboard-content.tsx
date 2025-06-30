"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowDownIcon, ArrowUpIcon, DownloadIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"
import { DateFilter } from "@/components/date-filter"
import type { DateFilter as DateFilterType } from "@/components/date-filter"
import { getDateRange, isDateInRange } from "@/lib/date-utils"
import { mockTransactions } from "@/lib/mock-data"
import { RecentTransactions } from "@/components/recent-transactions"

export function MobileDashboardContent() {
  const { t } = useLanguage()
  const { formatCurrency } = useSettings()
  const [dateFilter, setDateFilter] = useState<DateFilterType>("thisMonth")

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

  return (
    <div className="flex-1 space-y-4 p-3">
      {/* Mobile Header */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight">{t("dashboard")}</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <DateFilter value={dateFilter} onChange={setDateFilter} />
          <Button size="sm" variant="outline" className="w-full sm:w-auto">
            <DownloadIcon className="mr-2 h-4 w-4" />
            {t("export")}
          </Button>
        </div>
      </div>

      {/* Mobile Stats Cards - 2x2 Grid */}
      <div className="grid grid-cols-1 gap-3">
        {/* Main Balance Card - Full Width */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t("totalBalance")}</p>
                <p className={`text-2xl font-bold ${summaryStats.balance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {formatCurrency(summaryStats.balance)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {dateFilter === "allTime" ? "All time" : "Selected period"}
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${summaryStats.balance >= 0 ? "bg-emerald-100 dark:bg-emerald-900" : "bg-rose-100 dark:bg-rose-900"}`}
              >
                {summaryStats.balance >= 0 ? (
                  <TrendingUpIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <TrendingDownIcon className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Income and Expenses - Side by Side */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ArrowUpIcon className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{t("income")}</p>
                </div>
                <p className="text-lg font-bold text-emerald-600">{formatCurrency(summaryStats.income)}</p>
                <p className="text-xs text-muted-foreground">
                  {filteredTransactions.filter((t) => t.type === "income").length} entries
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950 dark:to-red-950 border-rose-200 dark:border-rose-800">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ArrowDownIcon className="h-4 w-4 text-rose-600" />
                  <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{t("expenses")}</p>
                </div>
                <p className="text-lg font-bold text-rose-600">{formatCurrency(summaryStats.expenses)}</p>
                <p className="text-xs text-muted-foreground">
                  {filteredTransactions.filter((t) => t.type === "expense").length} entries
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Savings Rate Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("savingsRate")}</p>
                <p
                  className={`text-xl font-bold ${summaryStats.savingsRate >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {summaryStats.savingsRate.toFixed(1)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {summaryStats.savingsRate >= 0 ? "Positive savings" : "Overspending"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t("recentTransactions")}</CardTitle>
          <CardDescription className="text-sm">{t("latestFinancialActivities")}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-4 pb-4">
            <RecentTransactions transactions={filteredTransactions.slice(-8)} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
