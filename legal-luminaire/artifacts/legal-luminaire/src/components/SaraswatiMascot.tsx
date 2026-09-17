import type { MouseEventHandler } from "react";
import { cn } from "@/lib/utils";

const SARASWATI_IMAGE = "/saraswati.jpg";

export function SaraswatiLogo({
  size = "md",
}: {
  size?: "xs" | "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    xs: "h-8 w-8",
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-primary/20 shadow-lg", sizeClasses[size])}>
      <img
        src={SARASWATI_IMAGE}
        alt="माँ सरस्वती"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export interface SaraswatiMascotProps {
  size?: "sm" | "md" | "lg" | "xl";
  mood?: "happy" | "encouraging" | "celebrating" | "teaching";
  message?: string;
  className?: string;
  showMessage?: boolean;
  showCredit?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const SIZE_CLASS = {
  sm: "h-24 w-24",
  md: "h-32 w-32",
  lg: "h-40 w-40",
  xl: "h-48 w-48",
};

const MOOD_MESSAGE = {
  happy: "नमस्ते! आज कुछ नया सीखें! 📚",
  encouraging: "शाबाश! आप बहुत अच्छा कर रहे हैं! 🌟",
  celebrating: "बधाई हो! आपने पाठ पूरा किया! 🎉",
  teaching: "ज्ञान ही शक्ति है। सीखते रहें! 🙏",
};

/** Adapted from PREET_ENGLISH's local Saraswati component and asset. */
export function SaraswatiMascot({
  size = "md",
  mood = "happy",
  message,
  className,
  showMessage = true,
  showCredit = false,
  onClick,
}: SaraswatiMascotProps) {
  const content = (
    <>
      <div
        className={cn(
          "relative overflow-hidden rounded-full border-[3px] border-primary/20 bg-background p-1 shadow-2xl",
          SIZE_CLASS[size],
        )}
      >
        <div className="relative h-full w-full overflow-hidden rounded-full bg-secondary">
          <img
            src={SARASWATI_IMAGE}
            alt="माँ सरस्वती - Goddess of Knowledge"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
          />
        </div>
        <div
          className="absolute inset-0 rounded-full border border-primary/30"
          style={{ animationDuration: "10s" }}
          aria-hidden="true"
        />
      </div>

      {showCredit && (
        <div className="mt-3 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
          <p className="text-center text-xs font-bold tracking-wide text-primary">
            ✨ Mrs. Premlata Jain
          </p>
        </div>
      )}

      {showMessage && (
        <div className="relative mt-4 max-w-[240px]">
          <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-primary/20 bg-white dark:bg-slate-800" />
          <div className="relative rounded-2xl border border-primary/20 bg-white px-5 py-4 shadow-xl dark:bg-slate-800">
            <p className="text-center text-sm font-medium leading-relaxed text-foreground/80">
              {message ?? MOOD_MESSAGE[mood]}
            </p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div
      className={cn("flex flex-col items-center", onClick && "cursor-pointer", className)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick(
                  event as unknown as Parameters<MouseEventHandler<HTMLDivElement>>[0],
                );
              }
            }
          : undefined
      }
    >
      {content}
    </div>
  );
}

export function SaraswatiMascotCompact({
  onClick,
  className,
}: Pick<SaraswatiMascotProps, "onClick" | "className">) {
  return (
    <SaraswatiMascot
      size="sm"
      showMessage={false}
      onClick={onClick}
      className={className}
    />
  );
}
