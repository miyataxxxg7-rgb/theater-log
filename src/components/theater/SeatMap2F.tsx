"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { generateSecondFloor } from "@/lib/seat-data-2f";
import { Seat as SeatType, SeatBlock } from "@/types/theater";
import { useLogs } from "@/hooks/useLogs";
import { LogForm } from "@/forms/LogForm";

// Fixed column width: 35px (32px seat + 3px gap)
const COLUMN_WIDTH = 35;
const AISLE_COLUMNS = 3; // Expanded to ~2.25 seats for all rows

// ========================================
// U-CURVE VISUAL EFFECT PARAMETERS
// Adjust these to fine-tune the curve appearance
// ========================================
const CURVE_INTENSITY = 0.00002;   // Y-axis curve depth (uses 4th power, so very small value)
const ROTATION_INTENSITY = 0.008;  // Rotation strength (uses squared distance for edge emphasis)
const CENTER_COLUMN = 50;          // Grid center point (approx seat 31-32 area)
const MAX_CURVE_OFFSET = 100;      // Maximum translateY in pixels

// Calculate absolute grid column for each seat
function calculateGridColumn(
    rowNumber: number,
    blockIndex: number,
    seatIndex: number,
    seatNum: number | null,
    block: SeatBlock
): number {
    // LB area (blockIndex 0)
    if (blockIndex === 0) {
        if (block.area === 'LB') {
            if (rowNumber === 1) {
                return 1 + seatIndex;
            } else if (rowNumber === 2) {
                return 3 + seatIndex;
            } else {
                return 1 + seatIndex;
            }
        }
    }

    const BLOCK1_START = 9;

    if (blockIndex === 2) {
        if (rowNumber === 1) {
            return BLOCK1_START + seatIndex;
        } else if (rowNumber === 2) {
            return BLOCK1_START + seatIndex;
        } else if (rowNumber === 3) {
            return BLOCK1_START + seatIndex;
        } else if (rowNumber === 4) {
            return BLOCK1_START + seatIndex;
        }
    }

    if (blockIndex === 0 && rowNumber >= 5) {
        return 17 + seatIndex;
    }

    const BLOCK2_START = 21;

    if (blockIndex === 4) {
        if (rowNumber === 1) {
            return BLOCK2_START + seatIndex;
        } else if (rowNumber === 2) {
            return BLOCK2_START - 1 + seatIndex;
        } else if (rowNumber === 3) {
            return BLOCK2_START - 2 + seatIndex;
        } else if (rowNumber === 4) {
            return BLOCK2_START - 3 + seatIndex;
        }
    }

    if (blockIndex === 2 && rowNumber >= 5) {
        return 32 + seatIndex;
    }

    const BLOCK3_START = 33;
    if (blockIndex === 6 && rowNumber <= 4) {
        return BLOCK3_START + seatIndex;
    }

    if (blockIndex === 4 && rowNumber >= 5) {
        return 45 + seatIndex;
    }

    const BLOCK4_START = 45;
    if (blockIndex === 8 && rowNumber <= 4) {
        return BLOCK4_START + seatIndex;
    }

    if (blockIndex === 6 && rowNumber >= 5) {
        return 60 + seatIndex;
    }

    const BLOCK5_START = 60;
    if (blockIndex === 10 && rowNumber <= 4) {
        return BLOCK5_START + seatIndex;
    }

    if (blockIndex === 8 && rowNumber >= 5) {
        return 74 + seatIndex;
    }

    const BLOCK6_START = 74;
    if (blockIndex === 12 && rowNumber <= 4) {
        return BLOCK6_START + seatIndex;
    }

    const BLOCK7_START = 87;
    if (blockIndex === 14 && rowNumber <= 4) {
        return BLOCK7_START + seatIndex;
    }

    const RB_START = 100;
    if (blockIndex === 16) {
        if (block.area === 'RB') {
            if (rowNumber === 1) {
                return RB_START + seatIndex;
            } else if (rowNumber === 2) {
                return RB_START + seatIndex;
            } else {
                return RB_START + seatIndex;
            }
        }
    }

    return BLOCK1_START + seatIndex;
}

