import { CalendarCheck2Icon } from "lucide-react"

interface GreetingCardProps {
    userName: string
    semester: string
}

function formatDate() {
    const d = new Date()
    const thu = ["Chủ nhật","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7"]
    const p = (n: number) => String(n).padStart(2, "0")
    return `${thu[d.getDay()]}, ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`
}

export function GreetingCard({ userName, semester }: GreetingCardProps) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-[var(--radius)] border border-[hsl(243_50%_91%)] bg-[linear-gradient(180deg,#fff,#fff)] px-6 py-5" style={{
            backgroundImage: "radial-gradient(ellipse 80% 100% at 105% -10%, oklch(0.96 0.04 277 / 0.08) 0%, transparent 55%), linear-gradient(180deg, #fff, #fff)",
            backgroundSize: "100% 100%",
        }}>
            <div>
                <h1 className="m-0 text-[25px] font-extrabold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                    Xin chào, {userName}!
                </h1>
                <p className="mt-[5px] text-[14px] text-muted-foreground">{semester}</p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-sm)] text-primary">
                <CalendarCheck2Icon className="h-[18px] w-[18px]" />
                <div>
                    <div className="text-[11.5px] font-medium text-muted-foreground">Hôm nay</div>
                    <div className="text-[14px] font-bold text-foreground whitespace-nowrap">{formatDate()}</div>
                </div>
            </div>
        </div>
    )
}
