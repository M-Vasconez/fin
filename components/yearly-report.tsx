"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"

const yearlyData = [
  {
    year: "2019",
    income: 35000,
    expenses: 28000,
    savings: 7000,
  },
  {
    year: "2020",
    income: 38000,
    expenses: 29000,
    savings: 9000,
  },
  {
    year: "2021",
    income: 42000,
    expenses: 31000,
    savings: 11000,
  },
  {
    year: "2022",
    income: 48000,
    expenses: 35000,
    savings: 13000,
  },
  {
    year: "2023",
    income: 52000,
    expenses: 38000,
    savings: 14000,
  },
]

export function YearlyReport() {
  const { t } = useLanguage()
  const { formatCurrency } = useSettings()

  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={yearlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
          <Bar dataKey="income" name={t("income")} fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name={t("expenses")} fill="#ef4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="savings" name="Savings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t("yearlySummary")}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">{t("totalIncome5Years")}</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(215000)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">{t("totalExpenses5Years")}</span>
                <span className="font-semibold text-rose-600">{formatCurrency(161000)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">{t("totalSavings5Years")}</span>
                <span className="font-semibold text-blue-600">{formatCurrency(54000)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">{t("averageSavingsRate")}</span>
                <span className="font-semibold">25.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t("yearlyGrowth")}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">{t("incomeGrowth")}</span>
                <span className="font-semibold text-emerald-600">+8.3%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">{t("expenseGrowth")}</span>
                <span className="font-semibold text-rose-600">+8.6%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">{t("savingsGrowth")}</span>
                <span className="font-semibold text-blue-600">+7.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">{t("fiveYearCAGR")}</span>
                <span className="font-semibold">10.4%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
