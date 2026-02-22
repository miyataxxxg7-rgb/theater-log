"use client";

import { ArrowLeft } from "lucide-react";

interface FloorSelectorProps {
    theaterName: string;
    onSelect: (floor: 1 | 2 | 3) => void;
    onBack: () => void;
}

export function FloorSelector({ theaterName, onSelect, onBack }: FloorSelectorProps) {
    const floors: Array<{ id: 1 | 2 | 3; label: string; available: boolean }> = [
        { id: 1, label: "1階席", available: true },
        { id: 2, label: "2階席", available: true },
        { id: 3, label: "3階席", available: true }
    ];

    return (
        <div className="space-y-4">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-pencil-light hover:text-oshi transition-colors"
            >
                <ArrowLeft size={20} />
                <span className="text-sm">劇場選択に戻る</span>
            </button>

            <h2 className="text-xl font-bold text-pencil">{theaterName}</h2>
            <p className="text-sm text-pencil-light">階数を選択してください</p>

            <div className="space-y-3">
                {floors.map((floor) => (
                    <button
                        key={floor.id}
                        onClick={() => floor.available && onSelect(floor.id)}
                        disabled={!floor.available}
                        className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${floor.available
                            ? "bg-white/50 border-pencil/20 hover:bg-oshi-dim/10 hover:border-oshi cursor-pointer"
                            : "bg-gray-100/50 border-gray-300/20 cursor-not-allowed opacity-50"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-pencil">{floor.label}</h3>
                            {!floor.available && (
                                <span className="text-xs text-pencil-light bg-gray-200 px-2 py-1 rounded">
                                    準備中
                                </span>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
