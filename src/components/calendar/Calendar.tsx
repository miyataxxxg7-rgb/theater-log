"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTickets } from "@/hooks/useTickets";
import { Ticket, TicketStatus, STATUS_CONFIG } from "@/types/ticket";
import clsx from "clsx";

export function TicketCalendar() {
    const { tickets, getTicketsForDate } = useTickets();
    const [currentDate, setCurrentDate] = useState(new Date());

    // 現在の年月を取得
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 月の初日と最終日を取得
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // 月の最初の曜日と日数
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    // 今日の日付
    const today = new Date();
    const isToday = (day: number) => {
        return (
            year === today.getFullYear() &&
            month === today.getMonth() &&
            day === today.getDate()
        );
    };

    // その日のチケットイベントを取得
    const getDateEvents = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const ticketsForDate = getTicketsForDate(dateStr);

        const events: Array<{ type: string; ticket: Ticket; config: typeof STATUS_CONFIG[TicketStatus] }> = [];

        ticketsForDate.forEach(ticket => {
            const { applicationStart, applicationEnd, resultDate, paymentDeadline, ticketIssueDate, showDate } = ticket.dates;
            const config = STATUS_CONFIG[ticket.status];

            // 申込期間中
            if (applicationStart && applicationEnd && dateStr >= applicationStart && dateStr <= applicationEnd) {
                events.push({ type: 'applying', ticket, config });
            }

            // 当落発表日
            if (resultDate && dateStr === resultDate) {
                events.push({ type: 'result', ticket, config });
            }

            // 入金締切日
            if (paymentDeadline && dateStr === paymentDeadline.split('T')[0]) {
                events.push({ type: 'payment', ticket, config });
            }

            // 発券開始日
            if (ticketIssueDate && dateStr === ticketIssueDate) {
                events.push({ type: 'issue', ticket, config });
            }

            // 公演日
            if (showDate && dateStr === showDate.split('T')[0]) {
                events.push({ type: 'show', ticket, config });
            }
        });

        return events;
    };

    // 前月・次月・今月への移動
    const goToPreviousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    // カレンダーの日付配列
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
        <div className="space-y-4">
            {/* ヘッダー */}
            <div className="flex items-center justify-between px-2">
                <button
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-black/5 rounded-full transition-colors"
                    aria-label="前月"
                >
                    <ChevronLeft className="w-5 h-5 text-pencil" />
                </button>

                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-pencil">
                        {year}年 {month + 1}月
                    </h2>
                    <button
                        onClick={goToToday}
                        className="text-sm px-3 py-1 bg-[#ffc0cb]/20 text-pencil rounded-full hover:bg-[#ffc0cb]/30 transition-colors"
                    >
                        今日
                    </button>
                </div>

                <button
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-black/5 rounded-full transition-colors"
                    aria-label="次月"
                >
                    <ChevronRight className="w-5 h-5 text-pencil" />
                </button>
            </div>

            {/* カレンダーの外枠（ラッパー） */}
            <div className="calendar-wrapper bg-white border border-pencil/20 rounded-2xl p-[20px] shadow-sm overflow-hidden box-border max-w-full w-full flex flex-col items-center">
                {/* 曜日ヘッダー */}
                <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4 w-full table-fixed-like">
                    {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                        <div
                            key={day}
                            className={clsx(
                                "text-center text-xs md:text-sm font-bold py-1",
                                index === 0 ? "text-[#ec4899]" :
                                    index === 6 ? "text-[#06b6d4]" :
                                        "text-pencil-light"
                            )}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* 日付グリッド本体 - 魔法の呪文：親の幅に絶対に従わせるための強制設定 */}
                <div className="grid grid-cols-7 gap-1 md:gap-2 w-full max-w-full box-border" style={{ gridAutoRows: '1fr' }}>
                    {calendarDays.map((day, index) => {
                        if (day === null) {
                            return <div key={`empty-${index}`} className="aspect-square w-full" />;
                        }

                        const events = getDateEvents(day);

                        return (
                            <div
                                key={day}
                                className={clsx(
                                    "aspect-square p-1 md:p-1.5 rounded-xl transition-all relative min-w-0 w-full overflow-hidden border border-transparent box-border",
                                    isToday(day)
                                        ? "bg-[#ffc0cb] text-white font-bold shadow-md scale-[0.98]"
                                        : events.length > 0
                                            ? "bg-gray-50/80 hover:bg-gray-100 hover:border-pencil/5"
                                            : "hover:bg-black/5"
                                )}
                            >
                                {/* 日付 */}
                                <div className={clsx(
                                    "text-sm font-medium mb-1 relative z-10",
                                    isToday(day) ? "text-white" : "text-pencil"
                                )}>
                                    {day}
                                </div>

                                {/* イベントインジケーター（シール・スタンプ風） */}
                                <div className="absolute inset-0 pointer-events-none p-0.5 pt-7 md:pt-8 space-y-0.5 overflow-hidden flex flex-col items-start px-1 box-border">
                                    {/* 申込期間（矢印付きの線） */}
                                    {events.filter(e => e.type === 'applying').map((event, i) => {
                                        const { applicationStart, applicationEnd } = event.ticket.dates;
                                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const isStart = dateStr === applicationStart;
                                        const isEnd = dateStr === applicationEnd;

                                        // テキストを表示するかどうかの判定: 開始日か、月初の1日か、日曜日の場合のみ表示
                                        const shouldShowText = isStart || day === 1 || index % 7 === 0;

                                        return (
                                            <div key={`applying-${event.ticket.id}-${i}`} className="w-full flex flex-col items-center overflow-hidden max-w-full">
                                                {/* 公演名テキスト（接頭辞付き） */}
                                                <div
                                                    className="w-full text-[6px] md:text-[7.5px] leading-tight box-border whitespace-pre-wrap break-words overflow-visible !block"
                                                    style={{
                                                        color: STATUS_CONFIG.applying.color,
                                                        visibility: shouldShowText ? 'visible' : 'hidden'
                                                    }}
                                                >
                                                    🎫申込: {event.ticket.title}
                                                </div>
                                                {/* 矢印付きの線 */}
                                                <div className="w-full relative h-[3px] flex items-center shrink-0 mt-0.5">
                                                    <div
                                                        className="absolute h-[1.2px] w-full"
                                                        style={{ backgroundColor: STATUS_CONFIG.applying.color }}
                                                    />
                                                    {isStart && (
                                                        <div
                                                            className="absolute left-0 text-[7px] font-bold leading-none z-10"
                                                            style={{ color: STATUS_CONFIG.applying.color }}
                                                        >
                                                            ←
                                                        </div>
                                                    )}
                                                    {isEnd && (
                                                        <div
                                                            className="absolute right-0 text-[7px] font-bold leading-none z-10"
                                                            style={{ color: STATUS_CONFIG.applying.color }}
                                                        >
                                                            →
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* 単日イベント（当落・入金・発券・公演） */}
                                    {events.filter(e => e.type !== 'applying').map((event, i) => {
                                        let icon = "";
                                        let label = "";
                                        let extraClass = "";
                                        let timeStr = "";

                                        // 時刻情報の取得用ヘルパー
                                        const getTime = (isoString?: string) => {
                                            if (!isoString || !isoString.includes('T')) return "";
                                            return isoString.split('T')[1].substring(0, 5);
                                        };

                                        switch (event.type) {
                                            case 'result':
                                                icon = "📢";
                                                label = "当落";
                                                extraClass = "text-blue-500";
                                                break;
                                            case 'payment':
                                                icon = "⚠️";
                                                label = "入金";
                                                extraClass = "text-red-600 font-bold";
                                                timeStr = getTime(event.ticket.dates.paymentDeadline);
                                                break;
                                            case 'issue':
                                                icon = "🏪";
                                                label = "発券";
                                                extraClass = "text-green-600";
                                                break;
                                            case 'show':
                                                const isWatched = event.ticket.status === 'watched';
                                                icon = isWatched ? "🩷" : "⭐";
                                                label = isWatched ? "観劇" : "公演";
                                                extraClass = isWatched ? "text-pink-500" : "text-yellow-500";
                                                timeStr = getTime(event.ticket.dates.showDate);
                                                break;
                                        }

                                        return (
                                            <div
                                                key={`stamp-${event.ticket.id}-${event.type}-${i}`}
                                                className="w-full max-w-full overflow-hidden box-border !block"
                                                title={`${event.ticket.title} - ${label}`}
                                                style={{ minWidth: 0 }}
                                            >
                                                <div className="flex items-start w-full">
                                                    <span className={clsx("text-[9px] md:text-[10px] flex-shrink-0 leading-normal mr-0.5", extraClass)}>
                                                        {icon}
                                                    </span>
                                                    <span className="text-[7px] md:text-[8px] text-pencil-light leading-[1.3] whitespace-pre-wrap break-words !block">
                                                        {label}: {timeStr && `${timeStr} `}{event.ticket.title}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 凡例 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs px-2">
                {(Object.keys(STATUS_CONFIG) as TicketStatus[]).map((status) => {
                    const config = STATUS_CONFIG[status];
                    return (
                        <div key={status} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: config.color }}
                            />
                            <span className="text-pencil-light">{config.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
