"use client"

import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"

const monthlyData = [
  {
    month: "Jan",
    income: 4000,
    expenses: 2400,
    balance: 1600,
  },
  {
    month: "Feb",
    income: 3000,
    expenses: 1398,
    balance: 1602,
  },
  {
    month: "Mar",
    income: 5000,
    expenses: 3800,
    balance: 1200,
  },
  {
    month: "Apr",
    income: 2780,
    expenses: 3908,
    balance: -1128,
  },
  {
    month: "May",
    income: 1890,
    expenses: 4800,
    balance: -2910,
  },
  {
    month: "Jun",
    income: 2390,
    expenses: 3800,
    balance: -1410,
  },
]

export function MonthlyReport() {
  const { t } = useLanguage()
  const { formatCurrency } = useSettings()

  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
          <Line type="monotone" dataKey="income" name={t("income")} stroke="#10b981" strokeWidth={2} />
          <Line type="monotone" dataKey="expenses" name={t("expenses")} stroke="#ef4444" strokeWidth={2} />
          <Line type="monotone" dataKey="balance" name="Balance" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t("monthlyTrends")}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">{t("averageMonthlyIncome")}</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(3176.67)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">{t("averageMonthlyExpenses")}</span>
                <span className="font-semibold text-rose-600">{formatCurrency(3351)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">{t("averageMonthlyBalance")}</span>
                <span className="font-semibold text-blue-600">{formatCurrency(-174.33)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">{t("monthsPositiveBalance")}</span>
                <span className="font-semibold">3 of 6</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t("monthlyHighlights")}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">{t("highestIncomeMonth")}</span>
                <div className="text-right">
                  <div className="font-semibold">March</div>
                  <div className="text-sm text-emerald-600">{formatCurrency(5000)}</div>
                </div>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">{t("highestExpenseMonth")}</span>
                <div className="text-right">
                  <div className="font-semibold">May</div>
                  <div className="text-sm text-rose-600">{formatCurrency(4800)}</div>
                </div>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">{t("bestSavingsMonth")}</span>
                <div className="text-right">
                  <div className="font-semibold">February</div>
                  <div className="text-sm text-blue-600">{formatCurrency(1602)}</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">{t("worstSavingsMonth")}</span>
                <div className="text-right">
                  <div className="font-semibold">May</div>
                  <div className="text-sm text-red-600">{formatCurrency(-2910)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
