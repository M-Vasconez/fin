"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  BarChart3Icon,
  CreditCardIcon,
  DollarSignIcon,
  HomeIcon,
  MenuIcon,
  TagIcon,
  WalletIcon,
  TargetIcon,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function MobileNav() {
  const [open, setOpen] = useState(false)
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <span className="font-bold">Finance Manager</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-4 px-2 mt-8">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md",
                  pathname === item.href
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
