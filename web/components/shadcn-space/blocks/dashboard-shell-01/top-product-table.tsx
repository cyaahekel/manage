"use client";

import { MessageSquare, ShieldCheck, ExternalLink } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkLogRow } from "@/lib/db";

interface TopProductTableProps {
    work_logs?: WorkLogRow[];
}

const type_config = {
    ticket    : { icon: MessageSquare, color: "text-blue-400",   bg: "bg-blue-400/20",   label: "Ticket"    },
    whitelist : { icon: ShieldCheck,   color: "text-orange-400", bg: "bg-orange-400/20", label: "Whitelist" },
}

function format_amount(amount: string | number): string {
    return `Rp ${new Intl.NumberFormat("id-ID").format(Number(amount))}`
}

const TopProductTable = ({ work_logs = [] }: TopProductTableProps) => {
    return (
        <Card className="w-full overflow-hidden pb-0 bg-zinc-950/40 border-border/40">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3">
                <div>
                    <p className="text-sm font-semibold text-foreground">Recent Activities</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Latest staff work logs from the platform</p>
                </div>
            </CardHeader>
            <CardContent className="px-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent!">
                                <TableHead className="p-3 ps-6 w-10">#</TableHead>
                                <TableHead className="p-2">Activity</TableHead>
                                <TableHead className="p-2">Amount</TableHead>
                                <TableHead className="p-2">Staff</TableHead>
                                <TableHead className="p-2">Type</TableHead>
                                <TableHead className="p-3 pe-6 text-right">Thread</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-border">
                            {work_logs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8 text-sm">
                                        No recent activity found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {work_logs.map((item, index) => {
                                const cfg  = type_config[item.type] ?? type_config.ticket;
                                const Icon = cfg.icon;
                                return (
                                    <TableRow key={item.id}>
                                        {/* index */}
                                        <TableCell className="whitespace-nowrap p-3 ps-6 text-muted-foreground text-xs">
                                            {index + 1}
                                        </TableCell>

                                        {/* activity */}
                                        <TableCell className="whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("h-9 w-9 rounded-full flex items-center justify-center shrink-0", cfg.bg)}>
                                                    <Icon width={16} height={16} className={cfg.color} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{item.work_id}</p>
                                                    <p className="text-xs text-muted-foreground">{item.date}</p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* amount */}
                                        <TableCell className="whitespace-nowrap">
                                            <p className="text-sm font-medium text-foreground">
                                                {format_amount(item.amount)}
                                            </p>
                                        </TableCell>

                                        {/* staff */}
                                        <TableCell className="whitespace-nowrap">
                                            <p className="text-sm text-foreground">{item.staff_name}</p>
                                        </TableCell>

                                        {/* type badge */}
                                        <TableCell className="whitespace-nowrap">
                                            <Badge className={cn(
                                                "text-xs font-normal border-0 shadow-none",
                                                item.type === "ticket"
                                                    ? "bg-blue-400/10 text-blue-400"
                                                    : "bg-orange-400/10 text-orange-400"
                                            )}>
                                                {cfg.label}
                                            </Badge>
                                        </TableCell>

                                        {/* thread link */}
                                        <TableCell className="whitespace-nowrap p-3 pe-6">
                                            <div className="flex items-center justify-end">
                                                <a
                                                    href={item.thread_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex justify-center items-center rounded-full p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <ExternalLink width={15} height={15} />
                                                </a>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default TopProductTable;
