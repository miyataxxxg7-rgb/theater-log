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

    const [applicationStart, setApplicationStart] = useState(initialData?.dates?.applicationStart || "");
    const [applicationEnd, setApplicationEnd] = useState(initialData?.dates?.applicationEnd || "");
    const [resultDate, setResultDate] = useState(initialData?.dates?.resultDate || "");
    const [paymentDeadline, setPaymentDeadline] = useState(initialData?.dates?.paymentDeadline ? initialData.dates.paymentDeadline.split('T')[0] : "");
    const [paymentDeadlineTime, setPaymentDeadlineTime] = useState(initialData?.dates?.paymentDeadline ? initialData.dates.paymentDeadline.split('T')[1]?.substring(0, 5) || "23:59" : "23:59");
    const [ticketIssueDate, setTicketIssueDate] = useState(initialData?.dates?.ticketIssueDate || "");
    const [showDate, setShowDate] = useState(initialData?.dates?.showDate ? initialData.dates.showDate.split('T')[0] : "");
    const [showTime, setShowTime] = useState(initialData?.dates?.showDate ? initialData.dates.showDate.split('T')[1]?.substring(0, 5) || "13:00" : "13:00");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullPaymentDeadline = paymentDeadline && paymentDeadlineTime ? `${paymentDeadline}T${paymentDeadlineTime}:00` : undefined;
        const fullShowDate = showDate && showTime ? `${showDate}T${showTime}:00` : undefined;

        onSave({
            title, status,
            dates: {
                applicationStart: applicationStart || undefined,
                applicationEnd: applicationEnd || undefined,
                resultDate: resultDate || undefined,
                paymentDeadline: fullPaymentDeadline,
                ticketIssueDate: ticketIssueDate || undefined,
                showDate: fullShowDate,
            },
            venue: venue || undefined, seatInfo: seatInfo || undefined, memo: memo || undefined,
        });
    };

    const currentConfig = STATUS_CONFIG[status];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[82vh] bg-white overflow-hidden">
            {/* ヘッダー: さらに細く */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-pencil/10 shrink-0">
                <h3 className="font-bold text-sm text-pencil">チケット登録/編集</h3>
                <button type="button" onClick={onCancel} className="p-1 hover:bg-black/5 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            {/* 本体: 隙間(space-y)を最小限に */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="space-y-1">
                    <label className="flex items-center gap-1 text-[10px] font-bold text-pencil-light"><Tag className="w-3 h-3" /> 公演名 *</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-50 border border-pencil/10 rounded p-1.5 text-sm outline-none" required />
                </div>

                <div className="grid grid-cols-3 gap-1">
                    {(Object.keys(STATUS_CONFIG) as TicketStatus[]).map((s) => {
                        const config = STATUS_CONFIG[s];
                        return (
                            <button key={s} type="button" onClick={() => setStatus(s)}
                                className={clsx("py-1 px-0.5 rounded border text-center transition-all", status === s ? "border-current ring-1" : "border-gray-200")}
                                style={{ backgroundColor: status === s ? config.bgColor : 'transparent', color: status === s ? config.color : '#9ca3af', borderColor: status === s ? config.color : '#e5e7eb' }}>
                                <span className="block text-xs font-bold leading-none">{config.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="space-y-2 p-2 bg-gray-50 rounded border border-pencil/5">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                        <div className="col-span-2 grid grid-cols-2 gap-2">
                            <div className="space-y-0.5"><label className="text-[9px] font-bold text-pencil-light">申込開始</label><input type="date" value={applicationStart} onChange={(e) => setApplicationStart(e.target.value)} className="w-full bg-white border border-pencil/10 rounded p-1 text-[11px]" /></div>
                            <div className="space-y-0.5"><label className="text-[9px] font-bold text-pencil-light">申込終了</label><input type="date" value={applicationEnd} onChange={(e) => setApplicationEnd(e.target.value)} className="w-full bg-white border border-pencil/10 rounded p-1 text-[11px]" /></div>
                        </div>
                        <div className="space-y-0.5"><label className="text-[9px] font-bold text-pencil-light">当落発表</label><input type="date" value={resultDate} onChange={(e) => setResultDate(e.target.value)} className="w-full bg-white border border-pencil/10 rounded p-1 text-[11px]" /></div>
                        <div className="space-y-0.5"><label className="text-[9px] font-bold text-pencil-light">発券開始</label><input type="date" value={ticketIssueDate} onChange={(e) => setTicketIssueDate(e.target.value)} className="w-full bg-white border border-pencil/10 rounded p-1 text-[11px]" /></div>
                        <div className="col-span-2 grid grid-cols-3 gap-1 items-end">
                            <div className="col-span-2 space-y-0.5"><label className="text-[9px] font-bold text-pencil-light">入金締切</label><input type="date" value={paymentDeadline} onChange={(e) => setPaymentDeadline(e.target.value)} className="w-full bg-white border border-pencil/10 rounded p-1 text-[11px]" /></div>
                            <input type="time" value={paymentDeadlineTime} onChange={(e) => setPaymentDeadlineTime(e.target.value)} className="bg-white border border-pencil/10 rounded p-1 text-[11px]" />
                        </div>
                        <div className="col-span-2 grid grid-cols-3 gap-1 items-end">
                            <div className="col-span-2 space-y-0.5"><label className="text-[9px] font-bold text-pencil-light">公演日時</label><input type="date" value={showDate} onChange={(e) => setShowDate(e.target.value)} className="w-full bg-white border border-pencil/10 rounded p-1 text-[11px]" /></div>
                            <input type="time" value={showTime} onChange={(e) => setShowTime(e.target.value)} className="bg-white border border-pencil/10 rounded p-1 text-[11px]" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-0.5"><label className="text-[9px] font-bold text-pencil-light">会場</label><input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} className="w-full bg-gray-50 border border-pencil/10 rounded p-1 text-xs outline-none" /></div>
                    <div className="space-y-0.5"><label className="text-[9px] font-bold text-pencil-light">座席</label><input type="text" value={seatInfo} onChange={(e) => setSeatInfo(e.target.value)} className="w-full bg-gray-50 border border-pencil/10 rounded p-1 text-xs outline-none" /></div>
                </div>

                <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-pencil-light">メモ</label>
                    <textarea rows={1} value={memo} onChange={(e) => setMemo(e.target.value)} className="w-full bg-gray-50 border border-pencil/10 rounded p-1 text-xs outline-none resize-none" />
                </div>
            </div>

            <div className="p-2 border-t border-pencil/10 bg-white shrink-0">
                <button type="submit" className="w-full font-bold py-2 rounded text-sm shadow transition-all active:scale-[0.98]" style={{ backgroundColor: currentConfig.color, color: 'white' }}>
                    {initialData ? '更新' : '登録'}
                </button>
            </div>
        </form>
    );
}
