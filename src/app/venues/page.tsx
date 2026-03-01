import { Coffee, MapPin, Sparkles, Wrench, Luggage } from "lucide-react";

export default function VenuesPage() {
    return (
        <div className="space-y-6 pt-6 pb-12 animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center justify-center min-h-[70vh] text-center">

            {/* 可愛い工事中アイコン */}
            <div className="relative">
                <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-4 mx-auto shadow-inner border border-pink-100">
                    <Wrench className="w-10 h-10 text-pink-400" />
                </div>
                <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>

            {/* メッセージ */}
            <div className="space-y-2">
                <h1 className="text-xl font-bold text-pencil">劇場情報ページを準備中！🚧</h1>
                <p className="text-sm text-pencil-light leading-relaxed">
                    遠征や観劇に役立つ、劇場ごとの<br />
                    便利メモを見られるようになる予定です！
                </p>
            </div>

            {/* 実装予定の機能リスト */}
            <div className="w-full bg-white border border-dashed border-pencil/30 rounded-2xl p-6 shadow-sm mt-8 relative overflow-hidden">
                <h2 className="text-sm font-bold text-pencil mb-5 relative z-10">✨ こんな機能を計画中 ✨</h2>

                <ul className="space-y-4 text-left w-max mx-auto relative z-10">
                    <li className="flex items-center gap-3 text-sm text-pencil-light font-medium">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-500 shadow-sm border border-blue-100"><MapPin size={18} /></div>
                        <span>迷わない！アクセス＆出口情報</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-pencil-light font-medium">
                        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600 shadow-sm border border-yellow-100"><Luggage size={18} /></div>
                        <span>コインロッカー・お手洗い情報</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-pencil-light font-medium">
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-500 shadow-sm border border-orange-100"><Coffee size={18} /></div>
                        <span>開演前に行ける周辺のカフェ☕️</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}