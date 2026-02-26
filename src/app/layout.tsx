import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Armchair, BookOpen, Building2, Calendar, Share2 } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "推SHIGOTO",
  description: "観劇ログアプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        {/* スマホ風の中央寄せレイアウト */}
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg relative pb-20 pt-14">

          {/* トップヘッダー（推SHIGOTO） */}
          <header className="absolute top-0 w-full max-w-md bg-white border-b border-gray-200 z-10 flex justify-between items-center px-4 h-14">
            <div className="font-bold text-lg tracking-wider">推SHIGOTO</div>
            <button className="p-2">
              <Share2 size={20} className="text-gray-600" />
            </button>
          </header>

          {/* メインコンテンツ（各画面がここに入ります） */}
          <main className="p-4">{children}</main>

          {/* 下部ナビゲーション（アイコンメニュー） */}
          <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 z-10">
            <div className="flex justify-around items-center h-16 pb-2">
              <Link href="/theater" className="flex flex-col items-center text-gray-600 hover:text-purple-600">
                <Armchair size={24} />
                <span className="text-[10px] mt-1">座席表</span>
              </Link>
              <Link href="/logs" className="flex flex-col items-center text-gray-600 hover:text-purple-600">
                <BookOpen size={24} />
                <span className="text-[10px] mt-1">ログ</span>
              </Link>
              <Link href="/theater" className="flex flex-col items-center text-gray-600 hover:text-purple-600">
                <Building2 size={24} />
                <span className="text-[10px] mt-1">劇場</span>
              </Link>
              <Link href="/calendar" className="flex flex-col items-center text-gray-600 hover:text-purple-600">
                <Calendar size={24} />
                <span className="text-[10px] mt-1">予定</span>
              </Link>
            </div>
          </nav>

        </div>
      </body>
    </html>
  );
}