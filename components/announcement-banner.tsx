"use client"

import { useState } from "react"
import { MegaphoneIcon, XIcon } from "lucide-react"

interface AnnouncementBannerProps {
    title: string
    message: string
    href?: string
}

export function AnnouncementBanner({ title, message, href }: AnnouncementBannerProps) {
    const [visible, setVisible] = useState(true)

    if (!visible) return null

    return (
        <div className="flex items-start gap-3.5 rounded-[var(--radius)] border border-[hsl(45_90%_80%)] bg-[linear-gradient(100deg,hsl(48_96%_94%),hsl(45_96%_90%))] px-4 py-4">
            <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[hsl(38_92%_50%)] text-white">
                <MegaphoneIcon className="h-[18px] w-[18px]" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="m-0 mb-0.5 text-[14.5px] font-bold text-[hsl(32_70%_28%)]">{title}</h3>
                <p className="m-0 text-[13px] text-[hsl(32_45%_35%)]">
                    {href ? (
                        <>
                            {message.split("tại đây")[0]}
                            <a href={href} className="font-semibold text-primary">tại đây</a>
                            {message.split("tại đây")[1]}
                        </>
                    ) : message}
                </p>
            </div>
            <button
                onClick={() => setVisible(false)}
                className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] border-0 bg-transparent text-[hsl(32_40%_45%)] transition-colors hover:bg-[hsl(45_70%_84%)]"
            >
                <XIcon className="h-[18px] w-[18px]" />
            </button>
        </div>
    )
}
