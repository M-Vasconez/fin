"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { useAccounts } from "@/contexts/accounts-context"
import { formatAccountBalance, getAccountTypeIcon } from "@/lib/accounts"
import { useSettings } from "@/contexts/settings-context"

export function MobileAccountsOverview() {
  const { t } = useLanguage()
  const { accounts } = useAccounts()
  const { formatDate } = useSettings()

  const activeAccounts = accounts.filter((acc) => acc.isActive)

  // Calculate totals
  const totalAssets = activeAccounts.reduce((sum, account) => sum + Math.max(0, account.balance), 0)
  const totalDebts = activeAccounts.reduce((sum, account) => sum + Math.abs(Math.min(0, account.balance)), 0)
  const netWorth = totalAssets - totalDebts

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950">
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{t("totalAssets")}</p>
              <p className="text-lg font-bold text-emerald-600">
                ${totalAssets.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950 dark:to-red-950">
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{t("totalDebts")}</p>
              <p className="text-lg font-bold text-rose-600">
                ${totalDebts.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Net Worth */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t("netWorth")}</p>
              <p className={`text-xl font-bold ${netWorth >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                ${netWorth.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </div>
            <Badge variant="secondary">
              {activeAccounts.length} {t("accounts")}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Account List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">{t("accounts")}</h3>
        {activeAccounts.slice(0, 5).map((account) => {
          const balanceInfo = formatAccountBalance(account.balance, account.type)
          return (
            <Card key={account.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-lg">{getAccountTypeIcon(account.type)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{account.name}</p>
                      {account.accountNumber && (
                        <p className="text-xs text-muted-foreground">{account.accountNumber}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {t("lastUpdated")}: {formatDate(account.updatedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${balanceInfo.color}`}>
                      {balanceInfo.isDebt && account.type === "credit_card" ? "-" : ""}
                      {balanceInfo.amount}
                    </p>
                    {balanceInfo.isDebt && (
                      <Badge variant="destructive" className="text-xs">
                        {t("debt")}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {activeAccounts.length > 5 && (
          <p className="text-sm text-muted-foreground text-center">
            +{activeAccounts.length - 5} more {t("accounts")}
          </p>
        )}
      </div>
    </div>
  )
}
