"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EditIcon, TrashIcon } from "lucide-react"
import { EditExpenseForm } from "@/components/edit-expense-form"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"
import { getPaymentMethodById, type PaymentMethod } from "@/lib/payment-methods"

const expenseData = [
  {
    id: "1",
    date: "2023-06-01",
    amount: 1200,
    description: "Rent Payment",
    category: "Housing",
    paymentMethod: "bank_transfer" as PaymentMethod,
  },
  {
    id: "2",
    date: "2023-06-05",
    amount: 85.75,
    description: "Grocery Shopping",
    category: "Food",
    paymentMethod: "debit_card" as PaymentMethod,
  },
  {
    id: "3",
    date: "2023-06-10",
    amount: 120,
    description: "Electric Bill",
    category: "Utilities",
    paymentMethod: "credit_card" as PaymentMethod,
  },
  {
    id: "4",
    date: "2023-06-15",
    amount: 45.99,
    description: "Internet Subscription",
    category: "Utilities",
    paymentMethod: "credit_card" as PaymentMethod,
  },
  {
    id: "5",
    date: "2023-06-20",
    amount: 60,
    description: "Dinner with Friends",
    category: "Entertainment",
    paymentMethod: "cash" as PaymentMethod,
  },
]

export function ExpenseTable() {
  const [expenses] = useState(expenseData)
  const { t } = useLanguage()
  const { formatCurrency, formatDate } = useSettings()

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("description")}</TableHead>
            <TableHead>{t("category")}</TableHead>
            <TableHead>{t("paymentMethod")}</TableHead>
            <TableHead className="text-right">{t("amount")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                {t("noExpenseEntries")}
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((entry) => {
              const paymentMethod = getPaymentMethodById(entry.paymentMethod)
              return (
                <TableRow key={entry.id}>
                  <TableCell>{formatDate(entry.date)}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{entry.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {paymentMethod && (
                      <div className="flex items-center gap-2">
                        <span>{paymentMethod.icon}</span>
                        <span className="text-sm">{t(paymentMethod.name as any)}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium text-rose-600">{formatCurrency(entry.amount)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EditExpenseForm expense={entry}>
                        <Button variant="ghost" size="icon">
                          <EditIcon className="h-4 w-4" />
                          <span className="sr-only">{t("edit")}</span>
                        </Button>
                      </EditExpenseForm>
                      <DeleteConfirmationDialog
                        title={t("deleteExpenseEntry")}
                        description={t("deleteExpenseConfirm")}
                        onConfirm={() => {}}
                      >
                        <Button variant="ghost" size="icon">
                          <TrashIcon className="h-4 w-4" />
                          <span className="sr-only">{t("delete")}</span>
                        </Button>
                      </DeleteConfirmationDialog>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
