import classNames from "classnames";
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};

export default function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classNames(
        "rounded-lg font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500 disabled:opacity-50",
        {
          "px-4 py-2 text-sm": size === "md",
          "px-2.5 py-1 text-xs": size === "sm",
          "bg-lime-400 text-zinc-900 hover:bg-lime-300": variant === "primary",
          "border border-zinc-300 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800":
            variant === "secondary",
          "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100":
            variant === "ghost",
          "bg-red-600 text-white hover:bg-red-500": variant === "danger",
        },
        className,
      )}
      {...props}
    />
  );
}
