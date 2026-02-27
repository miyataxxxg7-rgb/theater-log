"use client";

import { useState } from "react";
import { Armchair, BookOpen, Building2, Calendar as CalendarIcon } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SeatMapSelector } from "@/components/theater/SeatMapSelector";
import TicketList from "@/components/ticket/TicketList";
import { TicketCalendar } from "@/components/calendar/Calendar";
import clsx from "clsx";

import { LogList } from "@/components/log/LogList";

type TabId = "map" | "log" | "theater" | "schedule";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("map");

  return (
    <div className="min-h-screen bg-paper pb-24 text-pencil font-zen">
      <Header />

      <main className="p-4 max-w-6xl mx-auto">
        <div className="animate-in fade-in zoom-in-95 duration-300">
          {activeTab === "map" && (
            <div className="space-y-4">
              <SeatMapSelector />
            </div>
          )}

          {activeTab === "log" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">観劇ログ</h2>
              <LogList />
            </div>
          )}

          {activeTab === "theater" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">劇場情報</h2>
              <div className="bg-white/50 p-4 rounded-lg border border-pencil/20">
                <h3 className="font-bold mb-2">梅田芸術劇場メインホール</h3>
                <p>〒530-0013 大阪府大阪市北区茶屋町19-1</p>
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">チケット管理</h2>

              {/* 🌟 スマホ用の綺麗な縦並びに変更しました！ 🌟 */}
              <div className="flex flex-col gap-8 w-full">

                {/* カレンダー（上） */}
                <div className="w-full">
                  <TicketCalendar />
                </div>

                {/* チケット一覧（下） */}
                <div className="w-full">
                  <TicketList />
                </div>

              </div>
            </div>
          )}
        </div>
      </main>

      {/* Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-paper/90 backdrop-blur-md border-t border-pencil/10 p-2 pb-6 safe-area-pb z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <TabButton
            id="map"
            label="座席表"
            icon={Armchair}
            activeId={activeTab}
            onClick={setActiveTab}
          />
          <TabButton
            id="log"
            label="ログ"
            icon={BookOpen}
            activeId={activeTab}
            onClick={setActiveTab}
          />
          <TabButton
            id="theater"
            label="劇場"
            icon={Building2}
            activeId={activeTab}
            onClick={setActiveTab}
          />
          <TabButton
            id="schedule"
            label="予定"
            icon={CalendarIcon}
            activeId={activeTab}
            onClick={setActiveTab}
          />
        </div>
      </nav>
    </div>
  );
}

function TabButton({
  id,
  label,
  icon: Icon,
  activeId,
  onClick
}: {
  id: TabId;
  label: string;
  icon: React.ElementType;
  activeId: TabId;
  onClick: (id: TabId) => void;
}) {
  const isActive = id === activeId;

  return (
    <button
      onClick={() => onClick(id)}
      className={clsx(
        "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 w-16",
        isActive
          ? "text-oshi scale-110 bg-oshi-dim/30"
          : "text-pencil-light hover:text-pencil hover:bg-black/5"
      )}
    >
      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
      <span className="text-[10px] mt-1 font-bold">{label}</span>
    </button>
  );
}