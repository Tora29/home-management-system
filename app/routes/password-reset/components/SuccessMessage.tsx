type SuccessMessageProps = {
  resetUrl: string | null;
};

/** パスワードリセット成功メッセージ */
export function SuccessMessage({ resetUrl }: SuccessMessageProps) {
  return (
    <div
      role="alert"
      className="
        relative mb-6 p-4 text-sm font-mono
        border-l-4 border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66]
      "
    >
      {/* ステータスドット */}
      <div className="absolute top-4 right-4">
        <div className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
      </div>
      <span className="text-[10px] uppercase tracking-widest block mb-1">
        SUCCESS
      </span>
      <p className="font-medium">RESET LINK GENERATED</p>

      {resetUrl && (
        <a
          href={resetUrl}
          className="
            mt-3 block p-3
            bg-[#18182a]
            border border-[#2a2a44]
            text-[#00f0ff] text-center text-xs
            break-all
            hover:border-[#00f0ff]
            hover:shadow-[inset_0_0_10px_rgba(0,240,255,0.1)]
            transition-all
          "
          style={{
            clipPath: "polygon(8px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 8px)",
          }}
        >
          {resetUrl}
        </a>
      )}

      {!resetUrl && (
        <p className="mt-2 text-[#606080] text-xs">NO MATCHING USER FOUND</p>
      )}
    </div>
  );
}
