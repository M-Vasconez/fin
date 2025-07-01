"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EditExpenseForm } from "./edit-expense-form"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"
import { formatDate } from "@/lib/date-utils"
import { Pencil, Trash2, Search, FileText, ImageIcon, ExternalLink } from "lucide-react"

interface Expense {
  id: string
  date: string
  description: string
  amount: number
  category: string
  paymentMethod: string
  fileUrl?: string
  fileName?: string
  fileType?: string
}

interface ExpenseTableProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  const { t } = useLanguage()
  const { settings } = useSettings()
  const [searchTerm, setSearchTerm] = useState("")
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null)

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
  }

  const handleSaveEdit = (updatedExpense: Expense) => {
    onEdit(updatedExpense)
    setEditingExpense(null)
  }

  const handleDelete = (id: string) => {
    setDeletingExpenseId(id)
  }

  const confirmDelete = () => {
    if (deletingExpenseId) {
      onDelete(deletingExpenseId)
      setDeletingExpenseId(null)
    }
  }

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return null

    if (fileType.includes("pdf")) {
      return <FileText className="h-4 w-4 text-red-600" />
    } else if (fileType.includes("image")) {
      return <ImageIcon className="h-4 w-4 text-blue-600" />
    }
    return <FileText className="h-4 w-4 text-gray-600" />
  }

  const openFile = (fileUrl: string) => {
    window.open(fileUrl, "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("expenseEntries")}</CardTitle>
        <CardDescription>{t("manageExpenses")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`${t("search")}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">{t("noExpenseEntries")}</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("date")}</TableHead>
                    <TableHead>{t("description")}</TableHead>
                    <TableHead>{t("category")}</TableHead>
                    <TableHead>{t("paymentMethod")}</TableHead>
                    <TableHead className="text-right">{t("amount")}</TableHead>
                    <TableHead>{t("file")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{formatDate(expense.date, settings.dateFormat)}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{t(expense.category)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{t(expense.paymentMethod)}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {settings.currency} {expense.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {expense.fileUrl ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openFile(expense.fileUrl!)}
                            className="flex items-center gap-2"
                          >
                            {getFileIcon(expense.fileType)}
                            <ExternalLink className="h-3 w-3" />
                            <span className="sr-only">{t("viewFile")}</span>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">{t("noFile")}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(expense)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">{t("edit")}</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(expense.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{t("delete")}</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>

      {editingExpense && (
        <EditExpenseForm expense={editingExpense} onSave={handleSaveEdit} onCancel={() => setEditingExpense(null)} />
      )}

      <DeleteConfirmationDialog
        isOpen={!!deletingExpenseId}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingExpenseId(null)}
        title={t("deleteExpenseEntry")}
        description={t("deleteExpenseConfirm")}
      />
    </Card>
  )
}