export function SeatMap2F() {
    const floorData = useMemo(() => generateSecondFloor(), []);
    const [selectedSeat, setSelectedSeat] = useState<SeatType | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { logs, addLog, getLogBySeatId } = useLogs();

    // 🌟 スクロール用の透明な指
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // 🌟 開いた瞬間に、ど真ん中に自動でスクロールさせる魔法！
    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            // 2階席の横幅（約2500px）の真ん中へワープ！
            const targetScrollLeft = 1250 - (container.clientWidth / 2);

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

    const totalColumns = 100;
    const gridTemplateColumns = `repeat(${totalColumns}, ${COLUMN_WIDTH}px)`;

    const calculateCurveTransform = (gridColumn: number): string => {
        const distanceFromCenter = gridColumn - CENTER_COLUMN;
        const absDistance = Math.abs(distanceFromCenter);

        const yOffset = Math.min(
            Math.pow(absDistance, 4) * CURVE_INTENSITY,
            MAX_CURVE_OFFSET
        );

        const rotationStrength = absDistance * absDistance * ROTATION_INTENSITY;
        const rotation = distanceFromCenter < 0 ? rotationStrength : -rotationStrength;

        return `translateY(-${yOffset}px) rotate(${rotation}deg)`;
    };

    return (
        // 🌟 ここを変更しました！高さを「h-[70vh]」にし、角を丸くして枠をつけました！
        <div ref={scrollContainerRef} className="w-full h-[70vh] overflow-auto bg-paper border border-pencil/10 rounded-xl shadow-inner relative" style={{ textAlign: 'left' }}>
            <div className="inline-block min-w-[2500px] p-12 px-16">
                {/* Stage Indicator */}
                <div className="text-center mb-12">
                    <div className="inline-block px-12 py-3 bg-pencil-light/10 border border-pencil/20 rounded text-sm text-pencil-light tracking-widest">
                        STAGE
                    </div>
                </div>

                {/* Seat Rows - CSS Grid Layout */}
                <div>
                    {/* Front Rows (1-4) */}
                    {(floorData.rows as any[])
                        .filter((row) => row.rowNumber <= 4)
                        .map((row) => {
                            const marginTop = row.rowNumber === 1 ? '0' : '4px';

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
                                                                width: '32px',
                                                                height: '32px',
                                                                visibility: 'hidden'
                                                            }}
                                                        />
                                                    );
                                                }

                                                const seatId = `2F-${row.rowNumber}-${block.area || ''}${seatNum}`;
                                                const log = getLogBySeatId(seatId);
                                                const isLogged = !!log;

                                                return (
                                                    <button
                                                        key={seatId}
                                                        onClick={() => handleSeatClick({
                                                            id: seatId,
                                                            floor: 2,
                                                            row: row.rowNumber,
                                                            number: seatNum,
                                                            section: "center",
                                                            status: isLogged ? "logged" : "vacant"
                                                        })}
                                                        style={{
                                                            gridColumn: gridColumn,
                                                            width: '32px',
                                                            height: '32px',
                                                            transform: calculateCurveTransform(gridColumn)
                                                        }}
                                                        className={`
                                                            font-bold text-[8px] rounded border transition-all
                                                            ${isLogged
                                                                ? 'bg-primary/20 text-primary border-primary border-2'
                                                                : block.area
                                                                    ? 'bg-blue-50 border-blue-300'
                                                                    : 'bg-white border-pencil/30 hover:border-oshi hover:bg-oshi-dim/10'
                                                            }
                                                        `}
                                                    >
                                                        {block.area ? `${block.area}${seatNum}` : seatNum}
                                                    </button>
                                                );
                                            });
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                    {/* Rows 5-7: Individual rows with explicit marginTop */}
                    {(floorData.rows as any[])
                        .filter((row) => row.rowNumber >= 5)
                        .map((row) => {
                            const marginTop = row.rowNumber === 5 ? '40px' : '8px';
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
                                                                width: '32px',
                                                                height: '32px',
                                                                visibility: 'hidden'
                                                            }}
                                                        />
                                                    );
                                                }

                                                const seatId = `2F-${row.rowNumber}-${block.area || ''}${seatNum}`;
                                                const log = getLogBySeatId(seatId);
                                                const isLogged = !!log;

                                                return (
                                                    <button
                                                        key={seatId}
                                                        onClick={() => handleSeatClick({
                                                            id: seatId,
                                                            floor: 2,
                                                            row: row.rowNumber,
                                                            number: seatNum,
                                                            section: "center",
                                                            status: isLogged ? "logged" : "vacant"
                                                        })}
                                                        style={{
                                                            gridColumn: gridColumn,
                                                            width: '32px',
                                                            height: '32px',
                                                            transform: calculateCurveTransform(gridColumn)
                                                        }}
                                                        className={`
                                                            font-bold text-[8px] rounded border transition-all
                                                            ${isLogged
                                                                ? 'bg-primary/20 text-primary border-primary border-2'
                                                                : block.area
                                                                    ? 'bg-blue-50 border-blue-300'
                                                                    : 'bg-white border-pencil/30 hover:border-oshi hover:bg-oshi-dim/10'
                                                            }
                                                        `}
                                                    >
                                                        {block.area ? `${block.area}${seatNum}` : seatNum}
                                                    </button>
                                                );
                                            });
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {/* Legend - minimal margin */}
                <div className="mt-4 flex justify-center gap-4 text-xs text-pencil-light">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-50 border border-blue-300 rounded" />
                        <span>バルコニー席 (LB/RB)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white border-pencil/30 rounded" />
                        <span>通常席</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-oshi border border-oshi rounded" />
                        <span>観劇済み</span>
                    </div>
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
