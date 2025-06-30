"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, EditIcon, TrashIcon } from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"
import { useAccounts } from "@/contexts/accounts-context"

export function TransfersList() {
  const { t } = useLanguage()
  const { formatCurrency, formatDate } = useSettings()
  const { transfers, getAccountById } = useAccounts()

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("fromAccount")}</TableHead>
            <TableHead className="text-center">{t("transfer")}</TableHead>
            <TableHead>{t("toAccount")}</TableHead>
            <TableHead className="text-right">{t("amount")}</TableHead>
            <TableHead className="text-right">{t("fee")}</TableHead>
            <TableHead>{t("description")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transfers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                {t("noTransfersFound")}
              </TableCell>
            </TableRow>
          ) : (
            transfers.map((transfer) => {
              const fromAccount = getAccountById(transfer.fromAccountId)
              const toAccount = getAccountById(transfer.toAccountId)

              return (
                <TableRow key={transfer.id}>
                  <TableCell>{formatDate(transfer.date)}</TableCell>
                  <TableCell>
                    {fromAccount && (
                      <div className="space-y-1">
                        <div className="font-medium">{fromAccount.name}</div>
                        {fromAccount.accountNumber && (
                          <div className="text-xs text-muted-foreground">{fromAccount.accountNumber}</div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <ArrowRightIcon className="h-4 w-4 mx-auto text-muted-foreground" />
                  </TableCell>
                  <TableCell>
                    {toAccount && (
                      <div className="space-y-1">
                        <div className="font-medium">{toAccount.name}</div>
                        {toAccount.accountNumber && (
                          <div className="text-xs text-muted-foreground">{toAccount.accountNumber}</div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium text-blue-600">
                    {formatCurrency(transfer.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {transfer.fee ? (
                      <span className="text-rose-600">{formatCurrency(transfer.fee)}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate" title={transfer.description}>
                      {transfer.description}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <EditIcon className="h-4 w-4" />
                        <span className="sr-only">{t("edit")}</span>
                      </Button>
                      <DeleteConfirmationDialog
                        title={t("deleteTransfer")}
                        description={t("deleteTransferConfirm")}
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
