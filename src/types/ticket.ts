// チケットのステータス型
export type TicketStatus =
    | 'applying'      // 申し込み中
    | 'won_unpaid'    // 当選・未入金
    | 'paid_unissued' // 入金済み・未発券
    | 'issued'        // 発券済み
    | 'watched';      // 観劇済み

// チケット情報型
export interface Ticket {
    id: string;
    title: string; // 公演名
    status: TicketStatus;

    // 日程情報
    dates: {
        applicationStart?: string;    // 申込開始日 (YYYY-MM-DD)
        applicationEnd?: string;      // 申込終了日 (YYYY-MM-DD)
        resultDate?: string;          // 当落発表日 (YYYY-MM-DD)
        paymentDeadline?: string;     // 入金締切日時 (ISO string)
        ticketIssueDate?: string;     // 発券開始日 (YYYY-MM-DD)
        showDate?: string;            // 公演日時 (ISO string)
    };

    // 追加情報（オプション）
    venue?: string;      // 会場
    seatInfo?: string;   // 座席情報
    memo?: string;       // メモ

    // メタデータ
    createdAt: string;   // 作成日時
    updatedAt: string;   // 更新日時
}

// ステータス別の設定
export const STATUS_CONFIG = {
    applying: {
        label: '申し込み中',
        color: '#06b6d4',      // シアン
        bgColor: '#e0f2fe',    // 淡いシアン
        borderColor: '#0891b2',
        icon: '📝',
        description: 'チケット申込期間中',
        important: false,
    },
    won_unpaid: {
        label: '当選・未入金',
        color: '#ef4444',      // 赤
        bgColor: '#fee2e2',    // 淡い赤
        borderColor: '#dc2626',
        icon: '⚠️',
        important: true,       // 重要フラグ
        description: '入金締切に注意！',
    },
    paid_unissued: {
        label: '入金済み・未発券',
        color: '#10b981',      // 緑
        bgColor: '#d1fae5',    // 淡い緑
        borderColor: '#059669',
        icon: '💳',
        description: '発券開始をお待ちください',
        important: false,
    },
    issued: {
        label: '発券済み',
        color: '#f59e0b',      // ゴールド
        bgColor: '#fef3c7',    // 淡い黄色
        borderColor: '#d97706',
        icon: '🎫',
        description: '公演当日をお楽しみに！',
        important: false,
    },
    watched: {
        label: '観劇済み',
        color: '#ec4899',      // ピンク
        bgColor: '#fce7f3',    // 淡いピンク
        borderColor: '#db2777',
        icon: '💕',
        description: '思い出を記録しましょう',
        important: false,
    },
} as const;

// ステータスラベルを取得
export const getStatusLabel = (status: TicketStatus): string => {
    return STATUS_CONFIG[status].label;
};

// ステータス色を取得
export const getStatusColor = (status: TicketStatus): string => {
    return STATUS_CONFIG[status].color;
};

// 重要ステータスかチェック
export const isImportantStatus = (status: TicketStatus): boolean => {
    return STATUS_CONFIG[status].important === true;
};
