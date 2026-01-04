// 型定義
import type { PasswordStrength } from "../schema";

type PasswordStrengthIndicatorProps = {
  strength: PasswordStrength;
};

/**
 * パスワード強度インジケーターコンポーネント
 * 4段階のバーでパスワードの強度を視覚的に表示
 */
export function PasswordStrengthIndicator({
  strength,
}: PasswordStrengthIndicatorProps) {
  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`
              h-1 flex-1 rounded-full transition-colors
              ${index < strength.score ? strength.color : "bg-hig-gray4"}
            `}
          />
        ))}
      </div>
      <p className="text-xs text-hig-secondary-label">
        パスワード強度: {strength.label}
      </p>
    </div>
  );
}
