import { Share2 } from "lucide-react";
import Link from "next/link"; // 🌟 リンクを貼るための魔法をインポート

export function Header() {
    return (
        <header className="sticky top-0 z-40 bg-paper/80 backdrop-blur-sm border-b border-pencil/10 p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                {/* 🌟 ロゴをLinkで囲んで、クリックでトップページ('/')へ！ */}
                <Link
                    href="/"
                    className="group active:scale-95 transition-transform duration-200"
                >
                    <h1 className="text-2xl font-bold tracking-tight text-pencil">
                        推<span className="text-oshi group-hover:opacity-80 transition-opacity">SHIGOTO</span>
                    </h1>
                </Link>

                <button className="p-2 text-pencil-light hover:text-pencil hover:bg-black/5 rounded-full transition-colors">
                    <Share2 size={20} />
                </button>
            </div>
        </header>
    );
}
