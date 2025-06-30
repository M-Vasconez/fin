"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, X, FileText, ImageIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"
import { expenseCategories } from "@/lib/mock-data"
import { paymentMethods } from "@/lib/payment-methods"

interface MobileExpenseFormProps {
  onSubmit: (expense: {
    amount: number
    description: string
    category: string
    date: Date
    paymentMethod: string
    file?: File
  }) => void
  onCancel: () => void
}

export function MobileExpenseForm({ onSubmit, onCancel }: MobileExpenseFormProps) {
  const { t } = useLanguage()
  const { currency } = useSettings()
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [paymentMethod, setPaymentMethod] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState("")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    if (selectedFile.size > 2 * 1024 * 1024) {
      setFileError(t("fileTooLarge"))
      return
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
    if (!allowedTypes.includes(selectedFile.type)) {
      setFileError(t("invalidFileType"))
      return
    }

    setFile(selectedFile)
    setFileError("")
  }

  const removeFile = () => {
    setFile(null)
    setFileError("")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !description || !category || !paymentMethod) return

    onSubmit({
      amount: Number.parseFloat(amount),
      description,
      category,
      date,
      paymentMethod,
      file: file || undefined,
    })

    // Reset form
    setAmount("")
    setDescription("")
    setCategory("")
    setDate(new Date())
    setPaymentMethod("")
    setFile(null)
    setFileError("")
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">
            {t("amount")} ({currency})
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t("description")}</Label>
          <Textarea
            id="description"
            placeholder={t("enterDescription")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">{t("category")}</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger className="h-12">
              <SelectValue placeholder={t("selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              {expenseCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("date")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal h-12", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>{t("pickDate")}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">{t("paymentMethod")}</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
            <SelectTrigger className="h-12">
              <SelectValue placeholder={t("selectPaymentMethod")} />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.name}>
                  {method.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("attachFile")}</Label>
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => document.getElementById("mobile-file-upload")?.click()}
              className="w-full flex items-center gap-2 h-12"
            >
              <Upload className="h-5 w-5" />
              {file ? t("fileSelected") : t("selectFile")}
            </Button>
            <input
              id="mobile-file-upload"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {file && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {getFileIcon(file.type)}
                  <div className="text-sm">
                    <div className="font-medium">{file.name}</div>
                    <div className="text-muted-foreground">{formatFileSize(file.size)}</div>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={removeFile} className="h-10 w-10 p-0">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            )}

            {fileError && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{fileError}</p>}

            <p className="text-xs text-muted-foreground text-center">{t("supportedFormats")}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button type="submit" size="lg" className="w-full">
            {t("addExpense")}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={onCancel} className="w-full bg-transparent">
            {t("cancel")}
          </Button>
        </div>
      </form>
    </div>
  )
}
