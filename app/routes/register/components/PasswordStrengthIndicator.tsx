// 型定義
import type { PasswordStrength } from "../schema";

type PasswordStrengthIndicatorProps = {
  strength: PasswordStrength;
};

/** パスワード強度インジケーター */
export function PasswordStrengthIndicator({
  strength,
}: PasswordStrengthIndicatorProps) {
  return (
    <div className="space-y-2 mt-2">
      {/* 強度バー */}
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`
              h-1.5 flex-1 transition-all duration-300
              ${
                index < strength.score
                  ? `${strength.color} shadow-[0_0_8px_currentColor]`
                  : "bg-cyber-border"
              }
            `}
            style={{
              clipPath:
                "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)",
            }}
          />
        ))}
      </div>
      {/* ステータス表示 */}
      <div className="flex items-center gap-2">
        <div
          className={`w-1.5 h-1.5 rounded-full ${strength.color} ${strength.score > 0 ? "animate-pulse" : ""}`}
        />
        <p className="text-[10px] font-mono uppercase tracking-widest text-cyber-text-dim">
          SECURITY LEVEL:{" "}
          <span
            className={`${
              strength.score === 0
                ? "text-cyber-red"
                : strength.score === 1
                  ? "text-cyber-orange-bright"
                  : strength.score === 2
                    ? "text-cyber-yellow-medium"
                    : strength.score === 3
                      ? "text-cyber-green"
                      : "text-cyber-cyan"
            }`}
          >
            {strength.label || "N/A"}
          </span>
        </p>
      </div>
    </div>
  );
}
