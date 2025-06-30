"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"

const dailyData = [
  {
    date: "2023-06-01",
    income: 3500,
    expenses: 1200,
  },
  {
    date: "2023-06-02",
    income: 0,
    expenses: 85.75,
  },
  {
    date: "2023-06-03",
    income: 0,
    expenses: 0,
  },
  {
    date: "2023-06-04",
    income: 0,
    expenses: 0,
  },
  {
    date: "2023-06-05",
    income: 500,
    expenses: 120,
  },
  {
    date: "2023-06-06",
    income: 0,
    expenses: 45.99,
  },
  {
    date: "2023-06-07",
    income: 0,
    expenses: 60,
  },
]

const transactions = [
  {
    id: "1",
    date: "2023-06-01",
    amount: 3500,
    description: "Monthly Salary",
    category: "Salary",
    type: "income",
  },
  {
    id: "2",
    date: "2023-06-01",
    amount: 1200,
    description: "Rent Payment",
    category: "Housing",
    type: "expense",
  },
  {
    id: "3",
    date: "2023-06-02",
    amount: 85.75,
    description: "Grocery Shopping",
    category: "Food",
    type: "expense",
  },
  {
    id: "4",
    date: "2023-06-05",
    amount: 500,
    description: "Freelance Project",
    category: "Freelance",
    type: "income",
  },
  {
    id: "5",
    date: "2023-06-05",
    amount: 120,
    description: "Electric Bill",
    category: "Utilities",
    type: "expense",
  },
  {
    id: "6",
    date: "2023-06-06",
    amount: 45.99,
    description: "Internet Subscription",
    category: "Utilities",
    type: "expense",
  },
  {
    id: "7",
    date: "2023-06-07",
    amount: 60,
    description: "Dinner with Friends",
    category: "Entertainment",
    type: "expense",
  },
]

export function DailyReport() {
  const { t } = useLanguage()
  const { formatCurrency, formatDate } = useSettings()

  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={dailyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(value) => formatDate(value)} />
          <YAxis />
          <Tooltip formatter={(value: number) => formatCurrency(value)} labelFormatter={(value) => formatDate(value)} />
          <Legend />
          <Bar dataKey="income" name={t("income")} fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name={t("expenses")} fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t("dailyTransactions")}</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("date")}</TableHead>
                  <TableHead>{t("description")}</TableHead>
                  <TableHead>{t("category")}</TableHead>
                  <TableHead>{t("type")}</TableHead>
                  <TableHead className="text-right">{t("amount")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === "income" ? "success" : "destructive"}>
                        {transaction.type === "income" ? t("income") : t("expenses")}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        transaction.type === "income" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
