interface DonutSegment {
    value: number
    color: string
}

interface DonutChartProps {
    segments: DonutSegment[]
    centerLabel: string
    centerSub: string
}

export function DonutChart({ segments, centerLabel, centerSub }: DonutChartProps) {
    const R = 56
    const circumference = 2 * Math.PI * R
    const total = segments.reduce((s, seg) => s + seg.value, 0)

    const circles = segments.map((seg, i) => {
        const cumulative = segments
            .slice(0, i)
            .reduce((sum, item) => sum + item.value, 0)
        const pct = seg.value / total
        const dashLen = pct * circumference
        const dashOffset = -(cumulative / total) * circumference
        return (
            <circle
                key={i}
                cx="66"
                cy="66"
                r={R}
                fill="none"
                stroke={seg.color}
                strokeWidth="16"
                strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="butt"
            />
        )
    })

    return (
        <div className="relative h-[132px] w-[132px] shrink-0">
            <svg width="132" height="132" viewBox="0 0 132 132" className="-rotate-90">
                <circle cx="66" cy="66" r={R} fill="none" stroke="oklch(0.965 0 0)" strokeWidth="16" />
                {circles}
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                    <div className="text-[19px] font-extrabold leading-none">{centerLabel}</div>
                    <div className="text-[10.5px] text-muted-foreground mt-[2px]">{centerSub}</div>
                </div>
            </div>
        </div>
    )
}
