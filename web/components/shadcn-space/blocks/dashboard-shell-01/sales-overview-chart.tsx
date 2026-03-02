"use client";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartConfig = {
    salaries: {
        label: "Salaries",
        color: "#2563eb", // blue-600
    },
    tickets: {
        label: "Tickets",
        color: "#3b82f6", // blue-500
    },
    whitelists: {
        label: "Whitelists",
        color: "#93c5fd", // blue-300
    },
} satisfies ChartConfig

export default function SalesOverviewChart({ chartData = [], totalActivities = 0 }: { chartData?: any[], totalActivities?: number }) {
    const Categories = [
        {
            id: 1,
            title: "Whitelists",
            color: "bg-blue-300",
        },
        {
            id: 2,
            title: "Tickets",
            color: "bg-blue-500",
        },
        {
            id: 3,
            title: "Salaries",
            color: "bg-blue-600",
        }
    ];

    return (
        <Card className="w-full bg-zinc-950/40 border-border/40">
            <CardHeader className="flex sm:flex-row flex-col justify-between sm:items-center items-start gap-3">
                <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg font-medium">Activity Overview</CardTitle>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Total Activities</span>
                        <Badge
                            className={cn(
                                "bg-teal-400/10 text-teal-400 shadow-none"
                            )}
                        >
                            {Intl.NumberFormat("en-US").format(totalActivities)} All-Time
                        </Badge>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {Categories.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                            <span className={cn("w-2.5 h-2.5 rounded-full", item.color)} />
                            <p className="text-sm text-muted-foreground">{item.title}</p>
                        </div>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full" style={{ fontFamily: 'var(--font-geist-sans), GeistSans, sans-serif' }}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(144, 164, 174, 0.3)" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            fontSize={12}
                            style={{ fontFamily: 'var(--font-geist-sans), GeistSans, sans-serif' }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            fontSize={12}
                            tickFormatter={(value) => Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)}
                            style={{ fontFamily: 'var(--font-geist-sans), GeistSans, sans-serif' }}
                        />
                        <ChartTooltip content={<ChartTooltipContent hideLabel/>} />
                        <Bar
                            dataKey="salaries"
                            fill="var(--color-salaries)"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="tickets"
                            fill="var(--color-tickets)"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="whitelists"
                            fill="var(--color-whitelists)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}