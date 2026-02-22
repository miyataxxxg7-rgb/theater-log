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

        // 入金締切日時の結合
        const fullPaymentDeadline = paymentDeadline && paymentDeadlineTime
            ? `${paymentDeadline}T${paymentDeadlineTime}:00`
            : undefined;

        // 公演日時の結合
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
        <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[90vh]">
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-4 border-b border-pencil/10 bg-paper">
                <h3 className="font-bold text-lg text-pencil">
                    {initialData ? 'チケット編集' : '新規チケット登録'}
                </h3>
                <button
                    type="button"
                    onClick={onCancel}
                    className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-pencil-light" />
                </button>
            </div>

            {/* フォーム本体 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* 公演名 */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-pencil-light">
                        <Tag className="w-4 h-4" /> 公演名 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="公演名を入力"
                        className="w-full bg-[#f5f5f5] border border-pencil/20 rounded-lg p-3 focus:ring-2 focus:ring-oshi focus:border-transparent outline-none transition-all"
                        required
                    />
                </div>

                {/* ステータス */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-pencil-light mb-2">
                        現在のステータス <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {(Object.keys(STATUS_CONFIG) as TicketStatus[]).map((s) => {
                            const config = STATUS_CONFIG[s];
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setStatus(s)}
                                    className={clsx(
                                        "p-3 rounded-lg border-2 transition-all text-left",
                                        status === s
                                            ? "ring-2"
                                            : "hover:opacity-80"
                                    )}
                                    style={{
                                        backgroundColor: status === s ? config.bgColor : '#f9fafb',
                                        borderColor: status === s ? config.color : '#e5e7eb'
                                    }}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">{config.icon}</span>
                                        <span className="font-medium text-sm" style={{ color: status === s ? config.color : '#6b7280' }}>
                                            {config.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-pencil-light">{config.description}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 日程情報 */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-pencil/10">
                    <h4 className="font-bold text-pencil flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        日程情報
                    </h4>

                    {/* 申込期間 */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-pencil-light">
                            申込期間
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="date"
                                value={applicationStart}
                                onChange={(e) => setApplicationStart(e.target.value)}
                                placeholder="開始日"
                                className="bg-white border border-pencil/20 rounded-lg p-2 text-sm focus:ring-2 focus:ring-oshi outline-none"
                            />
                            <input
                                type="date"
                                value={applicationEnd}
                                onChange={(e) => setApplicationEnd(e.target.value)}
                                placeholder="終了日"
                                className="bg-white border border-pencil/20 rounded-lg p-2 text-sm focus:ring-2 focus:ring-oshi outline-none"
                            />
                        </div>
                    </div>

                    {/* 当落発表日 */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-pencil-light">
                            当落発表日
                        </label>
                        <input
                            type="date"
                            value={resultDate}
                            onChange={(e) => setResultDate(e.target.value)}
                            className="w-full bg-white border border-pencil/20 rounded-lg p-2 text-sm focus:ring-2 focus:ring-oshi outline-none"
                        />
                    </div>

                    {/* 入金締切 */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-pencil-light">
                            入金締切日時
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="date"
                                value={paymentDeadline}
                                onChange={(e) => setPaymentDeadline(e.target.value)}
                                className="bg-white border border-pencil/20 rounded-lg p-2 text-sm focus:ring-2 focus:ring-oshi outline-none"
                            />
                            <input
                                type="time"
                                value={paymentDeadlineTime}
                                onChange={(e) => setPaymentDeadlineTime(e.target.value)}
                                className="bg-white border border-pencil/20 rounded-lg p-2 text-sm focus:ring-2 focus:ring-oshi outline-none"
                            />
                        </div>
                    </div>

                    {/* 発券開始日 */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-pencil-light">
                            発券開始日
                        </label>
                        <input
                            type="date"
                            value={ticketIssueDate}
                            onChange={(e) => setTicketIssueDate(e.target.value)}
                            className="w-full bg-white border border-pencil/20 rounded-lg p-2 text-sm focus:ring-2 focus:ring-oshi outline-none"
                        />
                    </div>

                    {/* 公演日時 */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-pencil-light">
                            公演日時
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="date"
                                value={showDate}
                                onChange={(e) => setShowDate(e.target.value)}
                                className="bg-white border border-pencil/20 rounded-lg p-2 text-sm focus:ring-2 focus:ring-oshi outline-none"
                            />
                            <input
                                type="time"
                                value={showTime}
                                onChange={(e) => setShowTime(e.target.value)}
                                className="bg-white border border-pencil/20 rounded-lg p-2 text-sm focus:ring-2 focus:ring-oshi outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* 会場 */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-pencil-light">
                        <MapPin className="w-4 h-4" /> 会場
                    </label>
                    <input
                        type="text"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        placeholder="梅田芸術劇場メインホール"
                        className="w-full bg-[#f5f5f5] border border-pencil/20 rounded-lg p-3 focus:ring-2 focus:ring-oshi outline-none transition-all"
                    />
                </div>

                {/* 座席情報 */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-pencil-light">
                        座席情報
                    </label>
                    <input
                        type="text"
                        value={seatInfo}
                        onChange={(e) => setSeatInfo(e.target.value)}
                        placeholder="1階 A列 12番"
                        className="w-full bg-[#f5f5f5] border border-pencil/20 rounded-lg p-3 focus:ring-2 focus:ring-oshi outline-none transition-all"
                    />
                </div>

                {/* メモ */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-pencil-light">
                        <FileText className="w-4 h-4" /> メモ
                    </label>
                    <textarea
                        rows={4}
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="備考やメモを入力..."
                        className="w-full bg-[#f5f5f5] border border-pencil/20 rounded-lg p-3 focus:ring-2 focus:ring-oshi outline-none transition-all resize-none"
                    />
                </div>
            </div>

            {/* フッター */}
            <div className="p-4 border-t border-pencil/10 bg-paper/50">
                <button
                    type="submit"
                    className="w-full font-bold py-3 rounded-xl shadow-lg hover:opacity-90 transition-all active:scale-[0.98]"
                    style={{
                        backgroundColor: currentConfig.color,
                        color: 'white'
                    }}
                >
                    {initialData ? '更新する' : '登録する'}
                </button>
            </div>
        </form>
    );
}
