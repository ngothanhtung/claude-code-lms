import { Geist, Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="vi" suppressHydrationWarning className={cn("antialiased", fontMono.variable, "font-sans", inter.className)}>
            <body>
                <ThemeProvider>
                    <TooltipProvider>
                        <SidebarProvider>
                            {children}
                        </SidebarProvider>
                    </TooltipProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
