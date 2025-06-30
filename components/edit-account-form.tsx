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
import { useLanguage } from "@/contexts/language-context"
import { paymentMethods } from "@/lib/payment-methods"
import type { Account } from "@/lib/accounts"

interface EditAccountFormProps {
  account: Account
  children: React.ReactNode
}

export function EditAccountForm({ account, children }: EditAccountFormProps) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("editAccount")}</DialogTitle>
            <DialogDescription>{t("makeChangesToAccount")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountType" className="text-right">
                {t("type")}
              </Label>
              <Select defaultValue={account.type}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("selectAccountType")} />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      <div className="flex items-center gap-2">
                        <span>{method.icon}</span>
                        <span>{t(method.name as any)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountName" className="text-right">
                {t("name")}
              </Label>
              <Input id="accountName" defaultValue={account.name} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentBalance" className="text-right">
                {t("currentBalance")}
              </Label>
              <Input
                id="currentBalance"
                type="number"
                step="0.01"
                defaultValue={account.balance}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountNumber" className="text-right">
                {t("accountNumber")}
              </Label>
              <Input id="accountNumber" defaultValue={account.accountNumber || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                {t("description")}
              </Label>
              <Textarea id="description" defaultValue={account.description || ""} className="col-span-3" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{t("saveChanges")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
