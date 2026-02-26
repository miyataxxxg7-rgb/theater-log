"use client";

import { useState } from "react";
import { Calendar, MapPin, Armchair, X, Clock, BookOpen, FileText } from "lucide-react";

interface LogFormProps {
    seatId: string;
    initialData?: Partial<LogData>;
    onSave: (data: LogData) => void;
    onCancel: () => void;
}

export interface LogData {
    seatId: string;
    title: string;
    date: string;
    showTime: string;
    timeType: 'matinee' | 'soiree' | 'custom';
    theater: string;
    memo: string;
}

export function LogForm({ seatId, initialData, onSave, onCancel }: LogFormProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
    const [timeType, setTimeType] = useState<'matinee' | 'soiree' | 'custom'>(initialData?.timeType || 'matinee');
    const [customTime, setCustomTime] = useState(initialData?.showTime || "");
    const [theater, setTheater] = useState(initialData?.theater || "梅田芸術劇場メインホール");
    const [memo, setMemo] = useState(initialData?.memo || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let showTime = "";
        if (timeType === 'matinee') {
            showTime = "マチネ";
        } else if (timeType === 'soiree') {
            showTime = "ソワレ";
        } else {
            showTime = customTime;
        }

        onSave({
            seatId,
            title,
            date,
            showTime,
            timeType,
            theater,
            memo
        });
    };

    return (
        <form onSubmit={handleSubmit} className="relative flex flex-col h-full bg-white text-pencil max-h-[85vh]">
            {/* Header: 余白を小さくしました */}
            <div className="flex items-center justify-between p-3 border-b border-pencil/10 shrink-0">
                <h3 className="font-bold text-base">観劇ログ入力</h3>
                <button type="button" onClick={onCancel} className="p-1.5 hover:bg-black/5 rounded-full">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Main content: 隙間と余白をキュッと詰めました */}
            <div
                className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 touch-pan-y"
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
                {/* 演目名 */}
                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-pencil-light">
                        <BookOpen className="w-3.5 h-3.5" /> 演目
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="公演名を入力"
                        className="w-full bg-[#f5f5f5] border border-pencil/20 rounded-md p-2 text-sm focus:ring-2 focus:ring-oshi focus:border-transparent outline-none transition-all placeholder:text-pencil-light/50"
                        required
                    />
                </div>

                {/* 日付 */}
                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-pencil-light">
                        <Calendar className="w-3.5 h-3.5" /> 日付
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-[#f5f5f5] border border-pencil/20 rounded-md p-2 text-sm focus:ring-2 focus:ring-oshi outline-none transition-all"
                        required
                    />
                </div>

                {/* 開演時間 / マチネ・ソワレ選択 */}
                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-pencil-light">
                        <Clock className="w-3.5 h-3.5" /> 開演時間
                    </label>

                    {/* マチネ・ソワレボタン: ボタンの高さを少し細くしました */}
                    <div className="flex gap-2 mb-1">
                        <button
                            type="button"
                            onClick={() => setTimeType('matinee')}
                            className={`flex-1 py-1.5 px-2 rounded-md text-sm font-medium transition-all ${timeType === 'matinee'
                                ? 'bg-[#ffc0cb] text-pencil'
                                : 'bg-[#f5f5f5] border border-pencil/20 text-pencil hover:border-[#ffc0cb]'
                                }`}
                        >
                            マチネ
                        </button>
                        <button
                            type="button"
                            onClick={() => setTimeType('soiree')}
                            className={`flex-1 py-1.5 px-2 rounded-md text-sm font-medium transition-all ${timeType === 'soiree'
                                ? 'bg-[#ffc0cb] text-pencil'
                                : 'bg-[#f5f5f5] border border-pencil/20 text-pencil hover:border-[#ffc0cb]'
                                }`}
                        >
                            ソワレ
                        </button>
                        <button
                            type="button"
                            onClick={() => setTimeType('custom')}
                            className={`flex-1 py-1.5 px-2 rounded-md text-sm font-medium transition-all ${timeType === 'custom'
                                ? 'bg-[#ffc0cb] text-pencil'
                                : 'bg-[#f5f5f5] border border-pencil/20 text-pencil hover:border-[#ffc0cb]'
                                }`}
                        >
                            時刻入力
                        </button>
                    </div>

                    {/* 時刻入力フィールド */}
                    {timeType === 'custom' && (
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-[10px] text-pencil-light/70 mb-0.5">時</label>
                                <select
                                    value={customTime.split(':')[0] || '13'}
                                    onChange={(e) => {
                                        const minute = customTime.split(':')[1] || '00';
                                        setCustomTime(`${e.target.value}:${minute}`);
                                    }}
                                    className="w-full bg-[#f5f5f5] border border-pencil/20 rounded-md p-1.5 text-sm focus:ring-2 focus:ring-oshi outline-none transition-all"
                                    required
                                >
                                    {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                                        <option key={hour} value={hour.toString().padStart(2, '0')}>
                                            {hour.toString().padStart(2, '0')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-pencil-light/70 mb-0.5">分</label>
                                <select
                                    value={customTime.split(':')[1] || '00'}
                                    onChange={(e) => {
                                        const hour = customTime.split(':')[0] || '13';
                                        setCustomTime(`${hour}:${e.target.value}`);
                                    }}
                                    className="w-full bg-[#f5f5f5] border border-pencil/20 rounded-md p-1.5 text-sm focus:ring-2 focus:ring-oshi outline-none transition-all"
                                    required
                                >
                                    {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(minute => (
                                        <option key={minute} value={minute}>
                                            {minute}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* 劇場 */}
                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-pencil-light">
                        <MapPin className="w-3.5 h-3.5" /> 劇場
                    </label>
                    <input
                        type="text"
                        value={theater}
                        onChange={(e) => setTheater(e.target.value)}
                        className="w-full bg-[#f5f5f5] border border-pencil/20 rounded-md p-2 text-sm focus:ring-2 focus:ring-oshi outline-none transition-all"
                        required
                    />
                </div>

                {/* 座席情報（表示のみ） */}
                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-pencil-light">
                        <Armchair className="w-3.5 h-3.5" /> 座席
                    </label>
                    <div className="bg-[#f5f5f5] border border-pencil/20 rounded-md p-2 text-sm text-pencil">
                        {seatId}
                    </div>
                </div>

                {/* メモ */}
                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-pencil-light">
                        <FileText className="w-3.5 h-3.5" /> メモ
                    </label>
                    <textarea
                        rows={2}
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="観劇の感想を記入..."
                        className="w-full bg-[#f5f5f5] border border-pencil/20 rounded-md p-2 text-sm focus:ring-2 focus:ring-oshi outline-none transition-all resize-none placeholder:text-pencil-light/50"
                    />
                </div>
            </div>

            {/* 保存ボタン */}
            <div className="p-3 border-t border-pencil/10 bg-white shrink-0">
                <button
                    type="submit"
                    className="w-full bg-[#ffc0cb] text-pencil font-bold py-2.5 rounded-lg shadow-md hover:opacity-90 transition-all active:scale-[0.98]"
                >
                    保存
                </button>
            </div>
        </form>
    );
}
