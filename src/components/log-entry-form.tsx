"use client";

import { useState } from "react";
import { Camera, Star, Calendar, MapPin, Armchair, Users } from "lucide-react";

export function LogEntryForm() {
    const [rating, setRating] = useState(0);

    return (
        {/* 🌟 ここにスクロールの魔法を追加しました！ 🌟 */ }
        < form className = "space-y-6 max-w-xl mx-auto p-6 max-h-[75vh] overflow-y-auto" >
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">タイトル</label>
                <input
                    type="text"
                    placeholder="公演名を入力"
                    className="w-full bg-card/50 border border-border rounded-xl p-3 text-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <Calendar className="w-4 h-4 text-accent" /> 日時
                    </label>
                    <input
                        type="date"
                        className="w-full bg-card/50 border border-border rounded-xl p-3 focus:ring-2 focus:ring-secondary outline-none transition-all text-gray-200"
                    />
                </div>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <MapPin className="w-4 h-4 text-accent" /> 劇場
                    </label>
                    <input
                        type="text"
                        placeholder="劇場名を入力"
                        className="w-full bg-card/50 border border-border rounded-xl p-3 focus:ring-2 focus:ring-secondary outline-none transition-all"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Armchair className="w-4 h-4 text-accent" /> 座席
                </label>
                <input
                    type="text"
                    placeholder="例: 1階 A列 12番"
                    className="w-full bg-card/50 border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">評価</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-8 h-8 ${star <= rating
                                        ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                                        : "text-gray-600"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Users className="w-4 h-4 text-accent" /> キャスト
                </label>
                <textarea
                    rows={3}
                    placeholder="出演者を記入..."
                    className="w-full bg-card/50 border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-card/30 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors cursor-pointer group">
                    <Camera className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs">チケット写真</span>
                </div>
                <div className="aspect-square bg-card/30 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:text-secondary hover:border-secondary transition-colors cursor-pointer group">
                    <Camera className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs">その他写真</span>
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
                保存する
            </button>
        </form >
    );
}