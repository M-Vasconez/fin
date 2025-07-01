"use client"

import type React from "react"

import { useState, useRef } from "react"
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

interface MobileExpenseFormProps {
  onSubmit: (expense: {
    date: string
    description: string
    amount: number
    category: string
    paymentMethod: string
    file?: File
  }) => void
  onCancel: () => void
  categories: string[]
  paymentMethods: string[]
}

export function MobileExpenseForm({ onSubmit, onCancel, categories, paymentMethods }: MobileExpenseFormProps) {
  const { t } = useLanguage()
  const { settings } = useSettings()
  const [date, setDate] = useState<Date>()
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setFileError(t("fileTooLarge"))
      return
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      setFileError(t("invalidFileType"))
      return
    }

    setFileError("")
    setSelectedFile(file)
  }

  const removeFile = () => {
    setSelectedFile(null)
    setFileError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.includes("pdf")) {
      return <FileText className="h-4 w-4 text-red-500" />
    } else if (file.type.includes("image")) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />
    }
    return <FileText className="h-4 w-4 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !description || !amount || !category || !paymentMethod) {
      return
    }

    onSubmit({
      date: format(date, "yyyy-MM-dd"),
      description,
      amount: Number.parseFloat(amount),
      category,
      paymentMethod,
      file: selectedFile || undefined,
    })

    // Reset form
    setDate(undefined)
    setDescription("")
    setAmount("")
    setCategory("")
    setPaymentMethod("")
    setSelectedFile(null)
    setFileError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="date">{t("date")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal h-12", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : t("pickTargetDate")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">{t("amount")}</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="h-12 text-lg"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t("description")}</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("goalDescriptionPlaceholder")}
            className="min-h-[100px] text-base"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">{t("category")}</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger className="h-12">
              <SelectValue placeholder={t("selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">{t("paymentMethod")}</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
            <SelectTrigger className="h-12">
              <SelectValue placeholder={t("selectPaymentMethod")} />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>{t("attachFile")}</Label>
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-12 flex items-center justify-center gap-2"
            >
              <Upload className="h-5 w-5" />
              {t("selectFile")}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />

            {selectedFile && (
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {getFileIcon(selectedFile)}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                    <span className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</span>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={removeFile} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {fileError && <p className="text-sm text-destructive">{fileError}</p>}

            <p className="text-xs text-muted-foreground">{t("supportedFormats")}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button type="submit" className="h-12 text-base">
            {t("addExpense")}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="h-12 text-base bg-transparent">
            {t("cancel")}
          </Button>
        </div>
      </form>
    </div>
  )
}
