"use client";

import { LogList } from "@/components/log/LogList";
import { BookOpen } from "lucide-react";

export default function LogsPage() {
  return (
    <div className="space-y-4 pt-2 pb-12 animate-in fade-in zoom-in-95 duration-300">
      {/* タイトル部分 */}
      <div className="px-2 flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-pink-500" />
        <h1 className="text-xl font-bold text-pencil">観劇ログ</h1>
      </div>

      {/* ログの一覧 */}
      <LogList />
    </div>
  );
}