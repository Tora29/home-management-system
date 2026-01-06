// React・ライブラリ
import { Link } from "react-router";
import { Clock } from "lucide-react";

// 型定義
import type { RecentMovementsTableProps } from "./types";

// 直近の入出庫テーブルコンポーネント
export function RecentMovementsTable({ movements }: RecentMovementsTableProps) {
  return (
    <div className="relative bg-cyber-surface border border-cyber-border overflow-hidden">
      {/* ヘッダー装飾 */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-cyber-cyan via-cyber-magenta to-cyber-cyan" />

      {/* コーナーブラケット */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyber-cyan" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyber-cyan" />

      {/* テーブルヘッダー */}
      <div className="px-4 py-3 border-b border-cyber-border flex items-center justify-between bg-cyber-surface-2">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-cyber-cyan" aria-hidden="true" />
          <span className="text-cyber-cyan text-xs font-mono uppercase tracking-wider">
            RECENT ACTIVITY
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-cyber-text-dim text-[10px] font-mono">
            REC: {movements.length}
          </span>
          <div className="w-1.5 h-1.5 bg-cyber-green rounded-full animate-pulse" />
        </div>
      </div>

      {/* テーブル本体 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cyber-border">
              <th className="px-4 py-2 text-cyber-text-dim text-[10px] font-mono uppercase tracking-wider text-left">
                DATE
              </th>
              <th className="px-4 py-2 text-cyber-text-dim text-[10px] font-mono uppercase tracking-wider text-left">
                ITEM
              </th>
              <th className="px-4 py-2 text-cyber-text-dim text-[10px] font-mono uppercase tracking-wider text-center">
                TYPE
              </th>
              <th className="px-4 py-2 text-cyber-text-dim text-[10px] font-mono uppercase tracking-wider text-right">
                QTY
              </th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr
                key={movement.id}
                className="border-b border-cyber-border-dim hover:bg-cyber-cyan/5 transition-colors"
              >
                <td className="px-4 py-3 text-cyber-text-dim font-mono text-sm">
                  {movement.date}
                </td>
                <td className="px-4 py-3 text-cyber-text text-sm">
                  {movement.itemName}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`
                      inline-flex items-center gap-1.5
                      text-[10px] font-mono uppercase
                      ${movement.type === "in" ? "text-cyber-green" : "text-cyber-magenta"}
                    `}
                  >
                    <span
                      className={`
                        w-1.5 h-1.5 rounded-full
                        ${movement.type === "in" ? "bg-cyber-green" : "bg-cyber-magenta"}
                      `}
                    />
                    {movement.type === "in" ? "IN" : "OUT"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`
                      font-mono text-sm
                      ${movement.type === "in" ? "text-cyber-green" : "text-cyber-magenta"}
                    `}
                  >
                    {movement.type === "in" ? "+" : "-"}
                    {movement.quantity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* フッター */}
      <div className="px-4 py-3 border-t border-cyber-border flex justify-end">
        <Link
          to="/stock/history"
          className="text-cyber-cyan text-xs font-mono uppercase tracking-wider hover:text-cyber-cyan/80 transition-colors"
        >
          VIEW ALL RECORDS &gt;&gt;
        </Link>
      </div>

      {/* 下部コーナーブラケット */}
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-cyber-magenta" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-cyber-magenta" />
    </div>
  );
}
