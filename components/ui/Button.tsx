"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "pill" | "primary";
type ButtonSize = "sm" | "md";

interface SharedButtonProps {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

type ButtonProps = SharedButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;
type ButtonLinkProps = SharedButtonProps & AnchorHTMLAttributes<HTMLAnchorElement>;

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getButtonClasses(variant: ButtonVariant, size: ButtonSize) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]";

  const sizes: Record<ButtonSize, string> = {
    sm: "min-h-10 px-4 py-2 text-sm font-medium",
    md: "min-h-11 px-5 py-2.5 text-sm font-medium",
  };

  const variants: Record<ButtonVariant, string> = {
    pill: "border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]",
    primary:
      "border border-transparent bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90",
  };

  return cx(base, sizes[size], variants[variant]);
}

export function Button({
  children,
  className,
  variant = "pill",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button className={cx(getButtonClasses(variant, size), className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  className,
  variant = "pill",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <a className={cx(getButtonClasses(variant, size), className)} {...props}>
      {children}
    </a>
  );
}
