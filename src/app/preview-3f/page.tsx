import { SeatMap3F } from "@/components/theater/SeatMap3F";

export default function Preview3FPage() {
    return (
        <main className="min-h-screen bg-background p-8">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center text-foreground">
                    3階席プレビュー
                </h1>
                <SeatMap3F />
            </div>
        </main>
    );
}
