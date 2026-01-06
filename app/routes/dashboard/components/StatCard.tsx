// 型定義
import type { StatCardProps } from "./types";

// 共有スタイル
import { colorVariants } from "~/shared/styles/colorVariants";

// 統計カードコンポーネント
export function StatCard({
  label,
  value,
  subValue,
  color,
  icon,
  id,
  isWarning,
}: StatCardProps) {
  const colors = colorVariants[color];

  return (
    <div
      className={`
        relative
        bg-cyber-surface
        border ${colors.border}
        overflow-hidden
      `}
      style={{
        clipPath:
          "polygon(0% 0%, calc(100% - 16px) 0%, 100% 16px, 100% 100%, 16px 100%, 0% calc(100% - 16px))",
      }}
    >
      {/* 上部ボーダーライン */}
      <div
        className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent ${colors.gradient} to-transparent`}
      />

      {/* コーナーブラケット（左上） */}
      <div className="absolute top-2 left-2">
        <div className={`w-3 h-3 border-t border-l ${colors.border}`} />
      </div>

      {/* 識別子（右上） */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <span className="text-cyber-text-dim text-[10px] font-mono">{id}</span>
        <div className="flex gap-0.5">
          <div className={`w-1.5 h-1.5 rounded-sm ${colors.bg}`} />
          <div className={`w-1.5 h-1.5 rounded-sm ${colors.bgFaded}`} />
        </div>
      </div>

      {/* 警告ストライプ（lowStock用） */}
      {isWarning && (
        <div
          className="absolute left-0 top-0 bottom-0 w-2"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              var(--cyber-orange) 0px,
              var(--cyber-orange) 4px,
              var(--cyber-dark) 4px,
              var(--cyber-dark) 8px
            )`,
          }}
        />
      )}

      {/* メインコンテンツ */}
      <div className={`p-5 ${isWarning ? "pl-6" : ""}`}>
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <span
            className={`${colors.text} font-mono text-xs uppercase tracking-wider`}
          >
            {label}
          </span>
        </div>
        <div className={`text-3xl font-bold font-mono ${colors.value}`}>
          {value.toLocaleString()}
        </div>
        <div className="text-cyber-text-dim text-xs mt-1">{subValue}</div>
      </div>

      {/* 下部装飾 */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent ${colors.gradient}/50 to-transparent`}
      />
    </div>
  );
}
