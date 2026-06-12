import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      dir="ltr"
      aria-label="ScaleFlow Academy"
      className="inline-flex items-baseline gap-1.5 font-logo"
    >
      <span className="text-xl font-bold tracking-tight text-on-surface md:text-2xl">
        ScaleFlow
      </span>
      <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary md:text-xs">
        Academy
      </span>
    </Link>
  );
}
