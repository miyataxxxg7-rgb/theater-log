import { LogEntryForm } from "@/components/log-entry-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewLogPage() {
    return (
        <main className="container mx-auto p-4 max-w-2xl">
            <div className="mb-6 pt-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    戻る
                </Link>
                <h1 className="text-2xl font-bold text-foreground">新しい記録を追加</h1>
            </div>

            <LogEntryForm />
        </main>
    );
}
