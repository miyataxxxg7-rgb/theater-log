"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTickets } from "@/hooks/useTickets";
import { Ticket, TicketStatus, STATUS_CONFIG } from "@/types/ticket";
import clsx from "clsx";

export function TicketCalendar() {
    const { tickets } = useTickets();
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const today = new Date();
    const isToday = (day: number) => {
        return year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
    };

    const getDateEvents = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const events: Array<{ type: string; ticket: Ticket; config: typeof STATUS_CONFIG[TicketStatus] }> = [];

        tickets.forEach(ticket => {
            if (!ticket.dates) return;
            const { applicationStart, applicationEnd, resultDate, paymentDeadline, ticketIssueDate, showDate } = ticket.dates;
            const config = STATUS_CONFIG[ticket.status];

            if (applicationStart && applicationEnd && dateStr >= applicationStart && dateStr <= applicationEnd) {
                events.push({ type: 'applying', ticket, config });
            }
            if (resultDate && dateStr === resultDate) {
                events.push({ type: 'result', ticket, config });
            }
            if (paymentDeadline && dateStr === paymentDeadline.split('T')[0]) {
                events.push({ type: 'payment', ticket, config });
            }
            if (ticketIssueDate && dateStr === ticketIssueDate) {
                events.push({ type: 'issue', ticket, config });
            }
            if (showDate && dateStr === showDate.split('T')[0]) {
                events.push({ type: 'show', ticket, config });
            }
        });

        return events;
    };

    const goToPreviousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    const calendarDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < firstDayOfWeek; i++) { days.push(null); }
        for (let day = 1; day <= daysInMonth; day++) { days.push(day); }
        return days;
    }, [firstDayOfWeek, daysInMonth]);

    return (
        <div className="space-y-4 w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between px-2">
                <button onClick={goToPreviousMonth} className="p-2 hover:bg-black/5 rounded-full">
                    <ChevronLeft className="w-5 h-5 text-pencil" />
                </button>
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-pencil">{year}年 {month + 1}月</h2>
                    <button onClick={goToToday} className="text-[10px] md:text-xs px-3 py-1 bg-[#ffc0cb]/20 text-pencil rounded-full hover:bg-[#ffc0cb]/30 transition-colors">今日</button>
                </div>
                <button onClick={goToNextMonth} className="p-2 hover:bg-black/5 rounded-full">
                    <ChevronRight className="w-5 h-5 text-pencil" />
                </button>
            </div>

            <div className="bg-white border border-pencil/20 rounded-2xl p-2 md:p-4 shadow-sm w-full overflow-hidden">
                <div className="grid grid-cols-7 mb-2 gap-1 text-center">
                    {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                        <div key={day} className={clsx("text-[10px] md:text-xs font-bold py-1", index === 0 ? "text-pink-500" : index === 6 ? "text-blue-500" : "text-pencil-light")}>
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                        if (day === null) return <div key={`empty-${index}`} className="min-h-[70px] md:min-h-[90px]" />;

                        const events = getDateEvents(day);
                        return (
                            <div key={day} className={clsx(
                                "min-h-[70px] md:min-h-[90px] p-1 rounded-md border flex flex-col overflow-hidden transition-colors w-full min-w-0",
                                isToday(day) ? "bg-pink-50 border-pink-200" : "bg-gray-50/30 border-gray-100 hover:bg-gray-50"
                            )}>
                                <span className={clsx("text-[10px] md:text-xs mb-1 text-center shrink-0", isToday(day) ? "text-pink-600 font-bold" : "text-pencil")}>
                                    {day}
                                </span>

                                {/* 🌟 2段表示のイベントコンテナ */}
                                <div className="flex flex-col gap-1 w-full overflow-y-auto flex-1 pb-1" style={{ scrollbarWidth: 'none' }}>
                                    {events.map((event, i) => {
                                        let icon = "";
                                        let textColor = "text-pencil";
                                        let label = "";

                                        // アイコンとラベルの設定
                                        if (event.type === 'applying') { icon = "🎫"; textColor = "text-blue-500"; label = "申込"; }
                                        else if (event.type === 'result') { icon = "📢"; textColor = "text-pink-500"; label = "当落"; }
                                        else if (event.type === 'payment') { icon = "⚠️"; textColor = "text-red-500"; label = "入金"; }
                                        else if (event.type === 'issue') { icon = "🏪"; textColor = "text-green-600"; label = "発券"; }
                                        else if (event.type === 'show') { icon = "⭐"; textColor = "text-yellow-600"; label = "公演"; }

                                        return (
                                            <div key={`${event.ticket.id}-${event.type}-${i}`}
                                                className="flex flex-col w-full overflow-hidden rounded-[4px] bg-white px-1 py-0.5 shadow-sm border border-pencil/10"
                                            >
                                                {/* 1段目：アイコンとラベル（色付き） */}
                                                <div className="flex items-center w-full gap-0.5">
                                                    <span className="flex-shrink-0 text-[10px] leading-none">{icon}</span>
                                                    <span className={clsx("font-bold text-[9px] md:text-[10px] truncate leading-none", textColor)}>
                                                        {label}
                                                    </span>
                                                </div>
                                                {/* 2段目：公演名 */}
                                                <span className="truncate w-full text-[8px] md:text-[9px] text-pencil-light font-medium mt-0.5">
                                                    {event.ticket.title}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] md:text-xs px-2 justify-center pb-8">
                {(Object.keys(STATUS_CONFIG) as TicketStatus[]).map((status) => {
                    const config = STATUS_CONFIG[status];
                    return (
                        <div key={status} className="flex items-center gap-1">
                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" style={{ backgroundColor: config.color }} />
                            <span className="text-pencil-light font-medium">{config.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}