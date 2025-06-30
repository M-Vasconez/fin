"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Currency = "USD" | "EUR" | "MXN" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "BRL"
export type DateFormat = "dd/mm/yyyy" | "mm/dd/yyyy" | "yyyy-mm-dd"
export type ThemeMode = "light" | "dark" | "system"

interface ConversionRate {
  currency: Currency
  rate: number // Rate to convert FROM USD to this currency
  lastUpdated: string
}

interface SettingsContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  dateFormat: DateFormat
  setDateFormat: (format: DateFormat) => void
  userName: string
  setUserName: (name: string) => void
  conversionRates: ConversionRate[]
  setConversionRate: (currency: Currency, rate: number) => void
  getConversionRate: (currency: Currency) => number | null
  hasConversionRate: (currency: Currency) => boolean
  formatCurrency: (amount: number, displayCurrency?: Currency) => string
  formatDate: (dateString: string) => string
  convertFromUSD: (amountUSD: number, toCurrency: Currency) => number
  convertToUSD: (amount: number, fromCurrency: Currency) => number
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  MXN: "$",
  GBP: "£",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
  CNY: "¥",
  BRL: "R$",
}

const currencyLocales: Record<Currency, string> = {
  USD: "en-US",
  EUR: "de-DE",
  MXN: "es-MX",
  GBP: "en-GB",
  JPY: "ja-JP",
  CAD: "en-CA",
  AUD: "en-AU",
  CHF: "de-CH",
  CNY: "zh-CN",
  BRL: "pt-BR",
}

// Add after currencyLocales
const defaultConversionRates: ConversionRate[] = [
  { currency: "USD", rate: 1, lastUpdated: new Date().toISOString() },
  { currency: "EUR", rate: 0.85, lastUpdated: new Date().toISOString() },
  { currency: "GBP", rate: 0.75, lastUpdated: new Date().toISOString() },
  { currency: "JPY", rate: 110, lastUpdated: new Date().toISOString() },
  { currency: "CAD", rate: 1.25, lastUpdated: new Date().toISOString() },
  { currency: "AUD", rate: 1.35, lastUpdated: new Date().toISOString() },
]

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD")
  const [dateFormat, setDateFormatState] = useState<DateFormat>("mm/dd/yyyy")
  const [userName, setUserNameState] = useState<string>("User")
  const [conversionRates, setConversionRatesState] = useState<ConversionRate[]>(defaultConversionRates)

  useEffect(() => {
    // Load settings from localStorage
    const savedCurrency = localStorage.getItem("currency") as Currency
    const savedDateFormat = localStorage.getItem("dateFormat") as DateFormat
    const savedUserName = localStorage.getItem("userName")
    const savedConversionRates = localStorage.getItem("conversionRates")

    if (savedCurrency && Object.keys(currencySymbols).includes(savedCurrency)) {
      setCurrencyState(savedCurrency)
    }
    if (savedDateFormat && ["dd/mm/yyyy", "mm/dd/yyyy", "yyyy-mm-dd"].includes(savedDateFormat)) {
      setDateFormatState(savedDateFormat)
    }
    if (savedUserName) {
      setUserNameState(savedUserName)
    }
    if (savedConversionRates) {
      try {
        const rates = JSON.parse(savedConversionRates)
        setConversionRatesState(rates)
      } catch (e) {
        console.error("Failed to parse conversion rates from localStorage")
      }
    }
  }, [])

  const setConversionRate = (currency: Currency, rate: number) => {
    const newRates = conversionRates.filter((r) => r.currency !== currency)
    newRates.push({
      currency,
      rate,
      lastUpdated: new Date().toISOString(),
    })
    setConversionRatesState(newRates)
    localStorage.setItem("conversionRates", JSON.stringify(newRates))
  }

  const getConversionRate = (currency: Currency): number | null => {
    const rate = conversionRates.find((r) => r.currency === currency)
    return rate ? rate.rate : null
  }

  const hasConversionRate = (currency: Currency): boolean => {
    return conversionRates.some((r) => r.currency === currency)
  }

  const setCurrency = (newCurrency: Currency) => {
    // Only allow setting currency if we have a conversion rate
    if (!hasConversionRate(newCurrency)) {
      throw new Error(`No conversion rate available for ${newCurrency}`)
    }
    setCurrencyState(newCurrency)
    localStorage.setItem("currency", newCurrency)
  }

  const convertFromUSD = (amountUSD: number, toCurrency: Currency): number => {
    const rate = getConversionRate(toCurrency)
    if (rate === null) return amountUSD
    return amountUSD * rate
  }

  const convertToUSD = (amount: number, fromCurrency: Currency): number => {
    const rate = getConversionRate(fromCurrency)
    if (rate === null) return amount
    return amount / rate
  }

  const formatCurrency = (amount: number, displayCurrency?: Currency): string => {
    const targetCurrency = displayCurrency || currency
    const convertedAmount = convertFromUSD(amount, targetCurrency)

    return new Intl.NumberFormat(currencyLocales[targetCurrency], {
      style: "currency",
      currency: targetCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedAmount)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)

    switch (dateFormat) {
      case "dd/mm/yyyy":
        return date.toLocaleDateString("en-GB")
      case "mm/dd/yyyy":
        return date.toLocaleDateString("en-US")
      case "yyyy-mm-dd":
        return date.toISOString().split("T")[0]
      default:
        return date.toLocaleDateString("en-US")
    }
  }

  const setDateFormat = (format: DateFormat) => {
    setDateFormatState(format)
    localStorage.setItem("dateFormat", format)
  }

  const setUserName = (name: string) => {
    setUserNameState(name)
    localStorage.setItem("userName", name)
  }

  return (
    <SettingsContext.Provider
      value={{
        currency,
        setCurrency,
        dateFormat,
        setDateFormat,
        userName,
        setUserName,
        conversionRates,
        setConversionRate,
        getConversionRate,
        hasConversionRate,
        formatCurrency,
        formatDate,
        convertFromUSD,
        convertToUSD,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
