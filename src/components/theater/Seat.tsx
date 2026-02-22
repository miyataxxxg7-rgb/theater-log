import { Seat as SeatType } from "@/types/theater";
import clsx from "clsx";

interface SeatProps {
    seat: SeatType;
    onClick: (seat: SeatType) => void;
    isSelected: boolean;
}

export function Seat({ seat, onClick, isSelected }: SeatProps) {
    return (
        <button
            onClick={() => onClick(seat)}
            className={clsx(
                "w-6 h-6 rounded-sm text-[9px] font-medium flex items-center justify-center transition-all duration-200 shadow-sm",
                isSelected
                    ? "bg-oshi text-white scale-110 shadow-oshi/50 shadow-md transform -translate-y-1 z-10"
                    : seat.status === "logged"
                        ? "bg-primary/20 text-primary border border-primary font-bold"
                        : "bg-white border border-gray-300 hover:border-oshi hover:bg-oshi-dim text-gray-900",
            )}
            title={`${seat.floor}階 ${seat.row}列 ${seat.number}番`}
        >
            {seat.number}
        </button>
    );
}
