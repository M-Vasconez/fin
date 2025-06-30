"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3Icon, CreditCardIcon, DollarSignIcon, HomeIcon, TagIcon, WalletIcon, TargetIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function MainNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    {
      name: t("dashboard"),
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      name: t("accounts"),
      href: "/accounts",
      icon: WalletIcon,
    },
    {
      name: t("income"),
      href: "/income",
      icon: DollarSignIcon,
    },
    {
      name: t("expenses"),
      href: "/expenses",
      icon: CreditCardIcon,
    },
    {
      name: t("reports"),
      href: "/reports",
      icon: BarChart3Icon,
    },
    {
      name: t("categories"),
      href: "/categories",
      icon: TagIcon,
    },
    {
      name: t("goals"),
      href: "/goals",
      icon: TargetIcon,
    },
  ]

  return (
    <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
