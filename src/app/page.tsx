import { Ticket, Plus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <header className="flex justify-between items-center mb-8 pt-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Ticket className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Theater Log
          </h1>
        </div>
        <Link href="/logs/new" className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full font-medium transition-colors shadow-lg shadow-primary/25 cursor-pointer">
          <Plus className="w-5 h-5" />
          <span>ログ追加</span>
        </Link>
      </header>

      <div className="grid gap-4">
        <div className="p-8 border border-border/50 rounded-2xl bg-card/50 text-center space-y-4 shadow-xl backdrop-blur-sm">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-8 h-8 text-accent opacity-50" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">記録がありません</h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto text-gray-400">
            最初の観劇記録を追加して、思い出を残しましょう！
          </p>
        </div>
      </div>
    </main>
  );
}
