// 型定義
import type { StockMovement } from "../schema";
import type { ColorVariant } from "~/shared/styles/colorVariants";

// 統計カードのProps
export type StatCardProps = {
  label: string;
  value: number;
  subValue: string;
  color: ColorVariant;
  icon?: React.ReactNode;
  id: string;
  isWarning?: boolean;
};

// 入出庫履歴テーブルのProps
export type RecentMovementsTableProps = {
  movements: StockMovement[];
};
