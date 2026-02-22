"use client";

import { Ticket } from "@/types/ticket";
import { STATUS_CONFIG } from "@/types/ticket";
import { Calendar, MapPin, Edit2, Trash2, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface TicketCardProps {
    ticket: Ticket;
    onEdit: (ticket: Ticket) => void;
    onDelete: (id: string) => void;
    onClick?: (ticket: Ticket) => void;
}

export function TicketCard({ ticket, onEdit, onDelete, onClick }: TicketCardProps) {
    const config = STATUS_CONFIG[ticket.status];

    // 最も近い重要な日付を取得
    const getNextImportantDate = () => {
        const { paymentDeadline, ticketIssueDate, showDate } = ticket.dates;
        const now = new Date();

        if (paymentDeadline && new Date(paymentDeadline) > now) {
            return { label: '入金締切', date: paymentDeadline };
        }
        if (ticketIssueDate && new Date(ticketIssueDate) > now) {
            return { label: '発券開始', date: ticketIssueDate };
        }
        if (showDate && new Date(showDate) > now) {
            return { label: '公演日', date: showDate };
        }
        return null;
    };

    const nextDate = getNextImportantDate();

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const hasTime = dateString.includes('T');

        if (hasTime) {
            return date.toLocaleString('ja-JP', {
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        return date.toLocaleString('ja-JP', {
            month: 'numeric',
            day: 'numeric'
        });
    };

    return (
        <div
            className={clsx(
                "relative bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200",
                "border-l-4 cursor-pointer",
                config.important && "ring-2 ring-red-200 animate-pulse"
            )}
            style={{ borderLeftColor: config.color }}
            onClick={() => onClick?.(ticket)}
        >
            {/* ステータスバッジ */}
            <div className="flex items-start justify-between mb-3">
                <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm"
                    style={{
                        backgroundColor: config.bgColor,
                        color: config.color
                    }}
                >
                    <span>{config.icon}</span>
                    <span>{config.label}</span>
                </div>

                {/* アクションボタン */}
                <div className="flex gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(ticket);
                        }}
                        className="p-1.5 hover:bg-black/5 rounded-full transition-colors"
                        aria-label="編集"
                    >
                        <Edit2 className="w-4 h-4 text-pencil-light" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`「${ticket.title}」を削除しますか？`)) {
                                onDelete(ticket.id);
                            }
                        }}
                        className="p-1.5 hover:bg-black/5 rounded-full transition-colors"
                        aria-label="削除"
                    >
                        <Trash2 className="w-4 h-4 text-pencil-light" />
                    </button>
                </div>
            </div>

            {/* 公演名 */}
            <h3 className="font-bold text-lg text-pencil mb-2 line-clamp-2">
                {ticket.title}
            </h3>

            {/* 会場 */}
            {ticket.venue && (
                <div className="flex items-center gap-1 text-sm text-pencil-light mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{ticket.venue}</span>
                </div>
            )}

            {/* 次の重要な日付 */}
            {nextDate && (
                <div
                    className="flex items-center gap-2 text-sm mt-3 pt-3 border-t border-pencil/10"
                    style={{ color: config.color }}
                >
                    <Calendar className="w-4 h-4" />
                    <div className="flex-1">
                        <div className="font-medium">{nextDate.label}</div>
                        <div className="text-xs opacity-80">
                            {formatDateTime(nextDate.date)}
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                </div>
            )}

            {/* 説明 */}
            {config.description && (
                <p className="text-xs text-pencil-light mt-2 italic">
                    {config.description}
                </p>
            )}

            {/* 重要マーク（未入金） */}
            {config.important && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-white text-xs font-bold">!</span>
                </div>
            )}
        </div>
    );
}
