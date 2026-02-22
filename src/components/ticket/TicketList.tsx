"use client";

import { useState } from "react";
import { useTickets } from "@/hooks/useTickets";
import { Ticket, TicketStatus } from "@/types/ticket";
import { TicketCard } from "./TicketCard";
import { TicketForm } from "./TicketForm";
import { Plus, Filter } from "lucide-react";
import { STATUS_CONFIG } from "@/types/ticket";
import clsx from "clsx";

export function TicketList() {
    const { tickets, addTicket, updateTicket, deleteTicket } = useTickets();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
    const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all');

    const handleEdit = (ticket: Ticket) => {
        setEditingTicket(ticket);
        setIsFormOpen(true);
    };

    const handleSave = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingTicket) {
            updateTicket(editingTicket.id, ticketData);
        } else {
            addTicket(ticketData);
        }
        setIsFormOpen(false);
        setEditingTicket(null);
    };

    const handleCancel = () => {
        setIsFormOpen(false);
        setEditingTicket(null);
    };

    // フィルタリング
    const filteredTickets = filterStatus === 'all'
        ? tickets
        : tickets.filter(ticket => ticket.status === filterStatus);

    // ステータス別にカウント
    const getStatusCount = (status: TicketStatus) => {
        return tickets.filter(ticket => ticket.status === status).length;
    };

    return (
        <div className="space-y-4">
            {/* ヘッダー */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-pencil">チケット一覧</h2>
                <button
                    onClick={() => {
                        setEditingTicket(null);
                        setIsFormOpen(true);
                    }}
                    className="flex items-center gap-2 bg-[#ffc0cb] hover:bg-[#ffc0cb]/90 text-pencil px-4 py-2 rounded-full font-medium transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    <span>新規登録</span>
                </button>
            </div>

            {/* ステータスフィルター */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Filter className="w-4 h-4 text-pencil-light flex-shrink-0" />
                <button
                    onClick={() => setFilterStatus('all')}
                    className={clsx(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                        filterStatus === 'all'
                            ? "bg-pencil text-white"
                            : "bg-gray-100 text-pencil-light hover:bg-gray-200"
                    )}
                >
                    すべて ({tickets.length})
                </button>
                {(Object.keys(STATUS_CONFIG) as TicketStatus[]).map((status) => {
                    const count = getStatusCount(status);
                    if (count === 0) return null;

                    const config = STATUS_CONFIG[status];
                    return (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={clsx(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1",
                                filterStatus === status
                                    ? "ring-2"
                                    : "hover:opacity-80"
                            )}
                            style={{
                                backgroundColor: config.bgColor,
                                color: config.color
                            }}
                        >
                            <span>{config.icon}</span>
                            <span>{config.label} ({count})</span>
                        </button>
                    );
                })}
            </div>

            {/* チケット一覧 */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredTickets.length === 0 ? (
                    <div className="text-center py-12 text-pencil-light">
                        <p className="mb-2">
                            {filterStatus === 'all'
                                ? 'チケットがまだ登録されていません。'
                                : 'このステータスのチケットはありません。'}
                        </p>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="text-[#ec4899] hover:underline"
                        >
                            ＋ 新規登録
                        </button>
                    </div>
                ) : (
                    filteredTickets.map((ticket) => (
                        <TicketCard
                            key={ticket.id}
                            ticket={ticket}
                            onEdit={handleEdit}
                            onDelete={deleteTicket}
                        />
                    ))
                )}
            </div>

            {/* チケット登録フォーム（モーダル） */}
            {isFormOpen && (
                <>
                    {/* 背景オーバーレイ */}
                    <div
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        onClick={handleCancel}
                    />

                    {/* フォームモーダル */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <div
                            className="bg-white rounded-lg shadow-xl max-h-[90vh] w-full max-w-2xl overflow-hidden pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <TicketForm
                                initialData={editingTicket || undefined}
                                onSave={handleSave}
                                onCancel={handleCancel}
                            />
                        </div>
                    </div>
                </>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f3f4f6;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
            `}</style>
        </div>
    );
}

export default TicketList;
