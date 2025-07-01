"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, FileText, ImageIcon, Search, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"
import { formatCurrency } from "@/lib/utils"

interface ExpenseTableProps {
  expenses: Array<{
    id: string
    date: string
    description: string
    amount: number
    category: string
    paymentMethod: string
    fileUrl?: string
    fileName?: string
    fileType?: string
  }>
  onEdit: (expense: any) => void
  onDelete: (id: string) => void
}

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  const { t } = useLanguage()
  const { settings } = useSettings()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return null

    if (fileType.includes("pdf")) {
      return <FileText className="h-4 w-4 text-red-500" />
    } else if (fileType.includes("image")) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />
    }
    return <FileText className="h-4 w-4 text-gray-500" />
  }

  const handleViewFile = (fileUrl: string) => {
    window.open(fileUrl, "_blank")
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 pr-8"
        />
        {searchTerm && (
          <Button variant="ghost" size="sm" className="absolute right-1 top-1 h-6 w-6 p-0" onClick={clearSearch}>
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {filteredExpenses.length === 0 && searchTerm && (
        <div className="text-center py-8 text-muted-foreground">{t("noResults")}</div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("date")}</TableHead>
              <TableHead>{t("description")}</TableHead>
              <TableHead>{t("category")}</TableHead>
              <TableHead>{t("paymentMethod")}</TableHead>
              <TableHead>{t("amount")}</TableHead>
              <TableHead>{t("file")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.date}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{expense.category}</Badge>
                </TableCell>
                <TableCell>{expense.paymentMethod}</TableCell>
                <TableCell>{formatCurrency(expense.amount, settings.currency)}</TableCell>
                <TableCell>
                  {expense.fileUrl ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewFile(expense.fileUrl!)}
                      className="flex items-center gap-2"
                    >
                      {getFileIcon(expense.fileType)}
                      {t("viewFile")}
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">{t("noFile")}</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(expense)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(expense.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
