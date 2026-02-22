'use client';

import { useState } from 'react';
import { SeatMap1F } from '@/components/theater/SeatMap';
import { SeatMap2F } from '@/components/theater/SeatMap2F';
import { SeatMap3F } from '@/components/theater/SeatMap3F';

type Floor = '1F' | '2F' | '3F';

export default function TheaterPage() {
    const [selectedFloor, setSelectedFloor] = useState<Floor>('1F');

    return (
        <div className="min-h-screen bg-paper p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-pencil mb-2">
                        梅田芸術劇場 メインホール
                    </h1>
                    <p className="text-pencil/70">Umeda Arts Theater Main Hall</p>
                </div>

                {/* Floor Selection Buttons */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setSelectedFloor('1F')}
                        className={`
                            px-8 py-4 rounded-lg font-bold text-lg
                            transition-all duration-200
                            ${selectedFloor === '1F'
                                ? 'bg-highlight text-white shadow-lg scale-105'
                                : 'bg-white text-pencil border-2 border-pencil/30 hover:border-highlight hover:text-highlight'
                            }
                        `}
                    >
                        1階席 (1F)
                    </button>
                    <button
                        onClick={() => setSelectedFloor('2F')}
                        className={`
                            px-8 py-4 rounded-lg font-bold text-lg
                            transition-all duration-200
                            ${selectedFloor === '2F'
                                ? 'bg-highlight text-white shadow-lg scale-105'
                                : 'bg-white text-pencil border-2 border-pencil/30 hover:border-highlight hover:text-highlight'
                            }
                        `}
                    >
                        2階席 (2F)
                    </button>
                    <button
                        onClick={() => setSelectedFloor('3F')}
                        className={`
                            px-8 py-4 rounded-lg font-bold text-lg
                            transition-all duration-200
                            ${selectedFloor === '3F'
                                ? 'bg-highlight text-white shadow-lg scale-105'
                                : 'bg-white text-pencil border-2 border-pencil/30 hover:border-highlight hover:text-highlight'
                            }
                        `}
                    >
                        3階席 (3F)
                    </button>
                </div>

                {/* Current Floor Label */}
                <div className="text-center mb-6">
                    <div className="inline-block bg-white px-6 py-3 rounded-full shadow-md border border-pencil/20">
                        <span className="text-pencil/70 text-sm mr-2">現在の表示:</span>
                        <span className="text-highlight font-bold text-xl">
                            {selectedFloor === '1F' && '1階席'}
                            {selectedFloor === '2F' && '2階席'}
                            {selectedFloor === '3F' && '3階席'}
                        </span>
                    </div>
                </div>

                {/* Seat Map Display */}
                <div className="bg-white rounded-xl shadow-xl p-8 border border-pencil/10">
                    {selectedFloor === '1F' && <SeatMap1F />}
                    {selectedFloor === '2F' && <SeatMap2F />}
                    {selectedFloor === '3F' && <SeatMap3F />}
                </div>
            </div>
        </div>
    );
}
