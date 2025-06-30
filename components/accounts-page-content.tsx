"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, ArrowRightLeftIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountsList } from "@/components/accounts-list"
import { AccountBalanceOverview } from "@/components/account-balance-overview"
import { MobileAccountsOverview } from "@/components/mobile-accounts-overview"
import { TransfersList } from "@/components/transfers-list"
import { AddAccountForm } from "@/components/add-account-form"
import { TransferFundsForm } from "@/components/transfer-funds-form"
import { useLanguage } from "@/contexts/language-context"
import { AccountsProvider } from "@/contexts/accounts-context"
import { useMobile } from "@/hooks/use-mobile"

export function AccountsPageContent() {
  const { t } = useLanguage()
  const isMobile = useMobile()

  return (
    <AccountsProvider>
      <div className="flex-1 space-y-4 p-3 md:p-4 pt-6 md:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("accounts")}</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <TransferFundsForm>
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowRightLeftIcon className="mr-2 h-4 w-4" />
                {t("transferFunds")}
              </Button>
            </TransferFundsForm>
            <AddAccountForm>
              <Button className="w-full sm:w-auto">
                <PlusIcon className="mr-2 h-4 w-4" />
                {t("addAccount")}
              </Button>
            </AddAccountForm>
          </div>
        </div>

        {isMobile ? <MobileAccountsOverview /> : <AccountBalanceOverview />}

        <Tabs defaultValue="accounts" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="accounts" className="flex-1">
              {t("allAccounts")}
            </TabsTrigger>
            <TabsTrigger value="transfers" className="flex-1">
              {t("transfers")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("accountManagement")}</CardTitle>
                <CardDescription>{t("manageAllPaymentAccounts")}</CardDescription>
              </CardHeader>
              <CardContent>
                <AccountsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transfers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("transferHistory")}</CardTitle>
                <CardDescription>{t("viewAllTransfersBetweenAccounts")}</CardDescription>
              </CardHeader>
              <CardContent>
                <TransfersList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AccountsProvider>
  )
}
