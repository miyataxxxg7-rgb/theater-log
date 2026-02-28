"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { generateThirdFloor } from "@/lib/seat-data-3f";
import { Seat as SeatType, SeatBlock } from "@/types/theater";
import { useLogs } from "@/hooks/useLogs";
import { LogForm } from "@/forms/LogForm";

// Fixed column width: 35px (32px seat + 3px gap)
const COLUMN_WIDTH = 35;
const SEAT_SIZE = 32; // Seat button size

function calculateGridColumn(
    rowNumber: number,
    blockIndex: number,
    seatIndex: number,
    seatNum: number | null,
    block: SeatBlock
): number {
    if (rowNumber >= 3) {
        if (blockIndex === 0 && !block.area) {
            if (rowNumber === 3) return 10 + seatIndex;
            if (rowNumber === 4) return 15 + seatIndex;
            if (rowNumber === 5) return 15 + seatIndex;
            if (rowNumber === 6) return 15 + seatIndex;
            if (rowNumber === 7) return 15 + seatIndex;
        }

        if (blockIndex === 2) {
            if (rowNumber === 3) return 17 + seatIndex;
            if (rowNumber === 4) return 30 + seatIndex;
            if (rowNumber === 5) return 30 + seatIndex;
            if (rowNumber === 6) return 29 + seatIndex;
            if (rowNumber === 7) return 28 + seatIndex;
        }

        if (blockIndex === 4) {
            if (rowNumber === 3) return 31 + seatIndex;
            if (rowNumber === 4) return 44 + seatIndex;
            if (rowNumber === 5) return 44 + seatIndex;
            if (rowNumber === 6) return 44 + seatIndex;
            if (rowNumber === 7) return 44 + seatIndex;
        }

        if (blockIndex === 6) {
            if (rowNumber === 3) return 44 + seatIndex;
            if (rowNumber === 4) return 58 + seatIndex;
            if (rowNumber === 5) return 58 + seatIndex;
            if (rowNumber === 6) return 58 + seatIndex;
            if (rowNumber === 7) return 58 + seatIndex;
        }

        if (blockIndex === 8) {
            if (rowNumber === 3) return 59 + seatIndex;
            if (rowNumber === 4) return 72 + seatIndex;
            if (rowNumber === 5) return 72 + seatIndex;
            if (rowNumber === 6) return 72 + seatIndex;
            if (rowNumber === 7) return 72 + seatIndex;
        }

        if (blockIndex === 10) {
            if (rowNumber === 3) return 72 + seatIndex;
        }

        if (blockIndex === 12) {
            if (rowNumber === 3) return 86 + seatIndex;
        }

        return 1;
    }

    if (blockIndex === 0 && block.area === 'LB') {
        if (rowNumber === 2) {
            return 2 + seatIndex;
        }
        return 1 + seatIndex;
    }

    const BLOCK1_START = 8;
    if (blockIndex === 2) {
        return BLOCK1_START + seatIndex;
    }

    const BLOCK2_START = 19;
    if (blockIndex === 4) {
        if (rowNumber === 2) {
            return (BLOCK2_START - 1) + seatIndex;
        }
        return BLOCK2_START + seatIndex;
    }

    const BLOCK3_START_ROW1 = 32;
    const BLOCK3_START_ROW2 = 31;
    if (blockIndex === 6) {
        if (rowNumber === 1) {
            return BLOCK3_START_ROW1 + seatIndex;
        }
        if (rowNumber === 2) {
            return BLOCK3_START_ROW2 + seatIndex;
        }
    }

    const CENTER_START = 44;
    if (blockIndex === 8) {
        return CENTER_START + seatIndex;
    }

    const BLOCK5_START = 59;
    if (blockIndex === 10) {
        return BLOCK5_START + seatIndex;
    }

    const BLOCK6_START = 72;
    if (blockIndex === 12) {
        return BLOCK6_START + seatIndex;
    }

    const BLOCK7_START_ROW1 = 84;
    const BLOCK7_START_ROW2 = 85;
    if (blockIndex === 14) {
        if (rowNumber === 1) return BLOCK7_START_ROW1 + seatIndex;
        if (rowNumber === 2) return BLOCK7_START_ROW2 + seatIndex;
    }

    if (blockIndex === 16 && block.area === 'RB') {
        return 96 + seatIndex;
    }

    return 1;
}

