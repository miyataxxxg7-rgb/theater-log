"use client";

import { useState } from "react";
import { useLogs } from "@/hooks/useLogs";
import { Calendar, Clock, MapPin, Armchair, Edit2, Trash2 } from "lucide-react";
import { LogForm } from "@/forms/LogForm";
import type { Log } from "@/types/theater";

export function LogList() {
    const { logs, updateLog, deleteLog } = useLogs();
    const [editingLog, setEditingLog] = useState<Log | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = (log: Log) => {
        setEditingLog(log);
        setIsEditing(true);
    };

    const handleDelete = (logId: string) => {
        if (window.confirm("このログを削除しますか？")) {
            deleteLog(logId);
        }
    };

    if (logs.length === 0) {
        return <p className="text-pencil-light text-center py-8">まだ記録はありません。</p>;
    }

    return (
        <>
            <div className="space-y-4">
                {logs.map((log) => (
                    <div key={log.id} className="bg-white/60 p-4 rounded-lg border border-pencil/10 shadow-sm">
                        <div className="flex gap-4">
                            {/* ログ内容 */}
                            <div className="flex-1 space-y-3">
                                {/* 演目タイトル */}
                                <div>
                                    <h3 className="font-bold text-lg text-pencil">{log.title}</h3>
                                </div>

                                {/* 日付と開演時間 */}
                                <div className="flex gap-4 text-sm text-pencil-light">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{log.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{log.showTime}</span>
                                    </div>
                                </div>

                                {/* 劇場 */}
                                <div className="flex items-center gap-1 text-sm text-pencil-light">
                                    <MapPin className="w-4 h-4" />
                                    <span>{log.theater}</span>
                                </div>

                                {/* 座席情報 */}
                                <div className="flex items-center gap-1 text-sm text-pencil-light">
                                    <Armchair className="w-4 h-4" />
                                    <span>{log.seatId}</span>
                                </div>

                                {/* メモ */}
                                {log.memo && (
                                    <div className="mt-2 pt-2 border-t border-pencil/10">
                                        <p className="text-sm text-pencil/80 whitespace-pre-wrap">{log.memo}</p>
                                    </div>
                                )}
                            </div>

                            {/* 編集・削除ボタン */}
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => handleEdit(log)}
                                    className="bg-[#ffc0cb] text-pencil px-3 py-2 rounded-lg hover:opacity-80 transition-opacity flex items-center gap-1 text-sm font-medium"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    編集
                                </button>
                                <button
                                    onClick={() => handleDelete(log.id)}
                                    className="bg-[#ffc0cb] text-pencil px-3 py-2 rounded-lg hover:opacity-80 transition-opacity flex items-center gap-1 text-sm font-medium"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    削除
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 編集モーダル */}
            {isEditing && editingLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                        <LogForm
                            seatId={editingLog.seatId}
                            initialData={{
                                title: editingLog.title,
                                date: editingLog.date,
                                showTime: editingLog.showTime,
                                timeType: editingLog.timeType,
                                theater: editingLog.theater,
                                memo: editingLog.memo
                            }}
                            onSave={(logData) => {
                                updateLog(editingLog.id, logData);
                                setIsEditing(false);
                                setEditingLog(null);
                            }}
                            onCancel={() => {
                                setIsEditing(false);
                                setEditingLog(null);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* 背景クリックで閉じる */}
            {isEditing && (
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => {
                    setIsEditing(false);
                    setEditingLog(null);
                }} />
            )}
        </>
    );
}
