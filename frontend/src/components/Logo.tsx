export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <img
      src={compact ? "/brand/mark.svg" : "/brand/logo.svg"}
      width={compact ? 40 : 264}
      height={compact ? 40 : 34}
      className="h-auto max-w-full shrink-0"
      alt="NaviGators"
    />
  );
}
