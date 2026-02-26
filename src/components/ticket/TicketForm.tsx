"use client";

import { useState } from "react";
import { Ticket, TicketStatus, STATUS_CONFIG } from "@/types/ticket";
import { X, Calendar, MapPin, FileText, Tag } from "lucide-react";
import clsx from "clsx";

interface TicketFormProps {
    initialData?: Partial<Ticket>;
    onSave: (data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
}

export function TicketForm({ initialData, onSave, onCancel }: TicketFormProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [status, setStatus] = useState<TicketStatus>(initialData?.status || 'applying');
    const [venue, setVenue] = useState(initialData?.venue || "");
    const [seatInfo, setSeatInfo] = useState(initialData?.seatInfo || "");
    const [memo, setMemo] = useState(initialData?.memo || "");

    // 日程情報
    const [applicationStart, setApplicationStart] = useState(initialData?.dates?.applicationStart || "");
    const [applicationEnd, setApplicationEnd] = useState(initialData?.dates?.applicationEnd || "");
    const [resultDate, setResultDate] = useState(initialData?.dates?.resultDate || "");
    const [paymentDeadline, setPaymentDeadline] = useState(
        initialData?.dates?.paymentDeadline ? initialData.dates.paymentDeadline.split('T')[0] : ""
    );
    const [paymentDeadlineTime, setPaymentDeadlineTime] = useState(
        initialData?.dates?.paymentDeadline ? initialData.dates.paymentDeadline.split('T')[1]?.substring(0, 5) || "23:59" : "23:59"
    );
    const [ticketIssueDate, setTicketIssueDate] = useState(initialData?.dates?.ticketIssueDate || "");
    const [showDate, setShowDate] = useState(
        initialData?.dates?.showDate ? initialData.dates.showDate.split('T')[0] : ""
    );
    const [showTime, setShowTime] = useState(
        initialData?.dates?.showDate ? initialData.dates.showDate.split('T')[1]?.substring(0, 5) || "13:00" : "13:00"
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const fullPaymentDeadline = paymentDeadline && paymentDeadlineTime
            ? `${paymentDeadline}T${paymentDeadlineTime}:00`
            : undefined;

        const fullShowDate = showDate && showTime
            ? `${showDate}T${showTime}:00`
            : undefined;

        onSave({
            title,
            status,
            dates: {
                applicationStart: applicationStart || undefined,
                applicationEnd: applicationEnd || undefined,
                resultDate: resultDate || undefined,
                paymentDeadline: fullPaymentDeadline,
                ticketIssueDate: ticketIssueDate || undefined,
                showDate: fullShowDate,
            },
            venue: venue || undefined,
            seatInfo: seatInfo || undefined,
            memo: memo || undefined,
        });
    };

    const currentConfig = STATUS_CONFIG[status];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[85vh] bg-white">
            {/* ヘッダー: 余白をキュッと詰めました */}
            <div className="flex items-center justify-between p-3 border-b border-pencil/10 bg-paper shrink-0">
                <h3 className="font-bold text-base text-pencil">
                    {initialData ? 'チケット編集' : '新規チケット登録'}
                </h3>
                <button
                    type="button"
                    onClick={onCancel}
                    className="p-1.5 hover:bg-black/5 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-pencil-light" />
                </button>
            </div>

            {/* フォーム本体: ここに強力なスクロール魔法をかけました！ */}
            <div
                className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 touch-pan-y"
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
                {/* 公演名 */}
                <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-bold text-pencil-light">
                        <Tag className="w-3.5 h-3.5" /> 公演名 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="公演名を入力"
                        className="w-full bg-[#f5f5f5] border border-pencil/20 rounded-md p-2 text-sm focus:ring-2 focus:ring-oshi outline-none transition-all"
                        required
                    />
                </div>

                {/* ステータス: 1つあたりの高さを抑えました */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-pencil-light">
                        ステータス <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                        {(Object.keys(STATUS_CONFIG) as TicketStatus[]).map((s) => {
                            const config = STATUS_CONFIG[s];
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setStatus(s)}
                                    className={clsx(
                                        "p-2 rounded-md border-2 transition-all text-left",
                                        status === s ? "ring-1" : "hover:opacity-80"
                                    )}
                                    style={{
                                        backgroundColor: status === s ? config.bgColor : '#f9fafb',
                                        borderColor: status === s ? config.color : '#e5e7eb'
                                    }}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-base">{config.icon}</span>
                                        <span className="font-bold text-[11px]" style={{ color: status === s ? config.color : '#6b7280' }}>
                                            {config.label}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 日程情報: 枠の中の余白を詰めました */}
                <div className="space-y-3 p-3 bg-gray-50 rounded-md border border-pencil/10">
                    <h4 className="font-bold text-xs text-pencil flex items-center gap-2 border-b border-pencil/5 pb-1">
                        <Calendar className="w-3.5 h-3.5" /> 日程情報
                    </h4>

                    {/* 申込期間 */}
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-pencil-light">申込期間</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="date" value={applicationStart} onChange={(e) => setApplicationStart(e.target.value)} className="bg-white border border-pencil/20 rounded-md p-1.5 text-xs outline-none" />
                            <input type="date" value={applicationEnd} onChange={(e) => setApplicationEnd(e.target.value)} className="bg-white border border-pencil/20 rounded-md p-1.5 text-xs outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* 当落発表日 */}
                        <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-pencil-light">当落発表日</label>
                            <input type="date" value={resultDate} onChange={(e) => setResultDate(e.target.value)} className="w-full bg-white border border-pencil/20 rounded-md p-1.5 text-xs outline-none" />
                        </div>
                        {/* 発券開始日 */}
                        <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-pencil-light">発券開始日</label>
                            <input type="date" value={ticketIssueDate} onChange={(e) => setTicketIssueDate(e.target.value)} className="w-full bg-white border border-pencil/20 rounded-md p-1.5 text-xs outline-none" />
                        </div>
                    </div>

                    {/* 入金締切 */}
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-pencil-light">入金締切日時</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="date" value={paymentDeadline} onChange={(e) => setPaymentDeadline(e.target.value)} className="bg-white border border-pencil/20 rounded-md p-1.5 text-xs outline-none" />
                            <input type="time" value={paymentDeadlineTime} onChange={(e) => setPaymentDeadlineTime(e.target.value)} className="bg-white border border-pencil/20 rounded-md p-1.5 text-xs outline-none" />
                        </div>
                    </div>

                    {/* 公演日時 */}
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-pencil-light">公演日時</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="date" value={showDate} onChange={(e) => setShowDate(e.target.value)} className="bg-white border border-pencil/20 rounded-md p-1.5 text-xs outline-none" />
                            <input type="time" value={showTime} onChange={(e) => setShowTime(e.target.value)} className="bg-white border border-pencil/20 rounded-md p-1.5 text-xs outline-none" />
                        </div>
                    </div>
                </div>

                {/* 会場 & 座席 */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-pencil-light">
                            <MapPin className="w-3.5 h-3.5" /> 会場
                        </label>
                        <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="会場名" className="w-full bg-[#f5f5f5] border border-pencil/20 rounded-md p-2 text-sm outline-none" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-pencil-light">座席</label>
                        <input type="text" value={seatInfo} onChange={(e) => setSeatInfo(e.target.value)} placeholder="座席番号" className="w-full bg-[#f5f5f5] border border-pencil/20 rounded-md p-2 text-sm outline-none" />
                    </div>
                </div>

                {/* メモ: 行数を減らしてコンパクトに */}
                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-pencil-light">
                        <FileText className="w-3.5 h-3.5" /> メモ
                    </label>
                    <textarea
                        rows={2}
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="メモ..."
                        className="w-full bg-[#f5f5f5] border border-pencil/20 rounded-md p-2 text-sm outline-none resize-none"
                    />
                </div>
            </div>

            {/* フッター: ボタンを少し細くしました */}
            <div className="p-3 border-t border-pencil/10 bg-white shrink-0">
                <button
                    type="submit"
                    className="w-full font-bold py-2.5 rounded-lg shadow-md hover:opacity-90 transition-all active:scale-[0.98]"
                    style={{ backgroundColor: currentConfig.color, color: 'white' }}
                >
                    {initialData ? '更新する' : '登録する'}
                </button>
            </div>
        </form>
    );
}
