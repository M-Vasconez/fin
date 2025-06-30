"use client"

import { useMemo, useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useTheme } from "next-themes"
import { useLanguage } from "@/contexts/language-context"
import type { Transaction } from "@/lib/mock-data"

interface ExpenseCategoryChartProps {
  transactions: Transaction[]
}

const COLORS = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#f59e0b", // amber-500
  "#eab308", // yellow-500
  "#84cc16", // lime-500
  "#22c55e", // green-500
  "#06b6d4", // cyan-500
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#d946ef", // fuchsia-500
]

const DARK_COLORS = [
  "#f87171", // red-400
  "#fb923c", // orange-400
  "#fbbf24", // amber-400
  "#facc15", // yellow-400
  "#a3e635", // lime-400
  "#4ade80", // green-400
  "#22d3ee", // cyan-400
  "#60a5fa", // blue-400
  "#a78bfa", // violet-400
  "#e879f9", // fuchsia-400
]

export function ExpenseCategoryChart({ transactions }: ExpenseCategoryChartProps) {
  const { t } = useLanguage()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const chartData = useMemo(() => {
    const expenseTransactions = transactions.filter((t) => t.type === "expense")
    const categoryTotals: { [key: string]: number } = {}

    expenseTransactions.forEach((transaction) => {
      categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount
    })

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        percentage: 0, // Will be calculated after sorting
      }))
      .sort((a, b) => b.value - a.value)
      .map((item, index, array) => {
        const total = array.reduce((sum, item) => sum + item.value, 0)
        return {
          ...item,
          percentage: total > 0 ? (item.value / total) * 100 : 0,
        }
      })
  }, [transactions])

  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0)
  const colors = mounted && resolvedTheme === "dark" ? DARK_COLORS : COLORS

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">{t("noExpenseEntries")}</div>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-rose-600 dark:text-rose-400">
            ${data.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-muted-foreground">{data.percentage.toFixed(1)}% of total expenses</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="space-y-2">
        <div className="flex justify-between items-center pb-2 border-b">
          <span className="font-medium">{t("totalExpenses")}</span>
          <span className="font-semibold text-rose-600 dark:text-rose-400">
            ${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
              <span className="text-sm">{item.name}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                ${item.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
