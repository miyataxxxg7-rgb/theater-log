"use client";

import { useState, useMemo } from "react";
import { Seat as SeatComponent } from "./Seat";
import { generateSeatData } from "@/lib/seat-data";
import { FloorMap, Seat as SeatType } from "@/types/theater";
import { LogForm } from "@/forms/LogForm";
import { useLogs } from "@/hooks/useLogs";

interface SeatMapProps {
    onSeatSelect?: (seat: SeatType) => void;
}

export function SeatMap({ onSeatSelect }: SeatMapProps) {
    // In a real app, this data would come from an API or Props
    const [floorMap] = useState<FloorMap[]>(generateSeatData());
    const [selectedSeat, setSelectedSeat] = useState<SeatType | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const { logs, addLog, getLogBySeatId } = useLogs();

    // Merge seat data with logs to determine status
    const mergedFloorMap = useMemo(() => {
        return floorMap.map(floor => ({
            ...floor,
            rows: floor.rows.map(row => ({
                ...row,
                seats: row.seats.map(seat => {
                    if (!seat) return null;
                    // Check if it's a Seat (has id)
                    if ('id' in seat) {
                        const log = getLogBySeatId(seat.id);
                        return {
                            ...seat,
                            status: log ? "logged" : seat.status, // Override status if logged
                        } as SeatType;
                    }
                    // It's a Door or other object
                    return seat;
                })
            }))
        }));
    }, [floorMap, logs, getLogBySeatId]); // Re-calculate when logs change

    const handleSeatClick = (seat: SeatType) => {
        setSelectedSeat(seat);
        // Open form immediately to facilitate easy logging
        setIsFormOpen(true);

        if (onSeatSelect) {
            onSeatSelect(seat);
        }
    };

    // Seat Map Layout Constants
    const STAGE_Y_OFFSET = 300; // Distance from stage pivot to first row
    const ROW_DEPTH = 30; // Distance between rows
    const SEAT_ANGLE_STEP = 0.6; // Degrees per seat (Reduced for tighter packing)

    // Aisle Gaps (in Seat Steps approx)
    const AISLE_SEAT_GAP = 3.5;

    // Pivot point (Stage Center)
    // We will center the map horizontally in the container.
    // The Pivot is at (50%, -Radius + margin) effectively.
    // Actually simpler: Pivot at (50%, slightly above top).
    const BASE_RADIUS = 2500;

    // Viewport adjustment: Shift pivot up so seats (at BASE_RADIUS) start near top
    // Row 1 is at Radius 2500. We want Row 1 to be at Y=150 (approx).
    // So Pivot Y + 2500 = 150  =>  Pivot Y = 150 - 2500 = -2350.
    const PIVOT_Y = 150 - BASE_RADIUS;

    // Cross Aisle Gap (space between Row 19 and 20)
    const CROSS_AISLE_GAP = 60;

    return (
        <div className="w-full h-full overflow-auto bg-paper">
            {/* Scrollable Container Content - increased width for full visibility */}
            <div className="relative w-[2800px] h-[1600px] shrink-0 pt-20 mx-auto">
                {/* Stage Area */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 w-[800px] h-20 bg-pencil-light/10 flex items-center justify-center text-sm text-pencil-light tracking-widest border border-pencil/20 shadow-inner z-0"
                    style={{
                        // Stage is at Pivot + Radius - Offset.
                        // We map visual "top" relative to container.
                        // Pivot is at top: PIVOT_Y.
                        // Stage should be at PIVOT_Y + BASE_RADIUS - 120.
                        top: `${PIVOT_Y + BASE_RADIUS - 120}px`,
                        borderRadius: "50% 50% 10% 10%",
                    }}
                >
                    STAGE
                </div>

                {/* Seats Container - Pivot is centered horizontally, up top (negative) */}
                <div
                    className="absolute left-1/2 w-0 h-0"
                    style={{ top: `${PIVOT_Y}px` }}
                >
                    {mergedFloorMap.map((floor) => (
                        <div key={floor.floor}>
                            {floor.rows.map((row) => {
                                // Calculate Radius for this row
                                let rowRadius = BASE_RADIUS + (row.rowNumber) * ROW_DEPTH;

                                // Add Horizontal Aisle Gap (between 13 and 14)
                                if (row.rowNumber >= 14) {
                                    rowRadius += ROW_DEPTH; // Add one row height as requested
                                }

                                // Add Cross Aisle Gap after Row 19
                                if (row.rowNumber >= 20) {
                                    rowRadius += CROSS_AISLE_GAP;
                                }

                                // Seat Index adjustments for angles
                                // Center Seat Number is roughly 27.5
                                // We map seat numbers to angles.
                                // 1-54. 
                                // Gaps at 13-14 and 41-42.

                                const renderedSeats = row.seats.map((item, index) => {
                                    // GRID LOGIC (62 Columns):
                                    // Center is roughly 30.5
                                    const logicalIndex = index - 30.5;

                                    // Angle Calculation (Inverted: Left is Positive Angle)
                                    const angleDeg = -logicalIndex * SEAT_ANGLE_STEP;

                                    // 1. NULL (Spacer) -> Render invisible div to maintain "physicality" if logic depended on flow (though here absolute)
                                    // User requested: "visibility: hidden or opacity: 0"
                                    if (!item) {
                                        return (
                                            <div key={`null-${index}`}
                                                className="absolute w-4 h-4" // Placeholder size
                                                style={{
                                                    top: 0, left: 0,
                                                    transformOrigin: `0px -${rowRadius}px`,
                                                    transform: `translateY(${rowRadius}px) rotate(${angleDeg}deg)`,
                                                    visibility: 'hidden',
                                                    pointerEvents: 'none'
                                                }}
                                            />
                                        );
                                    }

                                    // 2. DOOR -> Wide Label
                                    if ('type' in item && item.type === 'door') {
                                        // Skip placeholder doors (empty label)
                                        if (!item.label) return null;

                                        // Calculate Width based on span.
                                        const width = item.span * 14;

                                        // Calculate Height based on rowSpan (default 1)
                                        const rowSpan = item.rowSpan || 1;
                                        const height = rowSpan * ROW_DEPTH;

                                        // Center adjustments
                                        const centerLogicalIndex = logicalIndex + (item.span - 1) / 2;
                                        const centerAngleDeg = -centerLogicalIndex * SEAT_ANGLE_STEP;

                                        return (
                                            <div key={`door-${index}`}
                                                className="absolute flex items-center justify-center text-black text-sm font-bold tracking-widest border-2 border-black bg-white shadow-sm z-20"
                                                style={{
                                                    top: 0, left: 0,
                                                    width: `${width}px`,
                                                    height: `${height}px`,
                                                    transformOrigin: `0px -${rowRadius}px`,
                                                    transform: `translateY(${rowRadius}px) rotate(${centerAngleDeg}deg)`,
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                        );
                                    }

                                    // 3. ROW LABEL
                                    if ('type' in item && item.type === 'rowLabel') {
                                        return (
                                            <div key={`label-${index}`}
                                                className="absolute flex items-center justify-center text-[10px] text-zinc-400 font-bold pointer-events-none"
                                                style={{
                                                    top: 0, left: 0,
                                                    width: '16px', height: '16px', // explicit size
                                                    transformOrigin: `0px -${rowRadius}px`,
                                                    transform: `translateY(${rowRadius}px) rotate(${angleDeg}deg)`,
                                                }}
                                            >
                                                {item.value}
                                            </div>
                                        );
                                    }

                                    // 4. SEAT
                                    const seat = item as SeatType;
                                    return (
                                        <div
                                            key={seat.id}
                                            className="absolute flex items-center justify-center text-[8px]"
                                            style={{
                                                top: 0,
                                                left: 0,
                                                transformOrigin: `0px -${rowRadius}px`,
                                                transform: `translateY(${rowRadius}px) rotate(${angleDeg}deg)`,
                                            }}
                                        >
                                            <SeatComponent
                                                seat={seat}
                                                isSelected={selectedSeat?.id === seat.id}
                                                onClick={handleSeatClick}
                                            />
                                        </div>
                                    );
                                });

                                return (
                                    <div key={row.rowNumber}>
                                        {renderedSeats}
                                    </div>
                                );
                            })}
                        </div>
                    ))}

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
                </div>
                {/* Background Click to Close? */}
                {
                    isFormOpen && (
                        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsFormOpen(false)} />
                    )
                }
            </div>
        </div>
    );
}

// Export as SeatMap1F for consistency with other floors
export { SeatMap as SeatMap1F };
