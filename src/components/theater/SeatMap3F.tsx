"use client";

import { useState, useMemo } from "react";
import { generateThirdFloor } from "@/lib/seat-data-3f";
import { Seat as SeatType, SeatBlock } from "@/types/theater";
import { useLogs } from "@/hooks/useLogs";
import { LogForm } from "@/forms/LogForm";

// Fixed column width: 35px (32px seat + 3px gap)
const COLUMN_WIDTH = 35;
const SEAT_SIZE = 32; // Seat button size

// Grid column positions for 3F (centered layout)
// Total ~110 columns to accommodate all seats + aisles
// Center block (26-37) should be at columns 49-60 (center of grid)

function calculateGridColumn(
    rowNumber: number,
    blockIndex: number,
    seatIndex: number,
    seatNum: number | null,
    block: SeatBlock
): number {
    // ========================================
    // Rows 3-7: No LB/RB, different blockIndex structure
    // Row 3: 7 blocks (Indices 0, 2, 4, 6, 8, 10, 12)
    // Row 4-7: 5 blocks (Indices 0, 2, 4, 6, 8)
    // Row 4-6: Block 1 aligned at Col 15, with 2-column wide vertical aisle after Block 1
    // Row 7: Left 2 blocks extended by 1 seat, others aligned with Row 6
    // ========================================
    if (rowNumber >= 3) {

        // Block 1 (Leftmost)
        // Row 3 (Index 0): 3-7 (5 seats) -> Col 10
        // Row 4 (Index 0): 4-15 (12 seats) -> Col 15
        // Row 5 (Index 0): 4-15 (12 seats) -> Col 15
        // Row 6 (Index 0): 3-14 (12 seats) -> Col 15 (3 at Col 15, 4 at Col 16)
        // Row 7 (Index 0): 2-13 (12 seats) -> Col 15 (2 at Col 15, aligned with Row 6's 3 at Col 15)
        if (blockIndex === 0 && !block.area) {
            if (rowNumber === 3) return 10 + seatIndex;
            if (rowNumber === 4) return 15 + seatIndex;
            if (rowNumber === 5) return 15 + seatIndex;
            if (rowNumber === 6) return 15 + seatIndex;
            if (rowNumber === 7) return 15 + seatIndex; // Aligned with Row 6's start
        }

        // Block 2 (after 2-column wide vertical aisle)
        // Row 3 (Index 2): 8-17 (10 seats) -> Col 17
        // Row 4 (Index 2): 16-25 (10 seats) -> Col 30
        // Row 5 (Index 2): 16-25 (10 seats) -> Col 30
        // Row 6 (Index 2): 15-25 (11 seats) -> Col 29 (so seat 16 at index 1 lands at Col 30)
        // Row 7 (Index 2): 14-25 (12 seats) -> Col 28 (so seat 15 at index 1 aligns with Row 6's 15 at Col 29)
        if (blockIndex === 2) {
            if (rowNumber === 3) return 17 + seatIndex;
            if (rowNumber === 4) return 30 + seatIndex;
            if (rowNumber === 5) return 30 + seatIndex;
            if (rowNumber === 6) return 29 + seatIndex;
            if (rowNumber === 7) return 28 + seatIndex; // Row 7's 15 (index 1) at Col 29, aligned with Row 6's 15
        }

        // Block 3 (Left of Center for Row 3, Center for Rows 4-7)
        // Row 3 (Index 4): 18-25 -> Col 31
        // Row 4 (Index 4): 26-37 (Center) -> Col 44
        // Row 5 (Index 4): 26-37 (Center) -> Col 44
        // Row 6 (Index 4): 26-37 (Center) -> Col 44
        // Row 7 (Index 4): 26-37 (Center) -> Col 44 (aligned with Row 6)
        if (blockIndex === 4) {
            if (rowNumber === 3) return 31 + seatIndex;
            if (rowNumber === 4) return 44 + seatIndex;
            if (rowNumber === 5) return 44 + seatIndex;
            if (rowNumber === 6) return 44 + seatIndex;
            if (rowNumber === 7) return 44 + seatIndex; // Same as Row 6
        }

        // BlockIndex 6
        // Row 3: Center (26-37) -> Col 44
        // Row 4: Block 4 (38-42) -> Col 58
        // Row 5: Block 4 (38-43) -> Col 58
        // Row 6: Block 4 (38-43) -> Col 58
        // Row 7: Block 4 (38-49) -> Col 58 (aligned with Row 6)
        if (blockIndex === 6) {
            if (rowNumber === 3) return 44 + seatIndex;
            if (rowNumber === 4) return 58 + seatIndex;
            if (rowNumber === 5) return 58 + seatIndex;
            if (rowNumber === 6) return 58 + seatIndex;
            if (rowNumber === 7) return 58 + seatIndex; // Same as Row 6
        }

        // BlockIndex 8
        // Row 3: Block 5 (38-45) -> Col 59 (+1 to align with Row 4-7's 39)
        // Row 4: Block 5 (50-61) -> Col 72 (aligned with Row 7)
        // Row 5: Block 5 (50-61) -> Col 72 (aligned with Row 7)
        // Row 6: Block 5 (50-61) -> Col 72 (aligned with Row 7)
        // Row 7: Block 5 (50-61) -> Col 72 (aligned with Row 6)
        if (blockIndex === 8) {
            if (rowNumber === 3) return 59 + seatIndex;
            if (rowNumber === 4) return 72 + seatIndex;
            if (rowNumber === 5) return 72 + seatIndex;
            if (rowNumber === 6) return 72 + seatIndex;
            if (rowNumber === 7) return 72 + seatIndex; // Same as Row 6
        }

        // BlockIndex 10 (Row 3 only)
        // Row 3: Block 6 (46-55) -> Col 72 (aligned with Row 4-7)
        if (blockIndex === 10) {
            if (rowNumber === 3) return 72 + seatIndex;
        }

        // BlockIndex 12 (Row 3 only)
        // Row 3: Block 7 (56-61) -> Col 86 (46 at Col 72, +10 seats for Block 6, +4 gap)
        if (blockIndex === 12) {
            if (rowNumber === 3) return 86 + seatIndex;
        }

        return 1;
    }

    // ========================================
    // Rows 1-2: With LB/RB, 9 blocks
    // blockIndex: 0=LB, 2=Block1, 4=Block2, 6=Block3, 8=Center, 10=Block5, 12=Block6, 14=Block7, 16=RB
    // ========================================

    // LB area (blockIndex 0)
    // Row 1: LB3-LB6 starts at column 1
    // Row 2: LB7-LB9 starts at column 2 (so LB7 aligns with row 1 LB4)
    if (blockIndex === 0 && block.area === 'LB') {
        if (rowNumber === 2) {
            // Shift right by 1 so LB7 (index 0) lands at column 2 (same as LB4)
            return 2 + seatIndex;
        }
        return 1 + seatIndex;
    }

    // Block 1 (after LB + aisle)
    const BLOCK1_START = 8;
    if (blockIndex === 2) {
        return BLOCK1_START + seatIndex;
    }

    // Block 2
    // Row 1: 11-18 starts at column 19
    // Row 2: 9-17 starts at column 18 (so seat 10 aligns with row 1 seat 11)
    const BLOCK2_START = 19;
    if (blockIndex === 4) {
        if (rowNumber === 2) {
            // Shift left by 1 so seat 10 (index 1) lands at column 19
            return (BLOCK2_START - 1) + seatIndex;
        }
        return BLOCK2_START + seatIndex;
    }

    // Block 3 (left of center)
    // Row 1: 19-25 starts at column 32 (aligned with Row 4 seat 18)
    // Row 2: 18-25 starts at column 31 (aligned with Row 4 seat 17)
    const BLOCK3_START_ROW1 = 32; // Row 4 Block 2 (16番) at Col 30, +2 = 32
    const BLOCK3_START_ROW2 = 31; // Row 4 Block 2 (16番) at Col 30, +1 = 31
    if (blockIndex === 6) {
        if (rowNumber === 1) {
            return BLOCK3_START_ROW1 + seatIndex; // Row 1: 19 at Row 4's 18 position
        }
        if (rowNumber === 2) {
            return BLOCK3_START_ROW2 + seatIndex; // Row 2: 18 at Row 4's 17 position
        }
    }

    // Center Block (26-37) - aligned with Row 4-6 at Col 44
    const CENTER_START = 44;
    if (blockIndex === 8) {
        return CENTER_START + seatIndex;
    }

    // Block 5 (right side after center)
    // Row 1: 38-44 starts at column 59 (+1 to align with Row 4-7's 39)
    // Row 2: 38-45 starts at column 59 (+1)
    const BLOCK5_START = 59;
    if (blockIndex === 10) {
        return BLOCK5_START + seatIndex;
    }

    // Block 6
    // Row 1: 45-52 (Block 6) starts at column 72 (aligned with Row 7 - 50)
    // Row 2: 46-54 (Block 6) starts at column 72 (aligned with Row 7 - 50)
    const BLOCK6_START = 72;
    if (blockIndex === 12) {
        return BLOCK6_START + seatIndex;
    }

    // Block 7
    // Row 1: 53-60 (Block 7) starts at column 84 (45 at Col 72, +8 seats for Block 6, +4 gap)
    // Row 2: 55-62 (Block 7) starts at column 85 (46 at Col 72, +9 seats for Block 6, +4 gap)
    const BLOCK7_START_ROW1 = 84;
    const BLOCK7_START_ROW2 = 85;
    if (blockIndex === 14) {
        if (rowNumber === 1) return BLOCK7_START_ROW1 + seatIndex;
        if (rowNumber === 2) return BLOCK7_START_ROW2 + seatIndex;
    }

    // RB area (blockIndex 16)
    // Row 1: RB3-RB6 starts at column 96 (53 at Col 84, +8 seats for Block 7, +3 gap, +1 aisle)
    // Row 2: RB7-RB9 starts at column 96 (55 at Col 85, +8 seats for Block 7, +3 gap)
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

    const handleSeatClick = (seat: SeatType) => {
        setSelectedSeat(seat);
        setIsFormOpen(true);
    };

    const totalColumns = 110;
    const gridTemplateColumns = `repeat(${totalColumns}, ${COLUMN_WIDTH}px)`;

    return (
        <div className="w-full overflow-x-auto bg-paper" style={{ textAlign: 'left' }}>
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
                        // Row 1: no margin, Row 4: wide aisle (40px), others: standard (8px)
                        const marginTop = row.rowNumber === 1 ? '0' : row.rowNumber === 4 ? '40px' : '8px';

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

                                            // Determine display label: LB/RB seats show area prefix
                                            const displayLabel = block.area ? `${block.area}${seatNum}` : seatNum;

                                            // Balcony seat styling
                                            const isBalcony = !!block.area;

                                            // Curved arch effect calculation
                                            const centerColumn = 50; // Center of 3F layout
                                            const dist = gridColumn - centerColumn;
                                            const translateY = -Math.abs(dist) * Math.abs(dist) * 0.04; // Upward curve (U-shape)
                                            const rotate = -dist * 0.6; // Fan-shaped rotation (inward-facing)

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
