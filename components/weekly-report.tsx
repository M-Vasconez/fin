"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"

const weeklyData = [
  {
    week: "Week 1",
    income: 4000,
    expenses: 2400,
    balance: 1600,
  },
  {
    week: "Week 2",
    income: 3000,
    expenses: 1398,
    balance: 1602,
  },
  {
    week: "Week 3",
    income: 2000,
    expenses: 1800,
    balance: 200,
  },
  {
    week: "Week 4",
    income: 2780,
    expenses: 3908,
    balance: -1128,
  },
]

export function WeeklyReport() {
  const { t } = useLanguage()
  const { formatCurrency } = useSettings()

  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
          <Bar dataKey="income" name={t("income")} fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name={t("expenses")} fill="#ef4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="balance" name="Balance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t("weeklySummary")}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">{t("totalIncome")}</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(11780)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">{t("totalExpenses")}</span>
                <span className="font-semibold text-rose-600">{formatCurrency(9506)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Net Balance</span>
                <span className="font-semibold text-blue-600">{formatCurrency(2274)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">{t("savingsRate")}</span>
                <span className="font-semibold">19.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t("topCategories")}</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">{t("income")}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>{t("salary")}</span>
                    <span className="font-medium">{formatCurrency(7000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t("freelance")}</span>
                    <span className="font-medium">{formatCurrency(2500)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t("investment")}</span>
                    <span className="font-medium">{formatCurrency(2000)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">{t("expenses")}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>{t("housing")}</span>
                    <span className="font-medium">{formatCurrency(3000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t("food")}</span>
                    <span className="font-medium">{formatCurrency(1500)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t("utilities")}</span>
                    <span className="font-medium">{formatCurrency(800)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
