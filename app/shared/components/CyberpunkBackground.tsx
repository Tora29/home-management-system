/**
 * サイバーパンク風の背景コンポーネント
 * 点滅するライト、グリッド背景、スキャンライン効果を提供
 */
export function CyberpunkBackground() {
  return (
    <>
      {/* 背景の点滅ライト */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* シアン系ライト */}
        <div
          className="absolute w-32 h-32 rounded-full bg-cyber-cyan blur-[80px] cyberpunk-flicker-1"
          style={{ top: "5%", left: "10%" }}
        />
        <div
          className="absolute w-24 h-24 rounded-full bg-cyber-cyan blur-[60px] cyberpunk-flicker-2"
          style={{ top: "40%", right: "5%" }}
        />
        <div
          className="absolute w-20 h-20 rounded-full bg-cyber-cyan blur-[50px] cyberpunk-flicker-4"
          style={{ bottom: "30%", left: "20%" }}
        />
        <div
          className="absolute w-16 h-16 rounded-full bg-cyber-cyan blur-2xl cyberpunk-flicker-6"
          style={{ top: "70%", left: "60%" }}
        />

        {/* マゼンタ系ライト */}
        <div
          className="absolute w-28 h-28 rounded-full bg-cyber-magenta blur-[70px] cyberpunk-flicker-3"
          style={{ top: "15%", right: "15%" }}
        />
        <div
          className="absolute w-20 h-20 rounded-full bg-cyber-magenta blur-[50px] cyberpunk-flicker-5"
          style={{ bottom: "20%", right: "25%" }}
        />
        <div
          className="absolute w-24 h-24 rounded-full bg-cyber-magenta blur-[60px] cyberpunk-flicker-1"
          style={{ top: "50%", left: "40%" }}
        />
      </div>

      {/* スキャンライン効果 */}
      <div className="pointer-events-none fixed inset-0 cyberpunk-scanlines z-0" />
    </>
  );
}
