"use client"

import { useState } from "react"
import { MegaphoneIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface AnnouncementBannerProps {
  title: string
  message: string
  href?: string
}

export function AnnouncementBanner({
  title,
  message,
  href,
}: AnnouncementBannerProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <Card className="flex-row items-start gap-3.5 rounded-[var(--radius)] border border-warning/30 bg-warning-muted px-4 py-4 shadow-none ring-0">
      <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-warning text-warning-foreground">
        <MegaphoneIcon className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="m-0 mb-0.5 text-[14.5px] font-bold text-foreground">
          {title}
        </h3>
        <p className="m-0 text-[13px] text-muted-foreground">
          {href ? (
            <>
              {message.split("tại đây")[0]}
              <a href={href} className="font-semibold text-primary">
                tại đây
              </a>
              {message.split("tại đây")[1]}
            </>
          ) : (
            message
          )}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setVisible(false)}
        className="ml-auto h-[30px] w-[30px] shrink-0 rounded-[8px] border-0 bg-transparent text-muted-foreground hover:bg-warning/20"
      >
        <XIcon className="h-[18px] w-[18px]" />
      </Button>
    </Card>
  )
}
