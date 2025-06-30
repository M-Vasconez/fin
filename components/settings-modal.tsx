"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SettingsIcon, UserIcon, DollarSignIcon, CalendarIcon, PaletteIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useSettings, type Currency, type DateFormat } from "@/contexts/settings-context"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/theme-toggle"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, InfoIcon } from "lucide-react"
import { DataExportImport } from "./data-export-import"

interface SettingsModalProps {
  children: React.ReactNode
}

const currencies: { value: Currency; label: string; symbol: string }[] = [
  { value: "USD", label: "US Dollar", symbol: "$" },
  { value: "EUR", label: "Euro", symbol: "€" },
  { value: "MXN", label: "Mexican Peso", symbol: "$" },
  { value: "GBP", label: "British Pound", symbol: "£" },
  { value: "JPY", label: "Japanese Yen", symbol: "¥" },
  { value: "CAD", label: "Canadian Dollar", symbol: "C$" },
  { value: "AUD", label: "Australian Dollar", symbol: "A$" },
  { value: "CHF", label: "Swiss Franc", symbol: "CHF" },
  { value: "CNY", label: "Chinese Yuan", symbol: "¥" },
  { value: "BRL", label: "Brazilian Real", symbol: "R$" },
]

const dateFormats: { value: DateFormat; label: string; example: string }[] = [
  { value: "dd/mm/yyyy", label: "DD/MM/YYYY", example: "31/12/2024" },
  { value: "mm/dd/yyyy", label: "MM/DD/YYYY", example: "12/31/2024" },
  { value: "yyyy-mm-dd", label: "YYYY-MM-DD", example: "2024-12-31" },
]

