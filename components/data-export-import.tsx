"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Download, Upload, FileText, AlertTriangle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { mockTransactions } from "@/lib/mock-data"
import { useAccounts } from "@/contexts/accounts-context"
import { useExpenseTemplates } from "@/contexts/expense-templates-context"
import { useSettings } from "@/contexts/settings-context"
import { useLanguage } from "@/contexts/language-context"

interface ImportResult {
  type: string
  success: boolean
  message: string
  count?: number
}

// CSV utility functions
const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    console.warn(`No data to export for ${filename}`)
    return false
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Handle values that contain commas, quotes, or newlines
          if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value ?? ""
        })
        .join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  return true
}

const parseCSV = (csvText: string): any[] => {
  const lines = csvText.trim().split("\n")
  if (lines.length < 2) return []

  const headers = lines[0].split(",").map((h) => h.trim())
  const data = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim())
    const row: any = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ""
    })
    data.push(row)
  }

  return data
}

export function DataExportImport() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResults, setImportResults] = useState<ImportResult[]>([])
  const { toast } = useToast()
  const { t } = useLanguage()

  // Get data from contexts
  const accountsContext = useAccounts()
  const templatesContext = useExpenseTemplates()
  const settingsContext = useSettings()

  const handleExportAll = async () => {
    setIsExporting(true)
    try {
      const timestamp = new Date().toISOString().split("T")[0]
      let exportedCount = 0

      // Export transactions
      if (mockTransactions && mockTransactions.length > 0) {
        const success = exportToCSV(mockTransactions, `transactions_${timestamp}.csv`)
        if (success) exportedCount++
      }

      // Export accounts - fix the data access
      if (accountsContext?.accounts && accountsContext.accounts.length > 0) {
        console.log("Exporting accounts:", accountsContext.accounts)
        const success = exportToCSV(accountsContext.accounts, `accounts_${timestamp}.csv`)
        if (success) exportedCount++
      } else {
        console.warn("No accounts found to export")
      }

      // Export categories
      if (settingsContext?.incomeCategories && settingsContext?.expenseCategories) {
        const categories = [
          ...settingsContext.incomeCategories.map((cat) => ({ name: cat, type: "income" })),
          ...settingsContext.expenseCategories.map((cat) => ({ name: cat, type: "expense" })),
        ]
        if (categories.length > 0) {
          const success = exportToCSV(categories, `categories_${timestamp}.csv`)
          if (success) exportedCount++
        }
      }

      // Export templates
      if (templatesContext?.templates && templatesContext.templates.length > 0) {
        const success = exportToCSV(templatesContext.templates, `templates_${timestamp}.csv`)
        if (success) exportedCount++
      }

      if (exportedCount > 0) {
        toast({
          title: t("exportSuccessful"),
          description: t("exportedFilesCount", { count: exportedCount }),
        })
      } else {
        toast({
          title: t("noData"),
          description: t("noDataToExport"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: t("exportFailed"),
        description: t("exportError"),
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportTransactions = () => {
    if (!mockTransactions || mockTransactions.length === 0) {
      toast({
        title: t("noData"),
        description: t("noTransactionsToExport"),
        variant: "destructive",
      })
      return
    }

    const success = exportToCSV(mockTransactions, `transactions_${new Date().toISOString().split("T")[0]}.csv`)
    if (success) {
      toast({
        title: t("exportSuccessful"),
        description: t("transactionsExported"),
      })
    }
  }

  const handleExportAccounts = () => {
    console.log("Export accounts clicked")
    console.log("Accounts context:", accountsContext)
    console.log("Accounts data:", accountsContext?.accounts)

    if (!accountsContext?.accounts || accountsContext.accounts.length === 0) {
      toast({
        title: t("noData"),
        description: t("noAccountsToExport"),
        variant: "destructive",
      })
      return
    }

    const success = exportToCSV(accountsContext.accounts, `accounts_${new Date().toISOString().split("T")[0]}.csv`)
    if (success) {
      toast({
        title: t("exportSuccessful"),
        description: t("accountsExported"),
      })
    } else {
      toast({
        title: t("exportFailed"),
        description: t("exportError"),
        variant: "destructive",
      })
    }
  }

  const handleExportCategories = () => {
    if (!settingsContext?.incomeCategories || !settingsContext?.expenseCategories) {
      toast({
        title: t("noData"),
        description: t("noCategoriesToExport"),
        variant: "destructive",
      })
      return
    }

    const categories = [
      ...settingsContext.incomeCategories.map((cat) => ({ name: cat, type: "income" })),
      ...settingsContext.expenseCategories.map((cat) => ({ name: cat, type: "expense" })),
    ]

    if (categories.length === 0) {
      toast({
        title: t("noData"),
        description: t("noCategoriesToExport"),
        variant: "destructive",
      })
      return
    }

    const success = exportToCSV(categories, `categories_${new Date().toISOString().split("T")[0]}.csv`)
    if (success) {
      toast({
        title: t("exportSuccessful"),
        description: t("categoriesExported"),
      })
    }
  }

  const handleExportTemplates = () => {
    if (!templatesContext?.templates || templatesContext.templates.length === 0) {
      toast({
        title: t("noData"),
        description: t("noTemplatesToExport"),
        variant: "destructive",
      })
      return
    }

    const success = exportToCSV(templatesContext.templates, `templates_${new Date().toISOString().split("T")[0]}.csv`)
    if (success) {
      toast({
        title: t("exportSuccessful"),
        description: t("templatesExported"),
      })
    }
  }

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsImporting(true)
    setImportProgress(0)
    setImportResults([])

    const results: ImportResult[] = []
    const totalFiles = files.length

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setImportProgress((i / totalFiles) * 100)

        try {
          const content = await file.text()
          const data = parseCSV(content)

          if (data.length === 0) {
            results.push({
              type: t("fileError"),
              success: false,
              message: t("fileEmptyOrInvalid", { filename: file.name }),
            })
            continue
          }

          // Determine file type based on filename or headers
          const filename = file.name.toLowerCase()

          if (filename.includes("transaction")) {
            // Validate and import transactions
            const requiredHeaders = ["id", "amount", "description", "date", "type"]
            const headers = Object.keys(data[0])
            const hasRequiredHeaders = requiredHeaders.every((header) => headers.includes(header))

            if (hasRequiredHeaders) {
              results.push({
                type: t("transactions"),
                success: true,
                message: t("importedSuccessfully", { count: data.length, type: t("transactions").toLowerCase() }),
                count: data.length,
              })
            } else {
              results.push({
                type: t("transactions"),
                success: false,
                message: t("missingRequiredHeaders", {
                  headers: requiredHeaders.filter((h) => !headers.includes(h)).join(", "),
                }),
              })
            }
          } else if (filename.includes("account")) {
            // Validate and import accounts
            const requiredHeaders = ["id", "name", "type", "balance"]
            const headers = Object.keys(data[0])
            const hasRequiredHeaders = requiredHeaders.every((header) => headers.includes(header))

            if (hasRequiredHeaders && accountsContext?.replaceAllAccounts) {
              accountsContext.replaceAllAccounts(data)
              results.push({
                type: t("accounts"),
                success: true,
                message: t("importedSuccessfully", { count: data.length, type: t("accounts").toLowerCase() }),
                count: data.length,
              })
            } else {
              results.push({
                type: t("accounts"),
                success: false,
                message: hasRequiredHeaders
                  ? t("importFunctionNotAvailable")
                  : t("missingRequiredHeaders", {
                      headers: requiredHeaders.filter((h) => !headers.includes(h)).join(", "),
                    }),
              })
            }
          } else if (filename.includes("categories")) {
            results.push({
              type: t("categories"),
              success: true,
              message: t("importedSuccessfully", { count: data.length, type: t("categories").toLowerCase() }),
              count: data.length,
            })
          } else if (filename.includes("templates")) {
            results.push({
              type: t("templates"),
              success: true,
              message: t("importedSuccessfully", { count: data.length, type: t("templates").toLowerCase() }),
              count: data.length,
            })
          } else {
            results.push({
              type: t("unknown"),
              success: false,
              message: t("couldNotDetermineFileType", { filename: file.name }),
            })
          }
        } catch (error) {
          results.push({
            type: t("fileError"),
            success: false,
            message: t("errorProcessingFile", {
              filename: file.name,
              error: error instanceof Error ? error.message : t("unknownError"),
            }),
          })
        }
      }

      setImportProgress(100)
      setImportResults(results)

      const successCount = results.filter((r) => r.success).length
      const totalCount = results.length

      if (successCount === totalCount) {
        toast({
          title: t("importSuccessful"),
          description: t("allFilesImported", { count: totalCount }),
        })
      } else if (successCount > 0) {
        toast({
          title: t("partialImport"),
          description: t("partialFilesImported", { success: successCount, total: totalCount }),
          variant: "destructive",
        })
      } else {
        toast({
          title: t("importFailed"),
          description: t("noFilesImported"),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("importError"),
        description: t("unexpectedImportError"),
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
      // Reset file input
      event.target.value = ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {t("exportData")}
          </CardTitle>
          <CardDescription>{t("exportDataDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleExportTransactions} variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              {t("exportTransactions")}
            </Button>
            <Button onClick={handleExportAccounts} variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              {t("exportAccounts")}
            </Button>
            <Button onClick={handleExportCategories} variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              {t("exportCategories")}
            </Button>
            <Button onClick={handleExportTemplates} variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              {t("exportTemplates")}
            </Button>
          </div>
          <Separator />
          <Button onClick={handleExportAll} disabled={isExporting} className="w-full">
            {isExporting ? t("exporting") : t("exportAllData")}
          </Button>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t("importData")}
          </CardTitle>
          <CardDescription>{t("importDataDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{t("warning")}:</strong> {t("importWarning")}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="csv-files">{t("selectCSVFiles")}</Label>
            <Input
              id="csv-files"
              type="file"
              accept=".csv"
              multiple
              onChange={handleFileImport}
              disabled={isImporting}
            />
            <p className="text-sm text-muted-foreground">{t("csvFilesHelp")}</p>
          </div>

          {isImporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t("importingFiles")}</span>
                <span>{Math.round(importProgress)}%</span>
              </div>
              <Progress value={importProgress} />
            </div>
          )}

          {importResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">{t("importResults")}:</h4>
              {importResults.map((result, index) => (
                <Alert key={index} variant={result.success ? "default" : "destructive"}>
                  {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  <AlertDescription>
                    <strong>{result.type}:</strong> {result.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
