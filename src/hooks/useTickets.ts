"use client";

import { useState, useEffect } from "react";
import { Ticket, TicketStatus } from "@/types/ticket";

const TICKET_STORAGE_KEY = "oshigoto-tickets";

export function useTickets() {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    // 初期読み込み
    useEffect(() => {
        const saved = localStorage.getItem(TICKET_STORAGE_KEY);
        if (saved) {
            try {
                setTickets(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse tickets", e);
            }
        }
    }, []);

    // チケット追加
    const addTicket = (newTicket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
        const ticket: Ticket = {
            ...newTicket,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setTickets((prev) => {
            const updated = [ticket, ...prev];
            localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        return ticket;
    };

    // チケット更新
    const updateTicket = (id: string, updatedTicket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
        setTickets((prev) => {
            const updated = prev.map((ticket) =>
                ticket.id === id
                    ? {
                        ...updatedTicket,
                        id,
                        createdAt: ticket.createdAt,
                        updatedAt: new Date().toISOString()
                    }
                    : ticket
            );
            localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    // ステータス更新
    const updateTicketStatus = (id: string, status: TicketStatus) => {
        setTickets((prev) => {
            const updated = prev.map((ticket) =>
                ticket.id === id
                    ? { ...ticket, status, updatedAt: new Date().toISOString() }
                    : ticket
            );
            localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    // チケット削除
    const deleteTicket = (id: string) => {
        setTickets((prev) => {
            const updated = prev.filter((ticket) => ticket.id !== id);
            localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    // IDでチケット取得
    const getTicketById = (id: string) => {
        return tickets.find((ticket) => ticket.id === id);
    };

    // ステータスでフィルタ
    const getTicketsByStatus = (status: TicketStatus) => {
        return tickets.filter((ticket) => ticket.status === status);
    };

    // 特定の日付範囲でチケットを取得
    const getTicketsInDateRange = (startDate: string, endDate: string) => {
        return tickets.filter((ticket) => {
            const dates = Object.values(ticket.dates).filter(Boolean);
            return dates.some((date) => {
                if (!date) return false;
                const dateStr = date.split('T')[0]; // ISO string から日付部分を取得
                return dateStr >= startDate && dateStr <= endDate;
            });
        });
    };

    // 特定の日付にイベントがあるチケットを取得
    const getTicketsForDate = (date: string) => {
        return tickets.filter((ticket) => {
            const { applicationStart, applicationEnd, resultDate, paymentDeadline, ticketIssueDate, showDate } = ticket.dates;

            // 申込期間中かチェック
            if (applicationStart && applicationEnd) {
                if (date >= applicationStart && date <= applicationEnd) {
                    return true;
                }
            }

            // その他の日付と一致するかチェック
            const checkDate = (d?: string) => d && d.split('T')[0] === date;

            return (
                checkDate(resultDate) ||
                checkDate(paymentDeadline) ||
                checkDate(ticketIssueDate) ||
                checkDate(showDate)
            );
        });
    };

    return {
        tickets,
        addTicket,
        updateTicket,
        updateTicketStatus,
        deleteTicket,
        getTicketById,
        getTicketsByStatus,
        getTicketsInDateRange,
        getTicketsForDate,
    };
}
