"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTickets } from "@/hooks/useTickets";
import { Ticket, TicketStatus, STATUS_CONFIG } from "@/types/ticket";
import clsx from "clsx";

export function TicketCalendar() {
    const { tickets, getTicketsForDate } = useTickets();
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const today = new Date();
    const isToday = (day: number) => {
        return (
            year === today.getFullYear() &&
            month === today.getMonth() &&
            day === today.getDate()
        );
    };

    const getDateEvents = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const ticketsForDate = getTicketsForDate(dateStr);
        const events: Array<{ type: string; ticket: Ticket; config: typeof STATUS_CONFIG[TicketStatus] }> = [];

        ticketsForDate.forEach(ticket => {
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
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(null);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        return days;
    }, [firstDayOfWeek, daysInMonth]);

    return (
        <div className="space-y-4 max-w-md mx-auto">
            <div className="flex items-center justify-between px-2">
                <button onClick={goToPreviousMonth} className="p-2 hover:bg-black/5 rounded-full">
                    <ChevronLeft className="w-5 h-5 text-pencil" />
                </button>
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-pencil">{year}年 {month + 1}月</h2>
                    <button onClick={goToToday} className="text-[10px] px-2 py-0.5 bg-[#ffc0cb]/20 text-pencil rounded-full">今日</button>
                </div>
                <button onClick={goToNextMonth} className="p-2 hover:bg-black/5 rounded-full">
                    <ChevronRight className="w-5 h-5 text-pencil" />
                </button>
            </div>

            <div className="bg-white border border-pencil/10 rounded-xl p-2 shadow-sm w-full">
                <div className="grid grid-cols-7 mb-2">
                    {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                        <div key={day} className={clsx("text-center text-[10px] font-bold", index === 0 ? "text-pink-500" : index === 6 ? "text-blue-500" : "text-pencil-light")}>
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-px bg-gray-100 border border-gray-100">
                    {calendarDays.map((day, index) => {
                        if (day === null) return <div key={`empty-${index}`} className="bg-white aspect-square" />;
                        const events = getDateEvents(day);
                        return (
                            <div key={day} className={clsx("bg-white aspect-square p-0.5 relative flex flex-col items-center", isToday(day) && "bg-pink-50")}>
                                <span className={clsx("text-[10px] z-10", isToday(day) ? "text-pink-600 font-bold" : "text-pencil")}>{day}</span>
                                <div className="mt-auto mb-0.5 flex flex-wrap justify-center gap-0.5 w-full px-0.5">
                                    {events.slice(0, 3).map((event, i) => (
                                        <div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: event.config.color }} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] px-2 justify-center pb-10">
                {(Object.keys(STATUS_CONFIG) as TicketStatus[]).map((status) => {
                    const config = STATUS_CONFIG[status];
                    return (
                        <div key={status} className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                            <span className="text-pencil-light">{config.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