export function SeatMap3F() {
    const floorData = useMemo(() => generateThirdFloor(), []);
    const [selectedSeat, setSelectedSeat] = useState<SeatType | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { logs, addLog, getLogBySeatId } = useLogs();

    // 🌟 スクロール用の透明な指
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // 🌟 開いた瞬間に、ど真ん中に自動でスクロールさせる魔法！
    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            // 3階席の横幅（約3000px）の真ん中へワープ！
            const targetScrollLeft = 1500 - (container.clientWidth / 2);

            container.scrollTo({
                left: targetScrollLeft,
                top: 0,
                behavior: 'instant'
            });
        }
    }, []);

    const handleSeatClick = (seat: SeatType) => {
        setSelectedSeat(seat);
        setIsFormOpen(true);
    };

    const totalColumns = 110;
    const gridTemplateColumns = `repeat(${totalColumns}, ${COLUMN_WIDTH}px)`;

    return (
        // 🌟 ここを変更しました！高さを「h-[70vh]」にし、角を丸くして枠をつけました！
        <div ref={scrollContainerRef} className="w-full h-[70vh] overflow-auto bg-paper border border-pencil/10 rounded-xl shadow-inner relative" style={{ textAlign: 'left' }}>
            <div className="inline-block min-w-[3000px] p-12 px-16">
                {/* Stage Indicator */}
                <div className="text-center mb-12">
                    <div className="inline-block px-12 py-3 bg-pencil-light/10 border border-pencil/20 rounded text-sm text-pencil-light tracking-widest">
                        STAGE
                    </div>
                </div>

                {/* Seat Rows - CSS Grid Layout */}
                <div>
                    {(floorData.rows as any[]).map((row) => {
                        const marginTop = row.rowNumber === 1 ? '0' : row.rowNumber === 4 ? '40px' : '8px';

                        return (
                            <div
                                key={row.rowNumber}
                                className="flex items-center"
                                style={{ marginTop }}
                            >
                                {/* Row Number Label */}
                                <div className="text-xs text-pencil-light font-bold w-8 text-right mr-4 shrink-0">
                                    {row.rowNumber}
                                </div>

                                {/* Grid Container for Seats */}
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: gridTemplateColumns,
                                        gap: '0px',
                                        alignItems: 'center'
                                    }}
                                >
                                    {row.blocks.map((block: SeatBlock | null, blockIndex: number) => {
                                        if (!block) {
                                            return null;
                                        }

                                        return block.seats.map((seatNum: number | null, seatIndex: number) => {
                                            const gridColumn = calculateGridColumn(
                                                row.rowNumber,
                                                blockIndex,
                                                seatIndex,
                                                seatNum,
                                                block
                                            );

                                            if (seatNum === null) {
                                                return (
                                                    <div
                                                        key={`spacer-${blockIndex}-${seatIndex}`}
                                                        style={{
                                                            gridColumn: gridColumn,
                                                            width: `${COLUMN_WIDTH}px`,
                                                            height: `${SEAT_SIZE}px`
                                                        }}
                                                    />
                                                );
                                            }

                                            const seatId = `3F-${row.rowNumber}-${block.area || ''}${seatNum}`;
                                            const log = getLogBySeatId(seatId);
                                            const isLogged = !!log;

                                            const seat: SeatType = {
                                                id: seatId,
                                                floor: 3,
                                                row: row.rowNumber,
                                                number: seatNum,
                                                section: "center",
                                                status: isLogged ? "logged" : "vacant"
                                            };

                                            const isSelected = selectedSeat &&
                                                selectedSeat.floor === seat.floor &&
                                                selectedSeat.row === seat.row &&
                                                selectedSeat.number === seat.number;

                                            const displayLabel = block.area ? `${block.area}${seatNum}` : seatNum;
                                            const isBalcony = !!block.area;

                                            const centerColumn = 50;
                                            const dist = gridColumn - centerColumn;
                                            const translateY = -Math.abs(dist) * Math.abs(dist) * 0.04;
                                            const rotate = -dist * 0.6;

                                            return (
                                                <button
                                                    key={`${row.rowNumber}-${seatNum}`}
                                                    onClick={() => handleSeatClick(seat)}
                                                    className={`
                                                        transition-all duration-200
                                                        ${isBalcony ? 'rounded-sm' : 'rounded'}
                                                        ${isLogged
                                                            ? 'bg-primary/20 text-primary border-2 border-primary'
                                                            : isSelected
                                                                ? 'bg-highlight text-white border-2 border-highlight'
                                                                : isBalcony
                                                                    ? 'bg-blue-100 border-2 border-blue-400 text-blue-700 hover:bg-blue-200'
                                                                    : 'bg-paper border border-pencil/30 text-pencil hover:bg-pencil-light/10 hover:border-pencil'
                                                        }
                                                    `}
                                                    style={{
                                                        gridColumn: gridColumn,
                                                        width: `${SEAT_SIZE}px`,
                                                        height: `${SEAT_SIZE}px`,
                                                        fontSize: '9px',
                                                        padding: '2px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 'bold',
                                                        transform: `translateY(${translateY}px) rotate(${rotate}deg)`
                                                    }}
                                                    title={`3F-${row.rowNumber}列-${displayLabel}${block.area ? ' (バルコニー席)' : ''}`}
                                                >
                                                    {displayLabel}
                                                </button>
                                            );
                                        });
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Log Form Modal */}
                {
                    isFormOpen && selectedSeat && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
                            <div className="bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                                <LogForm
                                    seatId={selectedSeat.id}
                                    onSave={(logData) => {
                                        addLog(logData);
                                        setIsFormOpen(false);
                                        setSelectedSeat(null);
                                    }}
                                    onCancel={() => {
                                        setIsFormOpen(false);
                                    }}
                                />
                            </div>
                        </div>
                    )
                }
            </div>
            {/* Background Click to Close */}
            {
                isFormOpen && (
                    <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsFormOpen(false)} />
                )
            }
        </div>
    );
}
