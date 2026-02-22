// 3F (Third Floor) Seat Data Generator
// Based on 2F structure with similar grid layout

import { FloorMap, SeatBlock } from "@/types/theater";

interface RowData {
    rowNumber: number;
    blocks: (SeatBlock | null)[];
}

export function generateThirdFloor(): FloorMap {
    const rows: RowData[] = [];

    // ========================================
    // 3階 1列目：9ブロック構成
    // LB(4) + 8 + 8 + 7 + 12(center) + 7 + 8 + 8 + RB(4) = 66 seats
    // ========================================
    rows.push({
        rowNumber: 1,
        blocks: [
            { type: 'block', area: 'LB', seats: [3, 4, 5, 6] }, // LB: 4 seats (LB3-LB6)
            null, // Aisle
            { type: 'block', seats: [3, 4, 5, 6, 7, 8, 9, 10] }, // Block 1: 8 seats (3-10)
            null, // Aisle
            { type: 'block', seats: [11, 12, 13, 14, 15, 16, 17, 18] }, // Block 2: 8 seats (11-18)
            null, // Aisle
            { type: 'block', seats: [19, 20, 21, 22, 23, 24, 25] }, // Block 3: 7 seats (19-25)
            null, // Aisle (WIDE - left of center)
            { type: 'block', seats: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37] }, // Block 4: 12 seats (26-37) CENTER
            null, // Aisle (WIDE - right of center)
            { type: 'block', seats: [38, 39, 40, 41, 42, 43, 44] }, // Block 5: 7 seats (38-44)
            null, // Aisle
            { type: 'block', seats: [45, 46, 47, 48, 49, 50, 51, 52] }, // Block 6: 8 seats (45-52)
            null, // Aisle
            { type: 'block', seats: [53, 54, 55, 56, 57, 58, 59, 60] }, // Block 7: 8 seats (53-60)
            null, // Aisle
            { type: 'block', area: 'RB', seats: [3, 4, 5, 6] } // RB: 4 seats (RB3-RB6)
        ]
    });

    // ========================================
    // 3階 2列目：9ブロック構成
    // LB(3) + 8 + 9 + 8 + 12(center) + 8 + 9 + 8 + RB(3) = 68 seats
    // ========================================
    rows.push({
        rowNumber: 2,
        blocks: [
            { type: 'block', area: 'LB', seats: [7, 8, 9] }, // LB: 3 seats (LB7-LB9)
            null, // Aisle
            { type: 'block', seats: [1, 2, 3, 4, 5, 6, 7, 8] }, // Block 1: 8 seats (1-8)
            null, // Aisle
            { type: 'block', seats: [9, 10, 11, 12, 13, 14, 15, 16, 17] }, // Block 2: 9 seats (9-17)
            null, // Aisle
            { type: 'block', seats: [18, 19, 20, 21, 22, 23, 24, 25] }, // Block 3: 8 seats (18-25)
            null, // Aisle (WIDE - left of center)
            { type: 'block', seats: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37] }, // Block 4: 12 seats (26-37) CENTER
            null, // Aisle (WIDE - right of center)
            { type: 'block', seats: [38, 39, 40, 41, 42, 43, 44, 45] }, // Block 5: 8 seats (38-45)
            null, // Aisle
            { type: 'block', seats: [46, 47, 48, 49, 50, 51, 52, 53, 54] }, // Block 6: 9 seats (46-54)
            null, // Aisle
            { type: 'block', seats: [55, 56, 57, 58, 59, 60, 61, 62] }, // Block 7: 8 seats (55-62)
            null, // Aisle
            { type: 'block', area: 'RB', seats: [7, 8, 9] } // RB: 3 seats (RB7-RB9)
        ]
    });

    // ========================================
    // 3階 3列目：7ブロック構成（58席）LB/RBなし
    // 5 + 10 + 8 + 12(center) + 8 + 10 + 5 = 58 seats
    // ========================================
    rows.push({
        rowNumber: 3,
        blocks: [
            { type: 'block', seats: [3, 4, 5, 6, 7] }, // Block 1: 5 seats (3-7)
            null, // Aisle
            { type: 'block', seats: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17] }, // Block 2: 10 seats (8-17)
            null, // Aisle
            { type: 'block', seats: [18, 19, 20, 21, 22, 23, 24, 25] }, // Block 3: 8 seats (18-25)
            null, // Aisle (WIDE - left of center)
            { type: 'block', seats: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37] }, // Block 4: 12 seats (26-37) CENTER
            null, // Aisle (WIDE - right of center)
            { type: 'block', seats: [38, 39, 40, 41, 42, 43, 44, 45] }, // Block 5: 8 seats (38-45)
            null, // Aisle
            { type: 'block', seats: [46, 47, 48, 49, 50, 51, 52, 53, 54, 55] }, // Block 6: 10 seats (46-55)
            null, // Aisle
            { type: 'block', seats: [56, 57, 58, 59, 60] } // Block 7: 5 seats (56-60)
        ]
    });

    // ========================================
    // 3階 4列目：5ブロック構成（47席）LB/RBなし
    // 12 + 10 + 12(center) + 5 + [gap 43-49] + 12 = 51 seats - 4 gap = 47 seats
    // 42番の次は50番（43-49は欠番）
    // ========================================
    rows.push({
        rowNumber: 4,
        blocks: [
            { type: 'block', seats: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] }, // Block 1: 12 seats (4-15)
            null, // Aisle
            { type: 'block', seats: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25] }, // Block 2: 10 seats (16-25)
            null, // Aisle (WIDE - left of center)
            { type: 'block', seats: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37] }, // Block 3: 12 seats (26-37) CENTER
            null, // Aisle (WIDE - right of center)
            { type: 'block', seats: [38, 39, 40, 41, 42] }, // Block 4: 5 seats (38-42) - ends here, 43-49 missing
            null, // Wide gap (missing seats 43-49)
            { type: 'block', seats: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61] } // Block 5: 12 seats (50-61)
        ]
    });

    // ========================================
    // 3階 5列目：5ブロック構成（52席）LB/RBなし
    // 12 + 10 + 12(center) + 6 + [gap 44-49] + 12 = 52 seats
    // 44-49番は欠番、43番の次は50番
    // Row 5の4, 16, 26, 50番をRow 4と垂直に揃え、Block 4のみ千鳥配置
    // ========================================
    rows.push({
        rowNumber: 5,
        blocks: [
            { type: 'block', seats: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] }, // Block 1: 12 seats (4-15)
            null, // Aisle
            { type: 'block', seats: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25] }, // Block 2: 10 seats (16-25)
            null, // Aisle (WIDE - left of center)
            { type: 'block', seats: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37] }, // Block 3: 12 seats (26-37) CENTER
            null, // Aisle (WIDE - right of center)
            { type: 'block', seats: [38, 39, 40, 41, 42, 43] }, // Block 4: 6 seats (38-43) - ends here, 44-49 missing
            null, // Wide gap (missing seats 44-49)
            { type: 'block', seats: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61] } // Block 5: 12 seats (50-61)
        ]
    });

    // ========================================
    // 3階 6列目：5ブロック構成（53席）LB/RBなし
    // 12 + 11 + 12(center) + 6 + [gap 44-49] + 12 = 53 seats
    // 44-49番は欠番、43番の次は50番
    // Row 6の4, 16, 26, 38, 50番をRow 5と垂直に揃える（左側2ブロックは1席拡張）
    // ========================================
    rows.push({
        rowNumber: 6,
        blocks: [
            { type: 'block', seats: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] }, // Block 1: 12 seats (3-14)
            null, // Aisle
            { type: 'block', seats: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25] }, // Block 2: 11 seats (15-25)
            null, // Aisle (WIDE - left of center)
            { type: 'block', seats: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37] }, // Block 3: 12 seats (26-37) CENTER
            null, // Aisle (WIDE - right of center)
            { type: 'block', seats: [38, 39, 40, 41, 42, 43] }, // Block 4: 6 seats (38-43) - ends here, 44-49 missing
            null, // Wide gap (missing seats 44-49)
            { type: 'block', seats: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61] } // Block 5: 12 seats (50-61)
        ]
    });

    // ========================================
    // 3階 7列目：5ブロック構成（60席）LB/RBなし
    // 12 + 12 + 12(center) + 12 + 12 = 60 seats
    // 44-49番が埋まり、38番から49番まで連続
    // Row 7の3, 15, 26, 38, 50番をRow 6と垂直に揃える（左側2ブロックは1席拡張）
    // ========================================
    rows.push({
        rowNumber: 7,
        blocks: [
            { type: 'block', seats: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] }, // Block 1: 12 seats (2-13)
            null, // Aisle
            { type: 'block', seats: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25] }, // Block 2: 12 seats (14-25)
            null, // Aisle (WIDE - left of center)
            { type: 'block', seats: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37] }, // Block 3: 12 seats (26-37) CENTER
            null, // Aisle (WIDE - right of center)
            { type: 'block', seats: [38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49] }, // Block 4: 12 seats (38-49) - 44-49 now filled!
            null, // Aisle
            { type: 'block', seats: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61] } // Block 5: 12 seats (50-61)
        ]
    });

    return {
        floor: 3,
        rows: rows.map(row => ({
            rowNumber: row.rowNumber,
            seats: [],
            blocks: row.blocks
        })) as any
    };
}
