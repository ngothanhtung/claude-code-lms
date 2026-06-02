import React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  children?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-1.5">
      {/* Main Header Container */}
      <div
        className={cn(
          "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6",
          className
        )}
      >
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm font-semibold text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="flex shrink-0 items-center gap-2.5">{children}</div>
        )}
      </div>

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground select-none">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1
            return (
              <React.Fragment key={index}>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={
                      isLast ? "truncate font-bold text-foreground" : ""
                    }
                  >
                    {item.label}
                  </span>
                )}
                {!isLast && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                )}
              </React.Fragment>
            )
          })}
        </div>
      )}
    </div>
  )
}
