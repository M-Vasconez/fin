"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EditIcon, TrashIcon } from "lucide-react"
import { formatAccountBalance, getAccountTypeIcon, type Account } from "@/lib/accounts"
import { EditAccountForm } from "@/components/edit-account-form"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { useLanguage } from "@/contexts/language-context"
import { useAccounts } from "@/contexts/accounts-context"
import { paymentMethods } from "@/lib/payment-methods"
import { useSettings } from "@/contexts/settings-context"

export function AccountsList() {
  const { t } = useLanguage()
  const { accounts } = useAccounts()
  const { formatDate } = useSettings()
  const activeAccounts = accounts.filter((acc) => acc.isActive)

  // Group accounts by payment method type
  const groupedAccounts = paymentMethods.reduce(
    (acc, method) => {
      const methodAccounts = activeAccounts.filter((account) => account.type === method.id)
      if (methodAccounts.length > 0) {
        acc[method.id] = {
          method,
          accounts: methodAccounts,
        }
      }
      return acc
    },
    {} as Record<string, any>,
  )

  const AccountCard = ({ account }: { account: Account }) => {
    const balanceInfo = formatAccountBalance(account.balance, account.type)

    return (
      <Card className="relative">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getAccountTypeIcon(account.type)}</span>
              <div>
                <CardTitle className="text-base">{account.name}</CardTitle>
                {account.accountNumber && <p className="text-sm text-muted-foreground">{account.accountNumber}</p>}
              </div>
            </div>
            <div className="flex gap-1">
              <EditAccountForm account={account}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <EditIcon className="h-4 w-4" />
                  <span className="sr-only">{t("edit")}</span>
                </Button>
              </EditAccountForm>
              <DeleteConfirmationDialog
                title={t("deleteAccount")}
                description={t("deleteAccountConfirm")}
                onConfirm={() => {}}
              >
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <TrashIcon className="h-4 w-4" />
                  <span className="sr-only">{t("delete")}</span>
                </Button>
              </DeleteConfirmationDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t("balance")}:</span>
              <div className="text-right">
                <div className={`text-lg font-bold ${balanceInfo.color}`}>
                  {balanceInfo.isDebt && account.type === "credit_card" ? "-" : ""}
                  {balanceInfo.amount}
                </div>
                {balanceInfo.isDebt && (
                  <Badge variant="destructive" className="text-xs">
                    {t("debt")}
                  </Badge>
                )}
              </div>
            </div>
            {account.description && <p className="text-xs text-muted-foreground">{account.description}</p>}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {t("lastUpdated")}: {formatDate(account.updatedAt)}
              </span>
              <Badge variant="outline" className="text-xs">
                {t(paymentMethods.find((m) => m.id === account.type)?.name as any)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedAccounts).map(([typeId, group]) => (
        <div key={typeId} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getAccountTypeIcon(group.method.id)}</span>
            <h3 className="text-lg font-semibold">{t(group.method.name as any)}</h3>
            <Badge variant="secondary">
              {group.accounts.length} {group.accounts.length === 1 ? t("account") : t("accounts")}
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {group.accounts.map((account: Account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </div>
      ))}

      {Object.keys(groupedAccounts).length === 0 && (
        <div className="text-center py-8 text-muted-foreground">{t("noAccountsFound")}</div>
      )}
    </div>
  )
}
