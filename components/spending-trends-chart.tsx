"use client"

import { useMemo, useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useTheme } from "next-themes"
import { useLanguage } from "@/contexts/language-context"
import type { Transaction } from "@/lib/mock-data"
import type { DateFilter as DateFilterType } from "@/components/date-filter"

interface SpendingTrendsChartProps {
  transactions: Transaction[]
  dateFilter: DateFilterType
}

export function SpendingTrendsChart({ transactions, dateFilter }: SpendingTrendsChartProps) {
  const { t } = useLanguage()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const chartData = useMemo(() => {
    const groupedData: { [key: string]: { income: number; expenses: number; net: number } } = {}

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      let key: string

      // Group by appropriate time period based on filter
      if (dateFilter === "today" || dateFilter === "last7Days") {
        key = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      } else if (dateFilter === "last30Days") {
        // Group by week for 30 days
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = `Week of ${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
      } else if (dateFilter === "last90Days") {
        // Group by week for 90 days
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = `Week of ${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
      } else {
        // Group by month for longer periods
        key = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      }

      if (!groupedData[key]) {
        groupedData[key] = { income: 0, expenses: 0, net: 0 }
      }

      if (transaction.type === "income") {
        groupedData[key].income += transaction.amount
      } else {
        groupedData[key].expenses += transaction.amount
      }
      groupedData[key].net = groupedData[key].income - groupedData[key].expenses
    })

    return Object.entries(groupedData)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => {
        // Sort by date
        const dateA = new Date(a.name.replace("Week of ", ""))
        const dateB = new Date(b.name.replace("Week of ", ""))
        return dateA.getTime() - dateB.getTime()
      })
  }, [transactions, dateFilter])

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No data available for the selected period
      </div>
    )
  }

  // Use resolvedTheme and mounted state for proper theme detection
  const isDark = mounted && resolvedTheme === "dark"

  // Dynamic colors based on theme
  const gridColor = isDark ? "hsl(217.2 32.6% 17.5%)" : "hsl(214.3 31.8% 91.4%)"
  const textColor = isDark ? "hsl(210 40% 98%)" : "hsl(222.2 84% 4.9%)"
  const incomeColor = isDark ? "#34d399" : "#10b981"
  const expenseColor = isDark ? "#f87171" : "#ef4444"
  const netColor = isDark ? "#60a5fa" : "#3b82f6"

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: $
              {entry.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="name"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          angle={-45}
          textAnchor="end"
          height={60}
          tick={{ fill: textColor }}
        />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          tick={{ fill: textColor }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="income"
          name={t("income")}
          stroke={incomeColor}
          strokeWidth={2}
          dot={{ fill: incomeColor, strokeWidth: 2, r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="expenses"
          name={t("expenses")}
          stroke={expenseColor}
          strokeWidth={2}
          dot={{ fill: expenseColor, strokeWidth: 2, r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="net"
          name="Net Income"
          stroke={netColor}
          strokeWidth={2}
          dot={{ fill: netColor, strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
