"use client";

import Link from "next/link";
import { useTickets } from "@/hooks/useTickets";
import { useLogs } from "@/hooks/useLogs";
import { Calendar, Ticket, Armchair, Plus, ChevronRight, Sparkles } from "lucide-react";
import { useMemo } from "react";
import clsx from "clsx";

export default function Home() {
  const { tickets } = useTickets();
  const { logs } = useLogs();

  // 🌟 直近のイベント（Next 推SHIGOTO）を自動で探し出す賢い魔法
  const nextEvent = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // 今日の0時を基準にする

    let allEvents: any[] = [];

    tickets.forEach(ticket => {
      if (!ticket.dates) return;
      const { applicationStart, applicationEnd, resultDate, paymentDeadline, ticketIssueDate, showDate } = ticket.dates;

      const addEvent = (dateString: string | undefined, type: string, label: string, colorClass: string, icon: string) => {
        if (!dateString) return;

        // 日付部分だけを取り出して計算
        const datePart = dateString.split('T')[0];
        const eventDate = new Date(datePart);
        eventDate.setHours(0, 0, 0, 0);

        if (eventDate >= now) {
          // 時間が入力されていれば時間も取り出す
          const timeStr = dateString.includes('T') ? dateString.split('T')[1].substring(0, 5) : "";

          allEvents.push({
            date: eventDate,
            dateStr: datePart,
            timeStr,
            type,
            label,
            ticket,
            colorClass,
            icon
          });
        }
      };

      // 全ての期限をリストアップ（過ぎたものは自動で弾かれます）
      addEvent(applicationEnd, 'apply_end', '申込締切', 'text-blue-600 bg-blue-50 border-blue-200', '🎫');
      addEvent(resultDate, 'result', '当落発表', 'text-pink-600 bg-pink-50 border-pink-200', '📢');
      addEvent(paymentDeadline, 'payment', '入金締切', 'text-red-600 bg-red-50 border-red-200', '⚠️');
      addEvent(ticketIssueDate, 'issue', '発券開始', 'text-green-700 bg-green-50 border-green-200', '🏪');
      addEvent(showDate, 'show', '公演日', 'text-yellow-700 bg-yellow-50 border-yellow-200', '⭐');
    });

    // 日付が近い順に並び替えて、一番最初の予定を返す
    allEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
    return allEvents.length > 0 ? allEvents[0] : null;
  }, [tickets]);

  // 日付を「〇月〇日(曜日)」に可愛くフォーマット
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${d.getMonth() + 1}月${d.getDate()}日(${days[d.getDay()]})`;
  };

  // 「あと何日？」を計算
  const getDaysLeft = (eventDateStr: string) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const eventDate = new Date(eventDateStr);
    eventDate.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(eventDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "今日!!";
    if (diffDays === 1) return "明日!";
    return `あと ${diffDays} 日`;
  };

  return (
    <div className="space-y-6 pt-2 pb-12 animate-in fade-in zoom-in-95 duration-300">
      {/* タイトル */}
      <div className="px-2 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-pink-500" />
        <h1 className="text-xl font-bold text-pencil">マイページ</h1>
      </div>

      {/* ① 直近の予定 (Next 推SHIGOTO) */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold text-pencil-light px-2">Next 推SHIGOTO</h2>

        {nextEvent ? (
          <div className="bg-white border border-pencil/10 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            {/* 背景にうっすら大きなアイコンを置くオシャレ演出 */}
            <div className="absolute -right-4 -top-4 text-8xl opacity-[0.04] pointer-events-none">
              {nextEvent.icon}
            </div>

            <div className="flex justify-between items-start mb-3 relative z-10">
              <div className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border", nextEvent.colorClass)}>
                <span>{nextEvent.icon}</span>
                <span>{nextEvent.label}</span>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-pencil-light mb-0.5">{formatDate(nextEvent.dateStr)} {nextEvent.timeStr}</p>
                <p className="text-sm font-black text-pink-500">{getDaysLeft(nextEvent.dateStr)}</p>
              </div>
            </div>

            <h3 className="font-bold text-pencil text-base leading-snug mb-2 line-clamp-2 relative z-10">
              {nextEvent.ticket.title}
            </h3>

            {nextEvent.ticket.venue && (
              <p className="text-xs text-pencil-light flex items-center gap-1 relative z-10">
                📍 {nextEvent.ticket.venue}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-pencil/20 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-sm text-pencil-light font-bold mb-2">直近の予定はありません</p>
            <p className="text-xs text-pencil-light/60">新しい推し事を見つけに行きましょう！</p>
          </div>
        )}
      </section>

      {/* ② 推し活ステータス（実績の数字） */}
      <section className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-pencil/10 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center gap-1">
          <Ticket className="w-6 h-6 text-blue-400 mb-1" />
          <span className="text-[10px] font-bold text-pencil-light">管理中のチケット</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-pencil">{tickets.length}</span>
            <span className="text-xs font-bold text-pencil-light">件</span>
          </div>
        </div>
        <div className="bg-white border border-pencil/10 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center gap-1">
          <Armchair className="w-6 h-6 text-pink-400 mb-1" />
          <span className="text-[10px] font-bold text-pencil-light">これまでの観劇録</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-pencil">{logs.length}</span>
            <span className="text-xs font-bold text-pencil-light">回</span>
          </div>
        </div>
      </section>

      {/* ③ クイックアクションボタン */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold text-pencil-light px-2">クイックアクション</h2>
        <div className="grid grid-cols-1 gap-2">
          <Link href="/calendar" className="flex items-center justify-between bg-white border border-pencil/10 rounded-xl p-3 shadow-sm hover:bg-gray-50 transition-colors active:scale-[0.98]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <Plus className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-pencil">チケットを登録する</p>
                <p className="text-[10px] text-pencil-light">カレンダーから新しい予定を追加</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-pencil-light/50" />
          </Link>

          <Link href="/theater" className="flex items-center justify-between bg-white border border-pencil/10 rounded-xl p-3 shadow-sm hover:bg-gray-50 transition-colors active:scale-[0.98]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
                <Armchair className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-pencil">観劇ログを書く</p>
                <p className="text-[10px] text-pencil-light">座席表から感想や記録を残す</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-pencil-light/50" />
          </Link>
        </div>
      </section>
    </div>
  );
}
