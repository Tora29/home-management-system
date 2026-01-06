// React・ライブラリ
import { TrendingDown, TrendingUp } from "lucide-react";

// 型定義
import type { Route } from "./+types/route";
import type { InventorySummary, StockMovement } from "./schema";

// サービス
import * as inventoryService from "./service/inventory.service";

// 共有コンポーネント
import { AppHeader } from "~/shared/components/AppHeader";
import { CyberpunkBackground } from "~/shared/components/CyberpunkBackground";
import { RouteErrorBoundary } from "~/shared/components/RouteErrorBoundary";
import { logout } from "~/shared/lib/session.server";

// ローカルコンポーネント
import { RecentMovementsTable } from "./components/RecentMovementsTable";
import { StatCard } from "./components/StatCard";

export function loader(): {
  summary: InventorySummary;
  movements: StockMovement[];
} {
  return {
    summary: inventoryService.getInventorySummary(),
    movements: inventoryService.getRecentMovements(),
  };
}

export async function action({ request }: Route.ActionArgs) {
  return logout(request);
}

export default function DashboardRoute({ loaderData }: Route.ComponentProps) {
  const { summary, movements } = loaderData;

  return (
    <div className="min-h-screen cyberpunk-bg relative overflow-hidden">
      <CyberpunkBackground />

      {/* メインコンテンツ */}
      <div className="relative z-10">
        {/* ヘッダー */}
        <AppHeader />

        {/* ダッシュボードコンテンツ */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 統計カード */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="TOTAL ITEMS"
              value={summary.totalItems}
              subValue={`${summary.totalQuantity} units`}
              color="cyan"
              id="INV-01"
            />
            <StatCard
              label="STOCK IN"
              value={summary.recentInCount}
              subValue="This week"
              color="green"
              icon={<TrendingUp size={16} aria-hidden="true" />}
              id="INV-02"
            />
            <StatCard
              label="STOCK OUT"
              value={summary.recentOutCount}
              subValue="This week"
              color="magenta"
              icon={<TrendingDown size={16} aria-hidden="true" />}
              id="INV-03"
            />
            <StatCard
              label="LOW STOCK"
              value={summary.lowStockCount}
              subValue="Items below threshold"
              color="orange"
              id="INV-04"
              isWarning
            />
          </section>

          {/* 直近の入出庫履歴 */}
          <RecentMovementsTable movements={movements} />
        </main>
      </div>
    </div>
  );
}

// エラーバウンダリ
export { RouteErrorBoundary as ErrorBoundary };
