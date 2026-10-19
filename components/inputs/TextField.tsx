import classNames from "classnames";
import { useId, type ComponentProps } from "react";
import FieldError from "./FieldError";

type TextFieldProps = ComponentProps<"input"> & {
  label: string;
  error?: string;
};

/** A labelled text input. Spread `register("name")` from react-hook-form onto it. */
export default function TextField({ label, error, className, ...props }: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={classNames(
          "rounded-lg border bg-white px-3 py-2 text-sm dark:bg-zinc-950",
          error ? "border-red-500" : "border-zinc-300 dark:border-zinc-700",
          className,
        )}
        {...props}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
