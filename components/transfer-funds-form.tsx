"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, ArrowDownIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { useAccounts } from "@/contexts/accounts-context"
import { formatAccountBalance, getAccountTypeIcon } from "@/lib/accounts"

export function TransferFundsForm({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>(new Date())
  const [fromAccount, setFromAccount] = useState<string>("")
  const [toAccount, setToAccount] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [fee, setFee] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const { t } = useLanguage()
  const { accounts, addTransfer } = useAccounts()

  const availableToAccounts = accounts.filter((acc) => acc.id !== fromAccount && acc.isActive)
  const availableFromAccounts = accounts.filter((acc) => acc.id !== toAccount && acc.isActive)

  const selectedFromAccount = accounts.find((acc) => acc.id === fromAccount)
  const selectedToAccount = accounts.find((acc) => acc.id === toAccount)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!fromAccount || !toAccount || !amount) {
      setMessage({ type: "error", text: t("fillRequiredFields") })
      return
    }

    const transferAmount = Number.parseFloat(amount)
    const transferFee = fee ? Number.parseFloat(fee) : 0

    if (transferAmount <= 0) {
      setMessage({ type: "error", text: t("amountMustBePositive") })
      return
    }

    if (transferFee < 0) {
      setMessage({ type: "error", text: t("feeMustBePositive") })
      return
    }

    setIsLoading(true)

    try {
      const result = await addTransfer({
        fromAccountId: fromAccount,
        toAccountId: toAccount,
        amount: transferAmount,
        fee: transferFee > 0 ? transferFee : undefined,
        description: description || `Transfer from ${selectedFromAccount?.name} to ${selectedToAccount?.name}`,
        date: date.toISOString().split("T")[0],
      })

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        // Reset form
        setFromAccount("")
        setToAccount("")
        setAmount("")
        setFee("")
        setDescription("")
        setDate(new Date())

        // Close dialog after a short delay to show success message
        setTimeout(() => {
          setOpen(false)
          setMessage(null)
        }, 2000)
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: t("transferFailed") })
    } finally {
      setIsLoading(false)
    }
  }

  const getAvailableAmount = (account: any) => {
    if (!account) return 0

    if (account.type === "credit_card") {
      // For credit cards, available amount is the current credit limit minus current debt
      // If balance is -850, that means $850 debt, so available credit depends on the limit
      // For simplicity, let's assume a reasonable credit limit
      const assumedCreditLimit = 5000
      const currentDebt = Math.abs(Math.min(0, account.balance))
      return assumedCreditLimit - currentDebt
    }

    return Math.max(0, account.balance)
  }

  const AccountCard = ({ account, type }: { account: any; type: "from" | "to" }) => {
    const balanceInfo = formatAccountBalance(account.balance, account.type)
    const availableAmount = type === "from" ? getAvailableAmount(account) : null

    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getAccountTypeIcon(account.type)}</span>
              <div>
                <h4 className="font-semibold">{account.name}</h4>
                {account.accountNumber && <p className="text-sm text-muted-foreground">{account.accountNumber}</p>}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${balanceInfo.color}`}>
                {balanceInfo.isDebt && account.type === "credit_card" ? "-" : ""}
                {balanceInfo.amount}
              </div>
              {type === "from" && availableAmount !== null && (
                <p className="text-xs text-muted-foreground">
                  {t("available")}: $
                  {availableAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
              {type === "to" && account.type === "credit_card" && account.balance < 0 && (
                <p className="text-xs text-emerald-600">{t("debtPayment")}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">{t("transferFunds")}</DialogTitle>
            <DialogDescription>{t("transferMoneyBetweenAccounts")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Success/Error Message */}
            {message && (
              <Alert
                className={message.type === "success" ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}
              >
                {message.type === "success" ? (
                  <CheckCircleIcon className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertCircleIcon className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={message.type === "success" ? "text-emerald-800" : "text-red-800"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Date Selection */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                {t("date")}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>{t("pickDate")}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* From Account Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">{t("fromAccount")}</Label>
              <Select value={fromAccount} onValueChange={setFromAccount}>
                <SelectTrigger className="w-full h-auto p-0">
                  <SelectValue placeholder={t("selectSourceAccount")} />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {availableFromAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id} className="p-0">
                      <div className="w-full p-3">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{getAccountTypeIcon(account.type)}</span>
                            <div>
                              <div className="font-medium text-left">{account.name}</div>
                              {account.accountNumber && (
                                <div className="text-xs text-muted-foreground text-left">{account.accountNumber}</div>
                              )}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div
                              className={`text-sm font-medium ${formatAccountBalance(account.balance, account.type).color}`}
                            >
                              {formatAccountBalance(account.balance, account.type).amount}
                            </div>
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedFromAccount && <AccountCard account={selectedFromAccount} type="from" />}
            </div>

            {/* Transfer Direction Indicator */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-2">
                <ArrowDownIcon className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">{t("transfer")}</span>
              </div>
            </div>

            {/* To Account Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">{t("toAccount")}</Label>
              <Select value={toAccount} onValueChange={setToAccount}>
                <SelectTrigger className="w-full h-auto p-0">
                  <SelectValue placeholder={t("selectDestinationAccount")} />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {availableToAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id} className="p-0">
                      <div className="w-full p-3">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{getAccountTypeIcon(account.type)}</span>
                            <div>
                              <div className="font-medium text-left">{account.name}</div>
                              {account.accountNumber && (
                                <div className="text-xs text-muted-foreground text-left">{account.accountNumber}</div>
                              )}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div
                              className={`text-sm font-medium ${formatAccountBalance(account.balance, account.type).color}`}
                            >
                              {formatAccountBalance(account.balance, account.type).amount}
                            </div>
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedToAccount && <AccountCard account={selectedToAccount} type="to" />}
            </div>

            {/* Amount and Fee */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  {t("amount")} *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="text-lg font-medium"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transferFee" className="text-sm font-medium">
                  {t("transferFee")} ({t("optional")})
                </Label>
                <Input
                  id="transferFee"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                {t("description")} ({t("optional")})
              </Label>
              <Textarea
                id="description"
                placeholder={t("transferDescription")}
                rows={3}
                className="resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={!fromAccount || !toAccount || !amount || isLoading}>
              {isLoading ? t("processing") : t("transferFunds")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