export function SettingsModal({ children }: SettingsModalProps) {
  const [open, setOpen] = useState(false)
  const { t, language, setLanguage } = useLanguage()
  const {
    currency,
    setCurrency,
    dateFormat,
    setDateFormat,
    userName,
    setUserName,
    formatCurrency,
    conversionRates,
    setConversionRate,
    getConversionRate,
    hasConversionRate,
  } = useSettings()
  const { theme, setTheme } = useTheme()

  // Local state for form inputs
  const [tempUserName, setTempUserName] = useState(userName)
  const [tempCurrency, setTempCurrency] = useState(currency)
  const [tempDateFormat, setTempDateFormat] = useState(dateFormat)
  const [tempLanguage, setTempLanguage] = useState(language)
  const [tempConversionRate, setTempConversionRate] = useState<string>("")
  const [showConversionInput, setShowConversionInput] = useState(false)
  const [conversionError, setConversionError] = useState<string>("")

  // Check if selected currency needs conversion rate
  useEffect(() => {
    if (tempCurrency !== "USD" && !hasConversionRate(tempCurrency)) {
      setShowConversionInput(true)
      setTempConversionRate("")
    } else {
      setShowConversionInput(false)
      setConversionError("")
    }
  }, [tempCurrency, hasConversionRate])

  const handleCurrencyChange = (newCurrency: Currency) => {
    setTempCurrency(newCurrency)
    setConversionError("")

    if (newCurrency !== "USD" && !hasConversionRate(newCurrency)) {
      setShowConversionInput(true)
      setTempConversionRate("")
    } else {
      setShowConversionInput(false)
    }
  }

  const handleSave = () => {
    try {
      // Validate conversion rate if needed
      if (showConversionInput) {
        const rate = Number.parseFloat(tempConversionRate)
        if (isNaN(rate) || rate <= 0) {
          setConversionError(t("enterValidConversionRate"))
          return
        }
        setConversionRate(tempCurrency, rate)
      }

      setUserName(tempUserName)
      setCurrency(tempCurrency)
      setDateFormat(tempDateFormat)
      setLanguage(tempLanguage)
      setOpen(false)
    } catch (error) {
      setConversionError(error instanceof Error ? error.message : t("failedToSaveSettings"))
    }
  }

  const handleCancel = () => {
    // Reset temp values to current values
    setTempUserName(userName)
    setTempCurrency(currency)
    setTempDateFormat(dateFormat)
    setTempLanguage(language)
    setOpen(false)
  }

  const selectedCurrency = currencies.find((c) => c.value === tempCurrency)
  const selectedDateFormat = dateFormats.find((d) => d.value === tempDateFormat)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            {t("settings")}
          </DialogTitle>
          <DialogDescription>{t("configureAppPreferences")}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">{t("general")}</TabsTrigger>
            <TabsTrigger value="data">{t("dataManagement")}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6 py-4">
            {/* User Profile Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">{t("userProfile")}</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userName">{t("userName")}</Label>
                <Input
                  id="userName"
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                  placeholder={t("enterUserName")}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">{t("userNameDescription")}</p>
              </div>
            </div>

            <Separator />

            {/* Currency Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">{t("currency")}</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">{t("defaultCurrency")}</Label>
                <Select value={tempCurrency} onValueChange={handleCurrencyChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectCurrency")} />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.value} value={curr.value}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {curr.symbol}
                          </Badge>
                          <span>{curr.label}</span>
                          <span className="text-muted-foreground">({curr.value})</span>
                          {hasConversionRate(curr.value) && curr.value !== "USD" && (
                            <Badge variant="secondary" className="text-xs">
                              Rate: {getConversionRate(curr.value)}
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Conversion Rate Input */}
                {showConversionInput && (
                  <div className="space-y-2 p-3 border rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <InfoIcon className="h-4 w-4 text-blue-500" />
                      <Label className="text-sm font-medium">
                        {t("conversionRate")} (USD to {tempCurrency})
                      </Label>
                    </div>
                    <Input
                      type="number"
                      step="0.0001"
                      min="0"
                      placeholder={t("enterConversionRate")}
                      value={tempConversionRate}
                      onChange={(e) => setTempConversionRate(e.target.value)}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("conversionRateDescription", { currency: tempCurrency })}
                    </p>
                    {tempConversionRate && !isNaN(Number.parseFloat(tempConversionRate)) && (
                      <div className="text-xs text-muted-foreground">
                        {t("preview")}: $1.00 USD = {Number.parseFloat(tempConversionRate).toFixed(4)} {tempCurrency}
                      </div>
                    )}
                  </div>
                )}

                {conversionError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{conversionError}</AlertDescription>
                  </Alert>
                )}

                {selectedCurrency && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{t("preview")}:</span>
                    <Badge variant="secondary">{formatCurrency(1234.56)}</Badge>
                    {tempCurrency !== "USD" && <span className="text-xs">(Stored as: $1,234.56 USD)</span>}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Date Format Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">{t("dateFormat")}</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">{t("dateDisplayFormat")}</Label>
                <Select value={tempDateFormat} onValueChange={(value: DateFormat) => setTempDateFormat(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectDateFormat")} />
                  </SelectTrigger>
                  <SelectContent>
                    {dateFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div className="flex items-center gap-2">
                          <span>{format.label}</span>
                          <Badge variant="outline" className="text-xs">
                            {format.example}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedDateFormat && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{t("preview")}:</span>
                    <Badge variant="secondary">{selectedDateFormat.example}</Badge>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Language Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                <h3 className="text-sm font-medium">{t("language")}</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">{t("displayLanguage")}</Label>
                <Select value={tempLanguage} onValueChange={setTempLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectLanguage")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        <span>🇺🇸</span>
                        <span>{t("english")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="es">
                      <div className="flex items-center gap-2">
                        <span>🇪🇸</span>
                        <span>{t("spanish")}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Theme Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <PaletteIcon className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">{t("theme")}</h3>
              </div>
              <div className="space-y-2">
                <Label>{t("appearanceMode")}</Label>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <span className="text-sm text-muted-foreground">
                    {t("currentTheme")}:{" "}
                    {theme === "light" ? t("lightMode") : theme === "dark" ? t("darkMode") : t("systemMode")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{t("themeDescription")}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4 py-4">
            <DataExportImport />
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave}>{t("saveSettings")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
