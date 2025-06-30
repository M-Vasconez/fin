"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useAccounts } from "@/contexts/accounts-context"
import { paymentMethods } from "@/lib/payment-methods"

export function AccountBalanceOverview() {
  const { t } = useLanguage()
  const { accounts } = useAccounts()

  // Group accounts by type and calculate totals
  const accountsByType = paymentMethods.reduce(
    (acc, method) => {
      const methodAccounts = accounts.filter((account) => account.type === method.id && account.isActive)
      const totalBalance = methodAccounts.reduce((sum, account) => sum + account.balance, 0)

      if (methodAccounts.length > 0) {
        acc[method.id] = {
          method,
          accounts: methodAccounts,
          totalBalance,
          count: methodAccounts.length,
        }
      }
      return acc
    },
    {} as Record<string, any>,
  )

  // Calculate overall totals
  const totalAssets = Object.values(accountsByType).reduce((sum: number, group: any) => {
    return sum + Math.max(0, group.totalBalance) // Only positive balances
  }, 0)

  const totalDebts = Object.values(accountsByType).reduce((sum: number, group: any) => {
    return sum + Math.abs(Math.min(0, group.totalBalance)) // Only negative balances
  }, 0)

  const netWorth = totalAssets - totalDebts

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("totalAssets")}</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            ${totalAssets.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">{t("acrossAllAccounts")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("totalDebts")}</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="m22 2-5 10-5-10" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-600">
            ${totalDebts.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">{t("creditCardBalances")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("netWorth")}</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netWorth >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            ${netWorth.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">{t("assetsMinusDebts")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("totalAccounts")}</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{accounts.filter((acc) => acc.isActive).length}</div>
          <p className="text-xs text-muted-foreground">{t("activeAccounts")}</p>
        </CardContent>
      </Card>
    </div>
  )
}
