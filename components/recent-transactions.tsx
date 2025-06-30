"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"
import type { Transaction } from "@/lib/mock-data"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const { t } = useLanguage()
  const { formatCurrency, formatDate } = useSettings()

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No transactions found for the selected period
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback
              className={
                transaction.type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
              }
            >
              {transaction.type === "income" ? "+" : "-"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.description}</p>
            <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
          </div>
          <div className="ml-auto flex flex-col items-end gap-1">
            <span
              className={`text-sm font-medium ${transaction.type === "income" ? "text-emerald-600" : "text-rose-600"}`}
            >
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </span>
            <Badge variant="outline">{transaction.category}</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
