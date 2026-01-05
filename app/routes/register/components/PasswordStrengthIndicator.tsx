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
                  : "bg-[#2a2a44]"
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
        <p className="text-[10px] font-mono uppercase tracking-widest text-[#606080]">
          SECURITY LEVEL:{" "}
          <span
            className={`${
              strength.score === 0
                ? "text-[#ff0044]"
                : strength.score === 1
                  ? "text-[#ff8800]"
                  : strength.score === 2
                    ? "text-[#ffcc00]"
                    : strength.score === 3
                      ? "text-[#00ff66]"
                      : "text-[#00f0ff]"
            }`}
          >
            {strength.label || "N/A"}
          </span>
        </p>
      </div>
    </div>
  );
}
