"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EditIcon, TrashIcon, FileTextIcon, ImageIcon } from "lucide-react" // Added FileTextIcon and ImageIcon
import { EditExpenseForm } from "@/components/edit-expense-form"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"
import { getPaymentMethodById } from "@/lib/payment-methods"
import { mockTransactions, type Transaction } from "@/lib/mock-data" // Import mockTransactions and Transaction type

// Filter mockTransactions to only include expenses
const expenseData: Transaction[] = mockTransactions.filter((transaction) => transaction.type === "expense")

export function ExpenseTable() {
  const [expenses] = useState(expenseData)
  const { t } = useLanguage()
  const { formatCurrency, formatDate } = useSettings()

  const getFileIcon = (fileUrl: string) => {
    if (fileUrl.endsWith(".pdf")) {
      return <FileTextIcon className="h-4 w-4" />
    } else if (fileUrl.endsWith(".jpg") || fileUrl.endsWith(".png")) {
      return <ImageIcon className="h-4 w-4" />
    }
    return null // Or a generic file icon
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("description")}</TableHead>
            <TableHead>{t("category")}</TableHead>
            <TableHead>{t("paymentMethod")}</TableHead>
            <TableHead>{t("file")}</TableHead>
            <TableHead className="text-right">{t("amount")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
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
                    <Badge variant="outline">{t(entry.category.toLowerCase() as any)}</Badge>
                  </TableCell>
                  <TableCell>
                    {paymentMethod && (
                      <div className="flex items-center gap-2">
                        <span>{paymentMethod.icon}</span>
                        <span className="text-sm">{t(paymentMethod.name as any)}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {/* New cell for file */}
                    {entry.fileUrl ? (
                      <a
                        href={entry.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                        title={t("viewFile")}
                      >
                        {getFileIcon(entry.fileUrl)}
                        <span className="sr-only">{t("viewFile")}</span>
                      </a>
                    ) : (
                      <span className="text-muted-foreground">{t("noFile")}</span>
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
