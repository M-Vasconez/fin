"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUpIcon, TrendingDownIcon, AlertTriangleIcon, CheckCircleIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Transaction } from "@/lib/mock-data"

interface FinancialInsightsProps {
  transactions: Transaction[]
}

export function FinancialInsights({ transactions }: FinancialInsightsProps) {
  const { t } = useLanguage()

  const insights = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
    const balance = income - expenses
    const savingsRate = income > 0 ? (balance / income) * 100 : 0

    // Category analysis
    const expensesByCategory: { [key: string]: number } = {}
    const incomeByCategory: { [key: string]: number } = {}

    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount
      } else {
        incomeByCategory[transaction.category] = (incomeByCategory[transaction.category] || 0) + transaction.amount
      }
    })

    const topExpenseCategory = Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a)[0]
    const topIncomeCategory = Object.entries(incomeByCategory).sort(([, a], [, b]) => b - a)[0]

    // Generate insights
    const insights = []

    // Savings rate insight
    if (savingsRate >= 20) {
      insights.push({
        type: "positive",
        title: "Excellent Savings Rate",
        description: `You're saving ${savingsRate.toFixed(1)}% of your income. Keep up the great work!`,
        icon: CheckCircleIcon,
      })
    } else if (savingsRate >= 10) {
      insights.push({
        type: "neutral",
        title: "Good Savings Rate",
        description: `You're saving ${savingsRate.toFixed(1)}% of your income. Consider increasing to 20% if possible.`,
        icon: TrendingUpIcon,
      })
    } else if (savingsRate > 0) {
      insights.push({
        type: "warning",
        title: "Low Savings Rate",
        description: `You're only saving ${savingsRate.toFixed(1)}% of your income. Try to reduce expenses or increase income.`,
        icon: AlertTriangleIcon,
      })
    } else {
      insights.push({
        type: "negative",
        title: "Spending More Than Earning",
        description: "You're spending more than you earn. Review your expenses and consider budget adjustments.",
        icon: TrendingDownIcon,
      })
    }

    // Top expense category insight
    if (topExpenseCategory && expenses > 0) {
      const percentage = (topExpenseCategory[1] / expenses) * 100
      if (percentage > 50) {
        insights.push({
          type: "warning",
          title: "High Category Spending",
          description: `${topExpenseCategory[0]} accounts for ${percentage.toFixed(1)}% of your expenses. Consider if this is sustainable.`,
          icon: AlertTriangleIcon,
        })
      } else {
        insights.push({
          type: "neutral",
          title: "Spending Distribution",
          description: `Your largest expense category is ${topExpenseCategory[0]} at ${percentage.toFixed(1)}% of total expenses.`,
          icon: TrendingUpIcon,
        })
      }
    }

    // Income diversity insight
    const incomeSourceCount = Object.keys(incomeByCategory).length
    if (incomeSourceCount === 1) {
      insights.push({
        type: "warning",
        title: "Single Income Source",
        description: "Consider diversifying your income sources for better financial security.",
        icon: AlertTriangleIcon,
      })
    } else if (incomeSourceCount >= 3) {
      insights.push({
        type: "positive",
        title: "Diversified Income",
        description: `You have ${incomeSourceCount} income sources. This provides good financial stability.`,
        icon: CheckCircleIcon,
      })
    }

    // Transaction frequency insight
    const transactionCount = transactions.length
    if (transactionCount > 0) {
      const avgTransactionSize = (income + expenses) / transactionCount
      if (avgTransactionSize > 1000) {
        insights.push({
          type: "neutral",
          title: "Large Transactions",
          description: `Your average transaction size is $${avgTransactionSize.toFixed(0)}. Monitor large expenses carefully.`,
          icon: TrendingUpIcon,
        })
      }
    }

    return insights
  }, [transactions])

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive":
        return "text-emerald-600 bg-emerald-50 border-emerald-200"
      case "warning":
        return "text-amber-600 bg-amber-50 border-amber-200"
      case "negative":
        return "text-rose-600 bg-rose-50 border-rose-200"
      default:
        return "text-blue-600 bg-blue-50 border-blue-200"
    }
  }

  const getInsightBadgeColor = (type: string) => {
    switch (type) {
      case "positive":
        return "bg-emerald-100 text-emerald-800"
      case "warning":
        return "bg-amber-100 text-amber-800"
      case "negative":
        return "bg-rose-100 text-rose-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  if (insights.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No insights available for the selected period
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => {
        const Icon = insight.icon
        return (
          <Card key={index} className={`border-l-4 ${getInsightColor(insight.type)}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge variant="secondary" className={getInsightBadgeColor(insight.type)}>
                      {insight.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
