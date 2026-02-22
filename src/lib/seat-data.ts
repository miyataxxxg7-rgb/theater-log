import { FloorMap, Seat, SeatRow, Door, RowLabel } from "@/types/theater";

export function generateSeatData(): FloorMap[] {
    return [
        generateFirstFloor(),
        // 2階、3階は後ほど追加
    ];
}


function generateFirstFloor(): FloorMap {
    const rows: SeatRow[] = [];

    // CONFIGURATION: 62 Columns Total
    // Left Block (13) + Left Aisle (2) + Center Block (32) + Right Aisle (2) + Right Block (13)
    // Helper to build a row from an explicit array of numbers/nulls/Doors
    // Centers the data in the 62-column grid.
    const buildExplicitRow = (rowNum: number, items: (number | null | Door | RowLabel)[]): (Seat | Door | RowLabel | null)[] => {
        // Pre-process items to inject Row Labels at specific aisles (after 25 and after 37)
        // User Request: Replace null between 25/26 and 37/38 with Label.
        const processedItems = items.map((item, i) => {
            if (item === null) {
                const prev = items[i - 1];
                if (typeof prev === 'number') {
                    if (prev === 25) return { type: 'rowLabel', value: rowNum } as RowLabel;
                    if (prev === 37) return { type: 'rowLabel', value: rowNum } as RowLabel;
                }
            }
            return item;
        });

        const rowItems: (Seat | Door | RowLabel | null)[] = new Array(62).fill(null);

        // Calculate visual length
        let visualLength = 0;
        processedItems.forEach(item => {
            if (item && typeof item === 'object' && 'type' in item && item.type === 'door') {
                visualLength += item.span;
            } else {
                visualLength += 1;
            }
        });

        const padding = Math.floor((62 - visualLength) / 2);
        let currentGridIndex = padding;

        processedItems.forEach((item) => {
            if (currentGridIndex >= 62) return;

            if (item === null) {
                rowItems[currentGridIndex] = null;
                currentGridIndex++;
            } else if (typeof item === 'number') {
                let section: "left" | "center" | "right" = "center";
                if (item <= 25) section = "left";
                else if (item >= 38) section = "right";

                rowItems[currentGridIndex] = {
                    id: `1F-${rowNum}-${item}`,
                    floor: 1,
                    row: rowNum,
                    number: item,
                    section,
                    status: "vacant",
                };
                currentGridIndex++;
            } else if (typeof item === 'object') {
                if (item.type === 'door') {
                    rowItems[currentGridIndex] = item;
                    currentGridIndex += item.span;
                } else if (item.type === 'rowLabel') {
                    rowItems[currentGridIndex] = item;
                    currentGridIndex++;
                }
            }
        });

        return rowItems;
    };


    // Helper to build a row with custom blocks
    const buildCustomRow = (rowNum: number, blocks: { start: number, end: number }[]): (Seat | Door | null)[] => {
        const rowItems: (Seat | Door | null)[] = new Array(62).fill(null);

        // Standard Mapping Reference (Row 5):
        // Seat 14 -> Index 15. Seat 31 -> Index 32.
        // We map Seat X to Index (X + 1).
        // Wait, let's verify mapSeatToindex from BuildRow below or re-derive.
        // Logic:
        // Seat 1-13 -> Index 0-12 (Index = Seat - 1)
        // Gap 13,14
        // Seat 14-45 -> Index 15-46 (Index = Seat - 1 + 2 = Seat + 1)
        // Gap 47,48
        // Seat 46-58 -> Index 49-61 (Index = Seat - 1 + 4 = Seat + 3)

        // For Rows 1-3, the "Center Block" 26-37 falls in the 14-45 range.
        // So they should use the Center mapping: Index = Seat + 1.
        // Seat 26 -> Index 27. Seat 37 -> Index 38.
        // Total 12 seats (27..38).
        //
        // Left Block (e.g. 23-25). 
        // If we use Center mapping: Seat 25 -> Index 26.
        // But we want a GAP between 25 and 26.
        // So Seat 25 should be at Index 25? (Shifted left by 1 relative to center).
        // If Seat 25 is Index 25. Seat 23 is Index 23.
        // Range 23-25 -> Indices 23,24,25.
        // Gap at Index 26.
        // Seat 26 at Index 27.
        // This gives a 1-slot gap (Index 26). User asked for "Gap" (Quantity 1? or Standard?).
        // Standard aisle is 2 slots (Indices 13,14 in Row 5).
        // Let's try to align with standard aisle if possible.
        // If Center starts at 27.
        // If we use "Index = Seat - 1" for Left Block (Standard Left logic):
        // Seat 25 -> Index 24.
        // Seat 23 -> Index 22.
        // Range 23-25 -> Indices 22,23,24.
        // Gap is Index 25, 26 (2 slots).
        // This perfectly matches the "2 slot aisle" logic!
        // So:
        // Left Block (<= 25) uses "Left" mapping (Index = Seat - 1).
        // Center Block (26-45?) uses "Center" mapping (Index = Seat + 1).
        // Right Block (>= 38?) uses "Right" mapping?
        // Right Gap: Seat 37 is Index 38.
        // Right Block starts 38.
        // If we use "Right" mapping (Index = Seat + 3).
        // Seat 38 -> Index 41.
        // Gap is Indices 39, 40 (2 slots).
        // This ALSO perfectly matches the 2-slot aisle!

        // CONCLUSION: The standard mapping logic WORKS for these rows if we just define the blocks!
        // The previous "buildRow" logic had rigorous "SeatNum <= 13" checks.
        // We just need to relax those checks or pass the specific mapping strategy?
        // Actually, the previous logic:
        // if (seatNum <= 13) ... else if (seatNum <= 45) ...
        // For Row 1, Seat 25 is > 13, so it would default to Center mapping.
        // But we WANT it to use Left mapping.
        // So we need to override the mapping based on the BLOCK structure.

        blocks.forEach(block => {
            for (let seatNum = block.start; seatNum <= block.end; seatNum++) {
                let index = -1;
                // Determine Section based on Block Position relative to breaks
                // Center Break 1: Between 25/26.
                // Center Break 2: Between 37/38.
                if (seatNum <= 25) {
                    index = seatNum - 1; // Left Mapping
                } else if (seatNum <= 37) {
                    index = seatNum + 1; // Center Mapping
                } else {
                    index = seatNum + 3; // Right Mapping
                }

                if (index >= 0 && index < 62) {
                    rowItems[index] = {
                        id: `1F-${rowNum}-${seatNum}`,
                        floor: 1,
                        row: rowNum,
                        number: seatNum,
                        section: "center", // All these are conceptually center-ish
                        status: "vacant",
                    };
                }
            }
        });
        return rowItems;
    };


    // Helper to build a row with proper spacing (Standard Logic)
    const buildRow = (
        rowNum: number,
        startSeat: number,
        endSeat: number,
        doors: { left?: boolean, right?: boolean } = {}
    ): (Seat | Door | null)[] => {
        const rowItems: (Seat | Door | null)[] = new Array(62).fill(null);

        // 1. Populate Seats
        for (let seatNum = startSeat; seatNum <= endSeat; seatNum++) {
            let index = -1;

            // Map Seat Number to Physical Index (Gap aware)
            if (seatNum >= 1 && seatNum <= 13) {
                index = seatNum - 1; // 0-12
            } else if (seatNum >= 14 && seatNum <= 45) {
                index = seatNum - 1 + 2; // 15-46 (Skip 13,14)
            } else if (seatNum >= 46 && seatNum <= 58) {
                index = seatNum - 1 + 4; // 49-61 (Skip 13,14, 47,48)
            }

            if (index >= 0 && index < 62) {
                let section: "left" | "center" | "right" = "center";
                if (seatNum <= 13) section = "left";
                else if (seatNum >= 46) section = "right";

                rowItems[index] = {
                    id: `1F-${rowNum}-${seatNum}`,
                    floor: 1,
                    row: rowNum,
                    number: seatNum,
                    section,
                    status: "vacant",
                };
            }
        }

        // 2. Populate Doors (Row 20 special request)
        if (doors.left) {
            // Door 2: Occupies the entire Left Block (0-12)
            // We place the Door object at the first index, and leave the rest as null (or handled by render logic)
            // Ideally, we replace the first slot with Door, and ensure other slots in this block are empty.
            // Since this function filled with null initially, we just set index 0.
            rowItems[0] = { type: 'door', label: '扉2', span: 13 };
            // Ensure 1-12 are effectively empty or part of the span visually. The array will have nulls.
        }
        if (doors.right) {
            // Door 3: Occupies the entire Right Block (49-61)
            rowItems[49] = { type: 'door', label: '扉3', span: 13 };
        }

        return rowItems;
    };

    // --- ROW DEFINITIONS ---

    // 1列目: 3席(23-25) - [隙間] - 12席(26-37) - [隙間] - 3席(38-40)
    // 合計18席。中央ブロック(26-37)を基準にします。
    const row1Config = [
        23, 24, 25,
        null, // 隙間
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        null, // 隙間
        38, 39, 40
    ];
    rows.push({ rowNumber: 1, seats: buildExplicitRow(1, row1Config), curve: 0 });

    // 2列目: 6席(20-25) - [隙間] - 12席(26-37) - [隙間] - 6席(38-43)
    // 合計24席。
    const row2Config = [
        20, 21, 22, 23, 24, 25,
        null,
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        null,
        38, 39, 40, 41, 42, 43
    ];
    rows.push({ rowNumber: 2, seats: buildExplicitRow(2, row2Config), curve: 0 });

    // 3列目: 8席(18-25) - [隙間] - 12席(26-37) - [隙間] - 8席(38-45)
    // 合計28席。
    const row3Config = [
        18, 19, 20, 21, 22, 23, 24, 25,
        null,
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        null,
        38, 39, 40, 41, 42, 43, 44, 45
    ];
    rows.push({ rowNumber: 3, seats: buildExplicitRow(3, row3Config), curve: 0 });

    // 4列目: 10席(16-25) - [通路] - 12席(26-37) - [通路] - 10席(38-47)
    const row4Config = [
        16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
        null,
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        null,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47
    ];
    rows.push({ rowNumber: 4, seats: buildExplicitRow(4, row4Config), curve: 0 });

    // 5〜8列目共通: 12席(14-25) - [通路] - 12席(26-37) - [通路] - 12席(38-49)
    const commonRowData = [
        14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
        null,
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        null,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49
    ];

    rows.push({ rowNumber: 5, seats: buildExplicitRow(5, commonRowData), curve: 0 });
    rows.push({ rowNumber: 6, seats: buildExplicitRow(6, commonRowData), curve: 0 });
    rows.push({ rowNumber: 7, seats: buildExplicitRow(7, commonRowData), curve: 0 });
    rows.push({ rowNumber: 8, seats: buildExplicitRow(8, commonRowData), curve: 0 });

    // 9列目: 13番 - [通路] - 14〜25番 - [通路] - 26〜37番 - [通路] - 38〜49番 - [通路] - 50番
    const row9Config = [
        13, null,
        14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, null,
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, null,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, null,
        50
    ];
    rows.push({ rowNumber: 9, seats: buildExplicitRow(9, row9Config), curve: 0 });

    // 10列目: 12〜13番 - [通路] - 14〜25番 - [通路] - 26〜37番 - [通路] - 38〜49番 - [通路] - 50〜51番
    const row10Config = [
        12, 13, null,
        14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, null,
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, null,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, null,
        50, 51
    ];
    rows.push({ rowNumber: 10, seats: buildExplicitRow(10, row10Config), curve: 0 });

    // 11列目: 10〜13番 - [通路] - 14〜25番 - [通路] - 26〜37番 - [通路] - 38〜49番 - [通路] - 50〜53番
    const row11Config = [
        10, 11, 12, 13, null,
        14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, null,
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, null,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, null,
        50, 51, 52, 53
    ];
    rows.push({ rowNumber: 11, seats: buildExplicitRow(11, row11Config), curve: 0 });

    // 12列目 & 13列目: 9〜13番 - [通路] - 14〜25番 - [通路] - 26〜37番 - [通路] - 38〜49番 - [通路] - 50〜54番
    const row12Config = [
        9, 10, 11, 12, 13, null,
        14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, null,
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, null,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, null,
        50, 51, 52, 53, 54
    ];
    rows.push({ rowNumber: 12, seats: buildExplicitRow(12, row12Config), curve: 0 });
    rows.push({ rowNumber: 13, seats: buildExplicitRow(13, row12Config), curve: 0 });

    // 14列目: 8〜13番(6席) - [通路] - 14〜25番(12席) - [通路] - 26〜37番(12席) - [通路] - 38〜49番(12席) - [通路] - 50〜55番(6席)
    const row14Config = [
        8, 9, 10, 11, 12, 13,
        null,
        14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
        null,
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        null,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
        null,
        50, 51, 52, 53, 54, 55
    ];
    rows.push({ rowNumber: 14, seats: buildExplicitRow(14, row14Config), curve: 0 });

    // 15, 16, 17列目（14列目と同じ構成）
    // 8〜13番(6席) - [通路] - 14〜25番(12席) - [通路] - 26〜37番(12席) - [通路] - 38〜49番(12席) - [通路] - 50〜55番(6席)
    const commonRow15_17 = [
        8, 9, 10, 11, 12, 13,
        null,
        14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
        null,
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        null,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
        null,
        50, 51, 52, 53, 54, 55
    ];

    rows.push({ rowNumber: 15, seats: buildExplicitRow(15, commonRow15_17), curve: 0 });
    rows.push({ rowNumber: 16, seats: buildExplicitRow(16, commonRow15_17), curve: 0 });
    rows.push({ rowNumber: 17, seats: buildExplicitRow(17, commonRow15_17), curve: 0 });

    // 18列目: 7〜13番(7席) - [通路] - 14〜25番(12席) - [通路] - 26〜37番(12席) - [通路] - 38〜49番(12席) - [通路] - 50〜56番(7席)
    const row18Config = [
        7, 8, 9, 10, 11, 12, 13,
        null,
        14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
        null,
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        null,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
        null,
        50, 51, 52, 53, 54, 55, 56
    ];
    rows.push({ rowNumber: 18, seats: buildExplicitRow(18, row18Config), curve: 0 });

    // 19列目: 6〜13番(8席) - [通路] - 14〜25番(12席) - [通路] - 26〜37番(12席) - [通路] - 38〜49番(12席) - [通路] - 50〜57番(8席)
    const row19Config = [
        6, 7, 8, 9, 10, 11, 12, 13,
        null,
        14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
        null,
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        null,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
        null,
        50, 51, 52, 53, 54, 55, 56, 57
    ];
    rows.push({ rowNumber: 19, seats: buildExplicitRow(19, row19Config), curve: 0 });

    // 20列目〜22列目共通定義（5番〜58番）
    // 扉の場所(14-19番, 47-49番)は座席を削除し、null(空白)にする
    // 5〜13番 - [通路1] - [14-19番空白] - 20〜25番 - [通路2] - 26〜37番 - [通路3] - 38〜46番 - [47-49番空白] - [通路4] - 50〜58番
    const commonRow20_22 = [
        5, 6, 7, 8, 9, 10, 11, 12, 13,
        null, // 既存の通路1
        null, null, null, null, null, null, // 14-19番を空白（扉スペース）にする
        20, 21, 22, 23, 24, 25,
        null, // 既存の通路2
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        null, // 既存の通路3
        38, 39, 40, 41, 42, 43, 44, 45, 46,
        null, null, null, // 47-49番を空白（扉スペース）にする
        null, // 既存の通路4
        50, 51, 52, 53, 54, 55, 56, 57, 58
    ];

    rows.push({ rowNumber: 20, seats: buildExplicitRow(20, commonRow20_22), curve: 0 });
    rows.push({ rowNumber: 21, seats: buildExplicitRow(21, commonRow20_22), curve: 0 });
    rows.push({ rowNumber: 22, seats: buildExplicitRow(22, commonRow20_22), curve: 0 });

    // 23, 24列目：標準構成（5〜58番）
    const commonRow23_24 = [
        5, 6, 7, 8, 9, 10, 11, 12, 13, null,
        14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, null,
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, null,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, null,
        50, 51, 52, 53, 54, 55, 56, 57, 58
    ];
    rows.push({ rowNumber: 23, seats: buildExplicitRow(23, commonRow23_24), curve: 0 });
    rows.push({ rowNumber: 24, seats: buildExplicitRow(24, commonRow23_24), curve: 0 });

    // 25列目：14番のみ欠け（14番をnullに置き換え）
    const row25Config = [
        5, 6, 7, 8, 9, 10, 11, 12, 13, null,
        null, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, null, // 14 is null
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, null,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, null,
        50, 51, 52, 53, 54, 55, 56, 57, 58
    ];
    rows.push({ rowNumber: 25, seats: buildExplicitRow(25, row25Config), curve: 0 });

    // 26列目：5〜13番、50〜58番が欠け（両端をnullに置き換え）
    // 修正: 2026-01-31 14番が通路位置にズレるのを防ぐため、空白数を調整
    const row26Config = [
        null, null, null, null, null, null, null, null, null, // 5-13番のスペース(9個)
        null, // ★ここが重要：13番と14番の間の通路(1個)
        14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
        null, // 通路
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        null, // 通路
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
        null, // 49番の右隣の通路
        null, null, null, null, null, null, null, null, null // 50-58番のスペース(9個)
    ];
    rows.push({ rowNumber: 26, seats: buildExplicitRow(26, row26Config), curve: 0 });

    return { floor: 1, rows };
}
