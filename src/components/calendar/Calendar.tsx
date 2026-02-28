"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTickets } from "@/hooks/useTickets";
import { Ticket, TicketStatus, STATUS_CONFIG } from "@/types/ticket";
import clsx from "clsx";

export function TicketCalendar() {
    const { tickets } = useTickets();
    const [currentDate, setCurrentDate] = useState(new Date());

    // 🌟 ポップアップ用の状態（どの日付が押されたか）を記憶する機能を追加！
    const [popupData, setPopupData] = useState<{ day: number, events: any[] } | null>(null);

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
        <div className="space-y-4 w-full max-w-2xl mx-auto relative">
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
                            <div
                                key={day}
                                // 🌟 予定がある日をクリックしたらポップアップを出す！
                                onClick={() => events.length > 0 && setPopupData({ day, events })}
                                className={clsx(
                                    "min-h-[70px] md:min-h-[90px] p-1 rounded-md border flex flex-col overflow-hidden transition-colors w-full min-w-0",
                                    isToday(day) ? "bg-pink-50 border-pink-200" : "bg-gray-50/30 border-gray-100",
                                    events.length > 0 ? "cursor-pointer hover:border-pink-300 hover:bg-white active:scale-95" : ""
                                )}
                            >
                                <span className={clsx("text-[10px] md:text-xs mb-1 text-center shrink-0", isToday(day) ? "text-pink-600 font-bold" : "text-pencil")}>
                                    {day}
                                </span>

                                <div className="flex flex-col gap-1 w-full overflow-y-auto flex-1 pb-1" style={{ scrollbarWidth: 'none' }}>
                                    {events.map((event, i) => {
                                        let icon = ""; let textColor = "text-pencil"; let label = "";

                                        if (event.type === 'applying') { icon = "🎫"; textColor = "text-blue-500"; label = "申込"; }
                                        else if (event.type === 'result') { icon = "📢"; textColor = "text-pink-500"; label = "当落"; }
                                        else if (event.type === 'payment') { icon = "⚠️"; textColor = "text-red-500"; label = "入金"; }
                                        else if (event.type === 'issue') { icon = "🏪"; textColor = "text-green-600"; label = "発券"; }
                                        else if (event.type === 'show') { icon = "⭐"; textColor = "text-yellow-600"; label = "公演"; }

                                        return (
                                            <div key={`${event.ticket.id}-${event.type}-${i}`}
                                                className="flex flex-col w-full overflow-hidden rounded-[4px] bg-white px-1 py-0.5 shadow-sm border border-pencil/10"
                                            >
                                                <div className="flex items-center w-full gap-0.5">
                                                    <span className="flex-shrink-0 text-[9px] md:text-[10px] leading-none">{icon}</span>
                                                    <span className={clsx("font-bold text-[8px] md:text-[9px] truncate leading-none whitespace-nowrap", textColor)}>
                                                        {label}
                                                    </span>
                                                </div>
                                                <span className="truncate w-full text-[7px] md:text-[8px] text-pencil-light font-medium mt-0.5 whitespace-nowrap">
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

            {/* 🌟 ここからがポップアップ（モーダル）の魔法です！ */}
            {popupData && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200"
                    onClick={() => setPopupData(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center shrink-0">
                            <h3 className="font-bold text-pencil text-sm md:text-base">
                                {year}年{month + 1}月{popupData.day}日の予定
                            </h3>
                            <button onClick={() => setPopupData(null)} className="p-1 hover:bg-black/10 rounded-full transition-colors">
                                <X className="w-5 h-5 text-pencil-light" />
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto space-y-3 flex-1">
                            {popupData.events.map((event, i) => {
                                let icon = ""; let label = ""; let colorClass = ""; let timeStr = "";

                                if (event.type === 'applying') { icon = "🎫"; label = "申込期間"; colorClass = "text-blue-500"; }
                                else if (event.type === 'result') { icon = "📢"; label = "当落発表"; colorClass = "text-pink-500"; }
                                else if (event.type === 'payment') {
                                    icon = "⚠️"; label = "入金締切"; colorClass = "text-red-500";
                                    if (event.ticket.dates.paymentDeadline) timeStr = event.ticket.dates.paymentDeadline.split('T')[1]?.substring(0, 5) || "";
                                }
                                else if (event.type === 'issue') { icon = "🏪"; label = "発券開始"; colorClass = "text-green-600"; }
                                else if (event.type === 'show') {
                                    icon = "⭐"; label = "公演日時"; colorClass = "text-yellow-600";
                                    if (event.ticket.dates.showDate) timeStr = event.ticket.dates.showDate.split('T')[1]?.substring(0, 5) || "";
                                }

                                return (
                                    <div key={i} className="flex gap-3 items-start border-b border-pencil/5 pb-3 last:border-0 last:pb-0">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl shadow-sm border border-pencil/10">
                                            {icon}
                                        </div>
                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className={clsx("text-xs font-bold px-1.5 py-0.5 rounded-sm bg-opacity-10", colorClass)} style={{ backgroundColor: `currentColor` }}>
                                                    <span style={{ filter: 'brightness(0.7)' }}>{label}</span>
                                                </span>
                                                {timeStr && <span className="text-xs font-bold text-pencil-light">{timeStr}</span>}
                                            </div>
                                            <p className="font-bold text-sm text-pencil mt-1.5 leading-tight">{event.ticket.title}</p>
                                            {event.ticket.venue && (
                                                <p className="text-xs text-pencil-light mt-1 truncate">📍 {event.ticket.venue}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
