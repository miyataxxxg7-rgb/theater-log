"use client";

import { Theater } from "@/types/theater";
import { Building2 } from "lucide-react";

interface TheaterSelectorProps {
    onSelect: (theater: Theater) => void;
}

export function TheaterSelector({ onSelect }: TheaterSelectorProps) {
    // 現在は梅田芸術劇場のみ
    const theaters: Theater[] = [
        {
            id: "umeda-arts",
            name: "梅田芸術劇場メインホール",
            address: "〒530-0013 大阪府大阪市北区茶屋町19-1"
        }
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-pencil">劇場を選択</h2>
            <div className="space-y-3">
                {theaters.map((theater) => (
                    <button
                        key={theater.id}
                        onClick={() => onSelect(theater)}
                        className="w-full p-4 bg-white/50 border border-pencil/20 rounded-lg hover:bg-oshi-dim/10 hover:border-oshi transition-all duration-200 text-left group"
                    >
                        <div className="flex items-start gap-3">
                            <Building2 className="text-oshi group-hover:scale-110 transition-transform" size={24} />
                            <div>
                                <h3 className="font-bold text-pencil mb-1">{theater.name}</h3>
                                <p className="text-sm text-pencil-light">{theater.address}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
