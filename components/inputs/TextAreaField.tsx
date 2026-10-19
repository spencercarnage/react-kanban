import classNames from "classnames";
import { useId, type ComponentProps } from "react";
import FieldError from "./FieldError";

type TextAreaFieldProps = ComponentProps<"textarea"> & {
  label: string;
  error?: string;
};

/** A labelled textarea. Spread `register("name")` from react-hook-form onto it. */
export default function TextAreaField({ label, error, className, ...props }: TextAreaFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={classNames(
          "resize-y rounded-lg border bg-white px-3 py-2 text-sm dark:bg-zinc-950",
          error ? "border-red-500" : "border-zinc-300 dark:border-zinc-700",
          className,
        )}
        {...props}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
