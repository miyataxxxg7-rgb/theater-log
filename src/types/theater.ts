export type SeatStatus = "vacant" | "selected" | "logged";

export interface Seat {
    id: string; // `${floor}-${row}-${number}` e.g., "1F-20-15"
    floor: 1 | 2 | 3;
    row: number;
    number: number;
    section: "left" | "center" | "right";
    status: SeatStatus;
    type?: "S" | "A" | "B"; // 席種（将来用）
}

export interface Door {
    type: 'door';
    label: string;
    span: number; // Width in seat units
    rowSpan?: number; // Height in row units (default 1)
}

export interface RowLabel {
    type: 'rowLabel';
    value: number;
}

export interface SeatBlock {
    type: 'block';
    area?: 'LB' | 'RB'; // Left/Right Balcony
    seats: (number | null)[]; // null = spacer (invisible placeholder)
}

export interface SeatRow {
    rowNumber: number;
    seats: (Seat | Door | RowLabel | null)[]; // null=space (invisible), Door=label, Seat=seat, RowLabel=label
    curve?: number; // rotation degree for visual curve effect
    offset?: number; // horizontal offset for layout
}

export interface FloorMap {
    floor: 1 | 2 | 3;
    rows: SeatRow[];
}

export type Log = {
    id: string; // UUID
    seatId: string;
    title: string; // 演目
    date: string; // 日付 (ISO String)
    showTime: string; // 開演時間 (マチネ/ソワレ/時刻)
    timeType: 'matinee' | 'soiree' | 'custom'; // 時間タイプ
    theater: string; // 劇場名
    memo: string; // メモ
};

export interface Theater {
    id: string;
    name: string;
    address: string;
}

// LogFormで使用されるログデータ型（IDなし）
export type LogData = Omit<Log, 'id'>;
