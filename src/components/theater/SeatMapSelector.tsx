"use client";

import { useState } from "react";
import { Theater } from "@/types/theater";
import { TheaterSelector } from "./TheaterSelector";
import { FloorSelector } from "./FloorSelector";
import { SeatMap } from "./SeatMap";
import { SeatMap2F } from "./SeatMap2F";
import { SeatMap3F } from "./SeatMap3F";
import { ArrowLeft } from "lucide-react";

export function SeatMapSelector() {
    // 🌟 ここを「null」にすることで、絶対に「劇場を選択」の画面からスタートします！
    const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
    const [selectedFloor, setSelectedFloor] = useState<1 | 2 | 3 | null>(null);

    // 劇場選択（一番最初の画面）に戻る
    const handleBackToTheaters = () => {
        setSelectedTheater(null);
        setSelectedFloor(null);
    };

    // 階数選択（真ん中の画面）に戻る
    const handleBackToFloors = () => {
        setSelectedFloor(null);
    };

    // 1. 劇場未選択 → 🌟「劇場を選択」画面を表示！（MIさんが見たい画面！）
    if (!selectedTheater) {
        return <TheaterSelector onSelect={setSelectedTheater} />;
    }

    // 2. 階数未選択 → 「階数を選択」画面を表示
    if (!selectedFloor) {
        return (
            <div className="space-y-4 pt-2 pb-12 animate-in fade-in duration-300">
                {/* 🌟 ちゃんと劇場選択に戻れるボタンも完備！ */}
                <button
                    onClick={handleBackToTheaters}
                    className="flex items-center gap-2 text-pencil-light hover:text-oshi transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm font-bold">劇場選択に戻る</span>
                </button>
                <FloorSelector
                    theaterName={selectedTheater.name}
                    onSelect={setSelectedFloor}
                    onBack={handleBackToTheaters}
                />
            </div>
        );
    }

    // 3. 両方選択済み → 「座席表」画面を表示
    return (
        <div className="space-y-4 pt-2 pb-12 animate-in fade-in duration-300">
            <div className="flex items-center justify-between px-2">
                <button
                    onClick={handleBackToFloors}
                    className="flex items-center gap-2 text-pencil-light hover:text-oshi transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm font-bold">階数選択に戻る</span>
                </button>
                <div className="text-[10px] font-bold text-pencil-light bg-pencil-light/10 px-3 py-1.5 rounded-full">
                    {selectedTheater.name} / {selectedFloor}階席
                </div>
            </div>

            {selectedFloor === 1 ? (
                <SeatMap onSeatSelect={(seat) => console.log(seat)} />
            ) : selectedFloor === 2 ? (
                <SeatMap2F />
            ) : selectedFloor === 3 ? (
                <SeatMap3F />
            ) : (
                <div className="bg-white/50 p-8 rounded-lg border border-pencil/20 text-center">
                    <p className="text-pencil-light font-bold">
                        {selectedFloor}階席は準備中です
                    </p>
                </div>
            )}
        </div>
    );
}