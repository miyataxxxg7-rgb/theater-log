import { FloorMap, Seat, SeatBlock } from "@/types/theater";

export function generateSecondFloor(): FloorMap {
    const rows: Array<{
        rowNumber: number;
        blocks: (SeatBlock | null)[];
    }> = [];

    // 1列目：6(LB) - 9 - 8 - 7 - 12 - 7 - 8 - 9 - 6(RB)
    rows.push({
        rowNumber: 1,
        blocks: [
            { type: 'block', area: 'LB', seats: [1, 2, 3, 4, 5, 6] },
            null,
            { type: 'block', seats: [2, 3, 4, 5, 6, 7, 8, 9, 10] },
            null,
            { type: 'block', seats: [11, 12, 13, 14, 15, 16, 17, 18] },
            null,
            { type: 'block', seats: [19, 20, 21, 22, 23, 24, 25] },
            null,
            { type: 'block', seats: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37] },
            null,
            { type: 'block', seats: [38, 39, 40, 41, 42, 43, 44] },
            null,
            { type: 'block', seats: [45, 46, 47, 48, 49, 50, 51, 52] },
            null,
            { type: 'block', seats: [53, 54, 55, 56, 57, 58, 59, 60, 61] },
            null,
            { type: 'block', area: 'RB', seats: [1, 2, 3, 4, 5, 6] }
        ]
    });

    // 2列目：4(LB) - 8 - 9 - 8 - 12 - 8 - 10 - 8 - 4(RB)
    rows.push({
        rowNumber: 2,
        blocks: [
            { type: 'block', area: 'LB', seats: [7, 8, 9, 10] },
            null,
            { type: 'block', seats: [1, 2, 3, 4, 5, 6, 7, 8] },
            null,
            { type: 'block', seats: [9, 10, 11, 12, 13, 14, 15, 16, 17] },
            null,
            { type: 'block', seats: [18, 19, 20, 21, 22, 23, 24, 25] },
            null,
            { type: 'block', seats: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37] },
            null,
            { type: 'block', seats: [38, 39, 40, 41, 42, 43, 44, 45] },
            null,
            { type: 'block', seats: [46, 47, 48, 49, 50, 51, 52, 53, 54] },
            null,
            { type: 'block', seats: [55, 56, 57, 58, 59, 60, 61, 62] },
            null,
            { type: 'block', area: 'RB', seats: [7, 8, 9, 10] }
        ]
    });

    // 3列目：LB(empty) - 5(with spacers) - 10 - 8 - 12 - 8 - 10 - 5 - RB(empty)
    // Seats 3-60 (block 1 has internal spacers for seats 1-2)
    // Aligned with row 2 seat 3
    rows.push({
        rowNumber: 3,
        blocks: [
            { type: 'block', area: 'LB', seats: [null, null, null, null] }, // LB area: empty (4 spacers)
            null, // Aisle
            { type: 'block', seats: [null, null, 3, 4, 5, 6, 7, null] }, // Block 1: 8 positions (2 spacers + 5 seats + 1 spacer, matches row 2 width)
            null, // Aisle
            { type: 'block', seats: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17] }, // Block 2: 10 seats
            null, // Aisle
            { type: 'block', seats: [18, 19, 20, 21, 22, 23, 24, 25] }, // Block 3: 8 seats
            null, // Aisle
            { type: 'block', seats: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37] }, // Block 4: 12 seats (center)
            null, // Aisle
            { type: 'block', seats: [38, 39, 40, 41, 42, 43, 44, 45] }, // Block 5: 8 seats
            null, // Aisle
            { type: 'block', seats: [46, 47, 48, 49, 50, 51, 52, 53, 54, 55] }, // Block 6: 10 seats
            null, // Aisle
            { type: 'block', seats: [56, 57, 58, 59, 60] }, // Block 7: 5 seats
            null, // Aisle
            { type: 'block', area: 'RB', seats: [null, null, null, null] } // RB area: empty (4 spacers)
        ]
    });

    // 4列目：LB(empty) - 3 - 11 - 9 - 12 - 9 - 11 - 3 - RB(empty)
    // Seats 3-60 (no LB/RB seats)
    // Row 4 seat 3 aligns with Row 3 seat 4 (column 12)
    // Need 3 spacers at start of block 1
    rows.push({
        rowNumber: 4,
        blocks: [
            { type: 'block', area: 'LB', seats: [null, null, null, null] }, // LB area: empty (4 spacers)
            null, // Aisle
            { type: 'block', seats: [null, null, null, 3, 4, 5] }, // Block 1: 6 positions (3 spacers + 3 seats)
            null, // Aisle
            { type: 'block', seats: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }, // Block 2: 11 seats
            null, // Aisle
            { type: 'block', seats: [17, 18, 19, 20, 21, 22, 23, 24, 25] }, // Block 3: 9 seats
            null, // Aisle
            { type: 'block', seats: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37] }, // Block 4: 12 seats (center)
            null, // Aisle
            { type: 'block', seats: [38, 39, 40, 41, 42, 43, 44, 45, 46] }, // Block 5: 9 seats
            null, // Aisle
            { type: 'block', seats: [47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57] }, // Block 6: 11 seats
            null, // Aisle
            { type: 'block', seats: [58, 59, 60] }, // Block 7: 3 seats
            null, // Aisle
            { type: 'block', area: 'RB', seats: [null, null, null, null] } // RB area: empty (4 spacers)
        ]
    });

    // 5列目：5ブロック構成（通路後の最初の列）
    // Seats 4-59 (56 seats, no LB/RB)
    // Row 5 seat 5 aligns with Row 4 seat 6 (column 17)
    // Center block (26-37) must align at column 39
    rows.push({
        rowNumber: 5,
        blocks: [
            { type: 'block', seats: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] }, // Block 1: 12 seats
            null, // Aisle
            { type: 'block', seats: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25] }, // Block 2: 10 seats
            null, // Aisle
            { type: 'block', seats: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37] }, // Block 3: 12 seats (center)
            null, // Aisle
            { type: 'block', seats: [38, 39, 40, 41, 42, 43, 44, 45, 46, 47] }, // Block 4: 10 seats
            null, // Aisle
            { type: 'block', seats: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59] } // Block 5: 12 seats
        ]
    });

    // 6列目：5ブロック構成（58席）
    // 左アンカー: R6-3 = R5-4 = column 17
    // 中央アンカー: R6-26 = R5-26 = column 44
    // 5列目との間隔: 8px（広い通路なし）
    rows.push({
        rowNumber: 6,
        blocks: [
            { type: 'block', seats: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] }, // Block 1: 12 seats (3-14)
            null, // Aisle
            { type: 'block', seats: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25] }, // Block 2: 11 seats (15-25)
            null, // Aisle
            { type: 'block', seats: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37] }, // Block 3: 12 seats (26-37) CENTER
            null, // Aisle
            { type: 'block', seats: [38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48] }, // Block 4: 11 seats (38-48)
            null, // Aisle
            { type: 'block', seats: [49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60] } // Block 5: 12 seats (49-60)
        ]
    });

    // 7列目：4ブロック構成（48席）
    // 左アンカー: R7-2 = R6-3 = R5-4 = column 17
    // 中央アンカー: R7-25 = column 45 (24-25間の広い通路を継承)
    // 6列目との間隔: 8px（広い通路なし）
    rows.push({
        rowNumber: 7,
        blocks: [
            { type: 'block', seats: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] }, // Block 1: 12 seats (2-13)
            null, // Aisle
            { type: 'block', seats: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] }, // Block 2: 11 seats (14-24)
            null, // Aisle (WIDE - aligns with 25-26 aisle above)
            { type: 'block', seats: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36] }, // Block 3: 12 seats (25-36)
            null, // Aisle
            { type: 'block', seats: [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49] } // Block 4: 13 seats (37-49)
        ]
    });

    // All rows (1-7) complete

    return {
        floor: 2,
        rows: rows.map(row => ({
            rowNumber: row.rowNumber,
            seats: [], // Will be processed by SeatMap2F component
            blocks: row.blocks
        })) as any // Temporary type assertion
    };
}
