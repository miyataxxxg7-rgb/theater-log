import { Share2 } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-10 bg-paper/80 backdrop-blur-sm border-b border-pencil/10 p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-pencil">
                    推<span className="text-oshi">SHIGOTO</span>
                </h1>
                <button className="p-2 text-pencil-light hover:text-pencil hover:bg-black/5 rounded-full transition-colors">
                    <Share2 size={20} />
                </button>
            </div>
        </header>
    );
}
