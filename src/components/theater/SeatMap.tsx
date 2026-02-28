"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Seat as SeatComponent } from "./Seat";
import { generateSeatData } from "@/lib/seat-data";
import { FloorMap, Seat as SeatType } from "@/types/theater";
import { LogForm } from "@/forms/LogForm";
import { useLogs } from "@/hooks/useLogs";

interface SeatMapProps {
    onSeatSelect?: (seat: SeatType) => void;
}

export function SeatMap({ onSeatSelect }: SeatMapProps) {
    const [floorMap] = useState<FloorMap[]>(generateSeatData());
    const [selectedSeat, setSelectedSeat] = useState<SeatType | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const { logs, addLog, getLogBySeatId } = useLogs();

    // 🌟 魔法のスクロールの準備（スクロールする場所を記憶する透明な指）
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // 🌟 開いた瞬間に、ど真ん中に自動でスクロールさせる魔法！
    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            // 横幅2800pxの真ん中（1400px）から、画面の半分の長さを引いて、ちょうどど真ん中が映るように計算！
            const targetScrollLeft = 1400 - (container.clientWidth / 2);
            // 少しだけ下（ステージ寄り）にスクロール
            const targetScrollTop = 50;

            // ワープ実行！
            container.scrollTo({
                left: targetScrollLeft,
                top: targetScrollTop,
                behavior: 'instant' // 開いた瞬間なので、アニメーションなしで一瞬でワープ
            });
        }
    }, []); // 空の配列 [] なので、この画面が開かれた「最初の一回」だけ発動します

    const mergedFloorMap = useMemo(() => {
        return floorMap.map(floor => ({
            ...floor,
            rows: floor.rows.map(row => ({
                ...row,
                seats: row.seats.map(seat => {
                    if (!seat) return null;
                    if ('id' in seat) {
                        const log = getLogBySeatId(seat.id);
                        return {
                            ...seat,
                            status: log ? "logged" : seat.status,
                        } as SeatType;
                    }
                    return seat;
                })
            }))
        }));
    }, [floorMap, logs, getLogBySeatId]);

    const handleSeatClick = (seat: SeatType) => {
        setSelectedSeat(seat);
        setIsFormOpen(true);
        if (onSeatSelect) {
            onSeatSelect(seat);
        }
    };

    const STAGE_Y_OFFSET = 300;
    const ROW_DEPTH = 30;
    const SEAT_ANGLE_STEP = 0.6;
    const AISLE_SEAT_GAP = 3.5;
    const BASE_RADIUS = 2500;
    const PIVOT_Y = 150 - BASE_RADIUS;
    const CROSS_AISLE_GAP = 60;

    return (
        // 🌟 ここにさっき作った「透明な指（ref）」を取り付けます！
        <div ref={scrollContainerRef} className="w-full h-full overflow-auto bg-paper">
            <div className="relative w-[2800px] h-[1600px] shrink-0 pt-20 mx-auto">
                <div
                    className="absolute left-1/2 -translate-x-1/2 w-[800px] h-20 bg-pencil-light/10 flex items-center justify-center text-sm text-pencil-light tracking-widest border border-pencil/20 shadow-inner z-0"
                    style={{
                        top: `${PIVOT_Y + BASE_RADIUS - 120}px`,
                        borderRadius: "50% 50% 10% 10%",
                    }}
                >
                    STAGE
                </div>

                <div
                    className="absolute left-1/2 w-0 h-0"
                    style={{ top: `${PIVOT_Y}px` }}
                >
                    {mergedFloorMap.map((floor) => (
                        <div key={floor.floor}>
                            {floor.rows.map((row) => {
                                let rowRadius = BASE_RADIUS + (row.rowNumber) * ROW_DEPTH;
                                if (row.rowNumber >= 14) rowRadius += ROW_DEPTH;
                                if (row.rowNumber >= 20) rowRadius += CROSS_AISLE_GAP;

                                const renderedSeats = row.seats.map((item, index) => {
                                    const logicalIndex = index - 30.5;
                                    const angleDeg = -logicalIndex * SEAT_ANGLE_STEP;

                                    if (!item) {
                                        return (
                                            <div key={`null-${index}`}
                                                className="absolute w-4 h-4"
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

                                    if ('type' in item && item.type === 'door') {
                                        if (!item.label) return null;
                                        const width = item.span * 14;
                                        const rowSpan = item.rowSpan || 1;
                                        const height = rowSpan * ROW_DEPTH;
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

                                    if ('type' in item && item.type === 'rowLabel') {
                                        return (
                                            <div key={`label-${index}`}
                                                className="absolute flex items-center justify-center text-[10px] text-zinc-400 font-bold pointer-events-none"
                                                style={{
                                                    top: 0, left: 0,
                                                    width: '16px', height: '16px',
                                                    transformOrigin: `0px -${rowRadius}px`,
                                                    transform: `translateY(${rowRadius}px) rotate(${angleDeg}deg)`,
                                                }}
                                            >
                                                {item.value}
                                            </div>
                                        );
                                    }

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
                {
                    isFormOpen && (
                        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsFormOpen(false)} />
                    )
                }
            </div>
        </div>
    );
}

export { SeatMap as SeatMap1F };
