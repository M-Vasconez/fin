"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, LayoutTemplateIcon as TemplateIcon, XIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { paymentMethods } from "@/lib/payment-methods"
import { useExpenseTemplates } from "@/contexts/expense-templates-context"
import { Badge } from "@/components/ui/badge"

const categories = [
  { id: "1", name: "housing" },
  { id: "2", name: "food" },
  { id: "3", name: "utilities" },
  { id: "4", name: "entertainment" },
  { id: "5", name: "transportation" },
  { id: "6", name: "healthcare" },
  { id: "7", name: "other" },
]

export function MobileExpenseForm({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")

  const { t } = useLanguage()
  const { getActiveTemplates, getTemplateById } = useExpenseTemplates()

  const activeTemplates = getActiveTemplates()

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    if (!templateId || templateId === "none") {
      setSelectedTemplate("")
      return
    }

    const template = getTemplateById(templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setDescription(template.name)
      setCategory(template.category)
      if (template.amount) {
        setAmount(template.amount.toString())
      }
      if (template.paymentMethod) {
        setPaymentMethod(template.paymentMethod)
      }
    }
  }

  // Clear template selection
  const clearTemplate = () => {
    setSelectedTemplate("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setOpen(false)
    // Reset form
    setDate(undefined)
    setAmount("")
    setDescription("")
    setCategory("")
    setPaymentMethod("")
    setSelectedTemplate("")
  }

  const selectedTemplateData = selectedTemplate ? getTemplateById(selectedTemplate) : null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="text-left">
            <DialogTitle>{t("addExpense")}</DialogTitle>
            <DialogDescription>{t("addExpenseEntry")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Template Selector */}
            {activeTemplates.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="template">{t("template")}</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectTemplate")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t("noTemplate")}</SelectItem>
                    {activeTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          <TemplateIcon className="h-4 w-4" />
                          <span>{template.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplateData && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <TemplateIcon className="h-3 w-3 mr-1" />
                      {selectedTemplateData.name}
                    </Badge>
                    <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={clearTemplate}>
                      <XIcon className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">{t("date")}</Label>
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
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">{t("amount")}</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="text-lg"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">{t("description")}</Label>
              <Input
                id="description"
                placeholder={t("expenseDescription")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">{t("category")}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
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

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">{t("paymentMethod")}</Label>
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
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col gap-2 pt-4">
            <Button type="submit" className="w-full">
              {t("addExpense")}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full">
              {t("cancel")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
