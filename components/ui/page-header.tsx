import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("mx-auto max-w-4xl space-y-5 text-center", className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#72f7cf]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-display text-4xl leading-tight text-white md:text-6xl">
        {title}
      </h1>
      <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#b8c7d9] md:text-lg">
        {description}
      </p>
    </header>
  );
}
