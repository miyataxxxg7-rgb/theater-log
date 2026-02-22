"use client";

import { useState, useMemo } from "react";
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
// Key alignment rules:
// - Row 3 seats 3-7: LOCKED (do not change)
// - Row 1 seat 11 = Row 2 seat 10 (vertical alignment)
// - Row 2 seat 9 = Row 3 seat 9 (vertical alignment)
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
                // Row 1 LB: 1-6 at columns 1-6
                return 1 + seatIndex;
            } else if (rowNumber === 2) {
                // Row 2 LB: 7-10 aligned with row 1 LB 3-6 (offset +2)
                return 3 + seatIndex;
            } else {
                // Row 3: empty LB spacers
                return 1 + seatIndex;
            }
        }
    }

    // After LB (6 cols) + Aisle (2 cols) = start at col 9
    const BLOCK1_START = 9;

    // Block 1 (blockIndex 2): Main seats after LB
    if (blockIndex === 2) {
        if (rowNumber === 1) {
            // Row 1: seats 2-10 (seat 2 at col 9)
            return BLOCK1_START + seatIndex;
        } else if (rowNumber === 2) {
            // Row 2: seats 1-8 (seat 1 at col 9)
            return BLOCK1_START + seatIndex;
        } else if (rowNumber === 3) {
            // Row 3: [null, null, 3, 4, 5, 6, 7, null] - LOCKED
            // seat 3 at index 2 should be at col 11 (same as row 2 seat 3)
            return BLOCK1_START + seatIndex;
        } else if (rowNumber === 4) {
            // Row 4: [null, null, null, 3, 4, 5] 
            // seat 3 at index 3 should be at col 12 (same as row 3 seat 4)
            return BLOCK1_START + seatIndex;
        }
    }

    // For rows 5+, LB/RB areas are removed, so blockIndex starts at 0
    // Block 1 (blockIndex 0 for rows 5+)
    if (blockIndex === 0 && rowNumber >= 5) {
        // Row 5+: Left anchor at column 17
        // R5-4 = R6-3 = R7-2 = column 17
        // All start at index 0 = column 17
        return 17 + seatIndex;
    }

    // Block 2 (blockIndex 4): Key alignment - R1-11 = R2-10
    // Row 1 Block 2: starts at col 21 (after Block1 9cols + aisle 3cols)
    // Row 1 seat 11 at col 21
    // Row 2 seat 10 should be at col 21 (aligned with R1-11)
    // Row 2 seat 9 at col 20
    // Row 3 seat 9 at col 20 (aligned with R2-9)
    // Row 3 seat 8 at col 19
    const BLOCK2_START = 21; // After Block1 + 3-col aisle

    if (blockIndex === 4) {
        if (rowNumber === 1) {
            // Row 1: seats 11-18, seat 11 at col 21
            return BLOCK2_START + seatIndex;
        } else if (rowNumber === 2) {
            // Row 2: seats 9-17
            // seat 10 (index 1) must be at col 20 (aligned with R1-11)
            // so seat 9 (index 0) at col 19
            return BLOCK2_START - 1 + seatIndex;
        } else if (rowNumber === 3) {
            // Row 3: seats 8-17
            // seat 9 (index 1) must be at col 19 (aligned with R2-9)
            // so seat 8 (index 0) at col 18
            return BLOCK2_START - 2 + seatIndex;
        } else if (rowNumber === 4) {
            // Row 4: seats 6-16
            // seat 6 (index 0) should align with row 3 pattern
            // Each row shifts 1 more col left
            return BLOCK2_START - 3 + seatIndex;
        }
    }

    // Block 2 for rows 5+ (blockIndex 2, since LB/RB removed)
    if (blockIndex === 2 && rowNumber >= 5) {
        // Block 1 ends at 17+11=28, +3 aisle = 32
        return 32 + seatIndex;
    }

    // Block 3 (blockIndex 6)
    // For rows 1-4: seats 19-25 or similar (non-center)
    // For row 5+: this IS the center block (26-37)
    const BLOCK3_START = 33; // After Block2 (9 cols) + 3-col aisle
    if (blockIndex === 6 && rowNumber <= 4) {
        // Rows 1-4 only
        return BLOCK3_START + seatIndex;
    }

    // Block 3 for rows 5+ (blockIndex 4, since LB/RB removed)
    // CENTER ANCHOR: Seat 26 starts at column 45 (widened aisle from 25)
    if (blockIndex === 4 && rowNumber >= 5) {
        return 45 + seatIndex;
    }

    // Block 4 - Center (blockIndex 8)
    // For rows 1-4: this is the center block (26-37)
    // WIDENED AISLE: Seat 26 starts at column 45 (1 col gap from 25)
    const BLOCK4_START = 45;
    if (blockIndex === 8 && rowNumber <= 4) {
        return BLOCK4_START + seatIndex;
    }

    // Block 4 for rows 5+ (blockIndex 6, since LB/RB removed)
    // Block 3 ends at 45+11=56, +3 aisle = 60
    if (blockIndex === 6 && rowNumber >= 5) {
        return 60 + seatIndex;
    }

    // Block 5 (blockIndex 10)
    // For rows 1-4: seats after center (shifted +1)
    const BLOCK5_START = 60;
    if (blockIndex === 10 && rowNumber <= 4) {
        return BLOCK5_START + seatIndex;
    }

    // Block 5 for rows 5+ (blockIndex 8, since LB/RB removed)
    // Shifted +1 from 73 to 74 for widened 25-26 aisle
    if (blockIndex === 8 && rowNumber >= 5) {
        return 74 + seatIndex;
    }

    // Block 6 (blockIndex 12)
    // Shifted +1 from 73 to 74 for widened 25-26 aisle
    const BLOCK6_START = 74;
    if (blockIndex === 12 && rowNumber <= 4) {
        return BLOCK6_START + seatIndex;
    }

    // Block 7 (blockIndex 14)
    const BLOCK7_START = 87; // Shifted +1 for widened 25-26 aisle
    if (blockIndex === 14 && rowNumber <= 4) {
        return BLOCK7_START + seatIndex;
    }

    // RB area (blockIndex 16)
    const RB_START = 100; // Shifted +1 for widened 25-26 aisle
    if (blockIndex === 16) {
        if (block.area === 'RB') {
            if (rowNumber === 1) {
                return RB_START + seatIndex;
            } else if (rowNumber === 2) {
                // RB7 aligned with RB1 (offset +6 positions for seats 7-10)
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

    const handleSeatClick = (seat: SeatType) => {
        setSelectedSeat(seat);
        setIsFormOpen(true);
    };

    // Total columns: ~100 (enough for all seats + aisles)
    const totalColumns = 100;
    const gridTemplateColumns = `repeat(${totalColumns}, ${COLUMN_WIDTH}px)`;

    // Calculate U-curve transform for each seat based on its grid column
    const calculateCurveTransform = (gridColumn: number): string => {
        // Distance from center (negative = left, positive = right)
        const distanceFromCenter = gridColumn - CENTER_COLUMN;
        const absDistance = Math.abs(distanceFromCenter);

        // Y offset: QUARTIC curve (x^4) for sharp edges, gentle center
        // 4th power creates dramatic rise at the edges
        const yOffset = Math.min(
            Math.pow(absDistance, 4) * CURVE_INTENSITY,
            MAX_CURVE_OFFSET
        );

        // Rotation: uses squared distance for stronger rotation at edges
        // Left side (negative distance) rotates clockwise (positive angle)
        // Right side (positive distance) rotates counter-clockwise (negative angle)
        const rotationStrength = absDistance * absDistance * ROTATION_INTENSITY;
        const rotation = distanceFromCenter < 0 ? rotationStrength : -rotationStrength;

        return `translateY(-${yOffset}px) rotate(${rotation}deg)`;
    };

    return (
        <div className="w-full overflow-x-auto bg-paper" style={{ textAlign: 'left' }}>
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
                                    <div className="text-xs text-pencil-light font-bold w-8 text-right mr-4">
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
                            // Row 5: 40px aisle, Row 6+: 8px standard gap
                            const marginTop = row.rowNumber === 5 ? '40px' : '8px';
                            return (
                                <div
                                    key={row.rowNumber}
                                    className="flex items-center"
                                    style={{ marginTop }}
                                >
                                    {/* Row Number Label */}
                                    <div className="text-xs text-pencil-light font-bold w-8 text-right mr-4">
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

                                                // Spacer for null values - NEVER render as button
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
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
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
                {/* Background Click to Close */}
                {
                    isFormOpen && (
                        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsFormOpen(false)} />
                    )
                }
            </div>
        </div>
    );
}
