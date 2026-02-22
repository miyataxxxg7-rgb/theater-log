"use client";

import { useState, useEffect } from "react";
import { Log } from "@/types/theater";

const LOG_STORAGE_KEY = "oshigoto-logs";

export function useLogs() {
    const [logs, setLogs] = useState<Log[]>([]);

    // Initial load
    useEffect(() => {
        const saved = localStorage.getItem(LOG_STORAGE_KEY);
        if (saved) {
            try {
                setLogs(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse logs", e);
            }
        }
    }, []);

    const addLog = (newLog: Omit<Log, "id">) => {
        const log: Log = {
            ...newLog,
            id: crypto.randomUUID(),
        };

        setLogs((prev) => {
            const updated = [log, ...prev];
            localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const updateLog = (id: string, updatedLog: Omit<Log, "id">) => {
        setLogs((prev) => {
            const updated = prev.map((log) =>
                log.id === id ? { ...updatedLog, id } : log
            );
            localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const deleteLog = (id: string) => {
        setLogs((prev) => {
            const updated = prev.filter((log) => log.id !== id);
            localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const getLogBySeatId = (seatId: string) => {
        return logs.find((log) => log.seatId === seatId);
    };

    return { logs, addLog, updateLog, deleteLog, getLogBySeatId };
}
