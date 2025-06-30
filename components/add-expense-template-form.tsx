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
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/contexts/language-context"
import { useExpenseTemplates } from "@/contexts/expense-templates-context"
import { paymentMethods } from "@/lib/payment-methods"

const categories = [
  { id: "1", name: "housing" },
  { id: "2", name: "food" },
  { id: "3", name: "utilities" },
  { id: "4", name: "entertainment" },
  { id: "5", name: "transportation" },
  { id: "6", name: "healthcare" },
  { id: "7", name: "other" },
]

export function AddExpenseTemplateForm({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [includeAmount, setIncludeAmount] = useState(false)
  const [category, setCategory] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [includePaymentMethod, setIncludePaymentMethod] = useState(false)

  const { t } = useLanguage()
  const { addTemplate } = useExpenseTemplates()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !category) {
      return
    }

    addTemplate({
      name: name.trim(),
      description: description.trim() || undefined,
      amount: includeAmount && amount ? Number.parseFloat(amount) : undefined,
      category,
      paymentMethod: includePaymentMethod && paymentMethod ? (paymentMethod as any) : undefined,
      isActive: true,
    })

    // Reset form
    setName("")
    setDescription("")
    setAmount("")
    setIncludeAmount(false)
    setCategory("")
    setPaymentMethod("")
    setIncludePaymentMethod(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("createExpenseTemplate")}</DialogTitle>
            <DialogDescription>{t("createTemplateDescription")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="templateName" className="text-right">
                {t("name")} *
              </Label>
              <Input
                id="templateName"
                placeholder={t("templateName")}
                className="col-span-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="templateDescription" className="text-right">
                {t("description")}
              </Label>
              <Textarea
                id="templateDescription"
                placeholder={t("templateDescription")}
                className="col-span-3"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="templateCategory" className="text-right">
                {t("category")} *
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {t(cat.name as any)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">{t("amount")}</Label>
              <div className="col-span-3 space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeAmount"
                    checked={includeAmount}
                    onCheckedChange={(checked) => setIncludeAmount(checked as boolean)}
                  />
                  <Label htmlFor="includeAmount" className="text-sm">
                    {t("includeFixedAmount")}
                  </Label>
                </div>
                {includeAmount && (
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                )}
                <p className="text-xs text-muted-foreground">{t("amountTemplateHelp")}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">{t("paymentMethod")}</Label>
              <div className="col-span-3 space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includePaymentMethod"
                    checked={includePaymentMethod}
                    onCheckedChange={(checked) => setIncludePaymentMethod(checked as boolean)}
                  />
                  <Label htmlFor="includePaymentMethod" className="text-sm">
                    {t("includePaymentMethod")}
                  </Label>
                </div>
                {includePaymentMethod && (
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectPaymentMethod")} />
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
                )}
                <p className="text-xs text-muted-foreground">{t("paymentMethodTemplateHelp")}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={!name.trim() || !category}>
              {t("createTemplate")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
